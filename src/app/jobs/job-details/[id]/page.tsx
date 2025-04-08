/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { JobPosting } from "../../../models/jobPosting";
import { notFound, useParams, useRouter } from "next/navigation";
import { CheckCircle, Calendar, MapPin, Clock, Briefcase, Building, Bookmark, BookmarkCheck } from "lucide-react";
import { Organization } from "../../../models/organization";
import { FaFacebook, FaXTwitter, FaLinkedin } from "react-icons/fa6";
import axios from "axios";
import { CVUploadSection } from "@/components/job/cv-upload-section";
import { format, parseISO } from "date-fns";

interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  organization: Organization;
  profile: {
    cv?: string;
  } | null;
  resume?: {
    path?: string;
    filename?: string;
  } | null;
}

interface ScreeningQuestion {
  id: string;
  question: string;
  jobPostId: string;
  createdAt: string;
  updatedAt: string;
}

interface ScreeningQuestionsResponse {
  items: ScreeningQuestion[];
  total: number;
}

const JobDetail = () => {
  const params = useParams();
  const id = params.id as string;
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  if (!id) return notFound();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [job, setJob] = useState<JobPosting | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [jobUrl, setJobUrl] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  //Application variables
  const [showForm, setShowForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [cv, setCv] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [screeningQuestions, setScreeningQuestions] = useState<string[]>([]);
  const [screeningAnswers, setScreeningAnswers] = useState<Record<number, string>>({});
  const applySectionRef = useRef<HTMLDivElement | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    setMounted(true);
    setJobUrl(window.location.href);
    const org = localStorage.getItem("organization");
    if (org) {
      const userData = JSON.parse(org) as UserData;
      setOrganization(userData.organization);
      setUserData(userData);
      console.log(userData);
    }

    fetchJob();
    fetchScreeningQuestions();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jobUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const fetchScreeningQuestions = async () => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = `http://196.188.249.24:3010/api/pre-screening-questions?q=w=jobPostId:=:${id}`;

      const res = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch screening questions");

      const data = await res.json() as ScreeningQuestionsResponse;
      console.log("Screening questions:", data);

      if (data && data.items && Array.isArray(data.items)) {
        // Extract questions from the response
        const questions = data.items.map((item: ScreeningQuestion) => item.question);
        setScreeningQuestions(questions);
        
        // Initialize answers object
        const initialAnswers: Record<number, string> = {};
        questions.forEach((_: string, index: number) => {
          initialAnswers[index] = "";
        });
        setScreeningAnswers(initialAnswers);
      }
    } catch (error) {
      console.error("Error fetching screening questions:", error);
    }
  };

  const fetchJob = async () => {
    try {
      const token = localStorage.getItem("token");

      const apiUrl = `http://196.188.249.24:3010/api/jobs/${id}`;

      const res = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch jobs");

      const data = await res.json();
      console.log(data);

      setJob(data);
    } catch (error) {
      console.error("Error fetching job:", error);
    }
  };

  const handleSaveJob = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://196.188.249.24:3010/api/save-jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobPostId: job?.id,
          userId: organization?.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save job");
      }

      // Update the job state to reflect the saved status
      setJob(prev => prev ? {...prev, isSaved: true} : null);
    } catch (error) {
      console.error("Error saving job:", error);
    }
  };

  // Apply
  // Scroll to the application form
  const handleApplyClick = () => {
    setShowForm(true);
    setTimeout(() => {
      if (applySectionRef.current) {
        applySectionRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100); // Small delay for smooth transition
  };

  const handleCVSelect = (file: File | null) => {
    setCv(file);
  };

  const handleSubmitApplication = async () => {
    if (!coverLetter.trim() || !cv) {
      setMessage("Please provide a cover letter and upload your CV.");
      return;
    }

    const token = localStorage.getItem("token");
  
    if (!token) {
      setMessage("Authentication error. Please log in again.");
      return;
    }
  
    setLoading(true);
    setMessage("");
  
    const formData = new FormData();
    formData.append("cv", cv);
  
    try {
      const applicationData = {
        userId: organization?.id,
        JobPostId: job?.id,
        coverLetter: coverLetter,
        screeningAnswers: screeningAnswers,
        applicationInformation: {
          cv: cv,
          appliedAt: new Date().toISOString(),
        },
      };
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
  
      await axios.post(
        "http://196.188.249.24:3010/api/applications/create-application",
        applicationData,
        config
      );
  
      setMessage("Application submitted successfully!");
      
      // Redirect to applications page after successful submission
      setTimeout(() => {
        router.push("/jobs/applications");
      }, 1500); // Short delay to show success message
    } catch (error) {
      console.error("Error submitting application:", error);
      setMessage("Error applying for the job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleScreeningAnswerChange = (index: number, answer: string) => {
    setScreeningAnswers(prev => ({
      ...prev,
      [index]: answer
    }));
  };

  // Format date helper function
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Not specified";
    try {
      return format(parseISO(dateString), "MMMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  // Don't render anything until after hydration
  if (!mounted) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="w-full bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 text-gray-800 pt-4 px-6 border-b border-blue-100">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8">
            <div className="md:w-2/3">
              <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-800">
                {job?.title}
              </h1>
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <Building size={16} />
                <span>{job?.companyName || "Company Name"}</span>
              </div>
              <div className="flex flex-wrap gap-3 mb-5">
                <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border border-blue-100 text-gray-700">
                  <MapPin size={14} className="text-blue-500" />
                  <span>{job?.location || job?.city || "Location"}</span>
                </div>
                <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border border-blue-100 text-gray-700">
                  <Briefcase size={14} className="text-blue-500" />
                  <span>{job?.employmentType || "Employment Type"}</span>
                </div>
                <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border border-blue-100 text-gray-700">
                  <Calendar size={14} className="text-blue-500" />
                  <span>Posted: {formatDate(job?.postedDate)}</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/3 flex flex-col items-center w-full md:w-auto">
              <div className="w-24 h-24 flex items-center justify-center rounded-lg bg-white p-2 mb-4 border border-blue-100">
                <Image
                  width={90}
                  height={90}
                  src={job?.companyLogo?.path || "/logo.webp"}
                  alt={`${job?.companyName || "Company"} Logo`}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex gap-3 w-full">
                <Button 
                  className="flex-1 bg-blue-600 text-white hover:bg-blue-700 font-medium"
                  onClick={handleApplyClick}
                >
                  Apply Now
                </Button>
                <Button 
                  variant="outline" 
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                  onClick={handleSaveJob}
                >
                  {job?.isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Job Details Section */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-5 pb-4 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-800">
                  Job Details
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock size={14} />
                  <span>Deadline: {formatDate(job?.deadline)}</span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 text-gray-800">Description</h4>
                <div className="prose max-w-none text-gray-600 text-sm">
                  {/* Render HTML content */}
                  <div
                    dangerouslySetInnerHTML={{ __html: job?.description || "" }}
                  />
                </div>
              </div>

              {job?.responsibilities && job.responsibilities.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3 text-gray-800">Responsibilities</h4>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    {job.responsibilities.map((responsibility, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 text-gray-800">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {job?.skill.map((skill) => (
                    <div
                      key={skill}
                      className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md text-sm font-medium"
                    >
                      <CheckCircle className="text-blue-500" size={14} />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 text-gray-800">Benefits</h4>
                {job?.benefits && job.benefits.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {job.benefits.map((benefit, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 border border-gray-100 p-2.5 rounded-lg text-gray-700 text-sm font-medium"
                      >
                        {benefit}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    No benefits listed for this job.
                  </p>
                )}
              </div>

              {job?.location && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3 text-gray-800">Location</h4>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <MapPin size={16} className="text-blue-500" />
                    <span>{job?.location}</span>
                  </div>
                </div>
              )}

              {job?.salaryRange && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3 text-gray-800">Salary</h4>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <p className="text-gray-600 text-sm">
                      {job.salaryRange.minimum && job.salaryRange.maximum ? (
                        <span className="font-medium">
                          ${job.salaryRange.minimum.toLocaleString()} - ${job.salaryRange.maximum.toLocaleString()}
                        </span>
                      ) : job.salaryRange.minimum ? (
                        <span className="font-medium">From ${job.salaryRange.minimum.toLocaleString()}</span>
                      ) : job.salaryRange.maximum ? (
                        <span className="font-medium">Up to ${job.salaryRange.maximum.toLocaleString()}</span>
                      ) : (
                        <span>Salary not specified</span>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Section */}
        <div className="space-y-6">
          <Card className="border border-gray-100 shadow-sm">
            <CardContent className="p-5">
              {/* Apply Button */}
              {!showForm && (
                <button
                  className="w-full bg-blue-600 text-white font-medium p-3 rounded-lg hover:bg-blue-700 transition mb-5"
                  onClick={handleApplyClick}
                >
                  Apply for this job
                </button>
              )}

              <div className="mb-5">
                <h4 className="text-sm font-semibold text-gray-500 mb-2">Share this job</h4>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full flex items-center gap-2 justify-center text-sm"
                  >
                    <FaFacebook className="text-blue-600 text-lg" />
                    <span>Facebook</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full flex items-center gap-2 justify-center text-sm"
                  >
                    <FaXTwitter className="text-black text-lg" />
                    <span>X (Twitter)</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full flex items-center gap-2 justify-center text-sm"
                  >
                    <FaLinkedin className="text-blue-700 text-lg" />
                    <span>LinkedIn</span>
                  </Button>
                </div>
              </div>

              <div className="mb-5">
                <h4 className="text-sm font-semibold text-gray-500 mb-2">Job URL</h4>
                <div className="relative">
                  <Input 
                    value={jobUrl} 
                    readOnly 
                    className="pr-16 text-sm"
                  />
                  <Button
                    onClick={copyToClipboard}
                    className="absolute right-1 top-1 h-7 bg-blue-600 text-white text-xs font-medium"
                  >
                    {isCopied ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-500 mb-2">
                  More jobs from {job?.companyName || "this company"}
                </h4>

                <div className="space-y-3">
                  <div className="p-2.5 border border-gray-100 rounded-lg hover:border-blue-200 transition cursor-pointer">
                    <h5 className="font-medium text-gray-800 text-sm">Senior UI/UX Designer</h5>
                    <p className="text-xs text-gray-500">Full Time • {job?.location || "Location"}</p>
                  </div>

                  <div className="p-2.5 border border-gray-100 rounded-lg hover:border-blue-200 transition cursor-pointer">
                    <h5 className="font-medium text-gray-800 text-sm">Junior Designer</h5>
                    <p className="text-xs text-gray-500">Full Time • {job?.location || "Location"}</p>
                  </div>

                  <div className="p-2.5 border border-gray-100 rounded-lg hover:border-blue-200 transition cursor-pointer">
                    <h5 className="font-medium text-gray-800 text-sm">Web Developer</h5>
                    <p className="text-xs text-gray-500">Full Time • {job?.location || "Location"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Application Form - Appears on Apply Click */}
      {showForm && (
        <div
          ref={applySectionRef}
          className="container mx-auto mt-6 mb-10"
        >
          <Card className="border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-5 text-gray-800 text-center">
                Complete Your Application
              </h2>

              {/* Cover Letter */}
              <div className="mb-5">
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Cover Letter
                </label>
                <textarea
                  placeholder="Write your cover letter here. Explain why you're a good fit for this position..."
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none min-h-[180px] text-sm"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
              </div>

              {/* CV Upload Section */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  CV / Resume
                </label>
                <CVUploadSection
                  existingCV={userData?.resume?.path || userData?.profile?.cv}
                  onCVSelect={handleCVSelect}
                  selectedCV={cv}
                />
              </div>

              {/* Screening Questions */}
              {screeningQuestions.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">Screening Questions</h3>
                  <div className="space-y-4">
                    {screeningQuestions.map((question, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <label className="block text-gray-700 font-medium mb-2 text-sm">
                          {question}
                        </label>
                        {index === 1 ? (
                          // Number input for years of experience
                          <input
                            type="number"
                            min="0"
                            placeholder="Enter years of experience..."
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            value={screeningAnswers[index] || ""}
                            onChange={(e) => handleScreeningAnswerChange(index, e.target.value)}
                          />
                        ) : index === 2 || index === 3 ? (
                          // Yes/No dropdown for relocation and experience questions
                          <select
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            value={screeningAnswers[index] || ""}
                            onChange={(e) => handleScreeningAnswerChange(index, e.target.value)}
                          >
                            <option value="">Select an option</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        ) : index === 4 ? (
                          // Date input for availability
                          <input
                            type="date"
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            value={screeningAnswers[index] || ""}
                            onChange={(e) => handleScreeningAnswerChange(index, e.target.value)}
                          />
                        ) : (
                          // Text input for other questions
                          <textarea
                            placeholder="Your answer..."
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none min-h-[80px] text-sm"
                            value={screeningAnswers[index] || ""}
                            onChange={(e) => handleScreeningAnswerChange(index, e.target.value)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                className="mt-5 w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
                onClick={handleSubmitApplication}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </button>

              {/* Message */}
              {message && (
                <p className={`text-center mt-4 text-sm font-medium ${message.includes("successfully") ? "text-green-600" : "text-red-500"}`}>
                  {message}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default JobDetail;
