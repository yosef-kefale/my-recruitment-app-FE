/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { JobPosting } from "../../../models/jobPosting";
import { notFound, useParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Organization } from "../../../models/organization";
import { FaFacebook, FaXTwitter, FaLinkedin } from "react-icons/fa6";
import axios from "axios";

const JobDetail = () => {
  const params = useParams();
  const id = params.id as string;

  if (!id) return notFound();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [job, setJob] = useState<JobPosting | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [jobUrl, setJobUrl] = useState("");

  //Application variables
  const [showForm, setShowForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [cv, setCv] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [screeningQuestions, setScreeningQuestions] = useState<string[]>([]);
  const [screeningAnswers, setScreeningAnswers] = useState<Record<number, string>>({});
  const applySectionRef = useRef<HTMLDivElement | null>(null);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    setJobUrl(window.location.href);
    const org = localStorage.getItem("organization");
    if (org) {
      setOrganization(JSON.parse(org) as Organization);
      console.log(JSON.parse(org)); // Check if data is retrieved
    }

    fetchJob();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jobUrl);
    alert("URL copied to clipboard!");
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
      
      // Fetch screening questions if they exist
      if (data.screeningQuestions) {
        setScreeningQuestions(data.screeningQuestions);
        // Initialize answers object
        const initialAnswers: Record<number, string> = {};
        data.screeningQuestions.forEach((question: string, index: number) => {
          initialAnswers[index] = "";
        });
        setScreeningAnswers(initialAnswers);
      }
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

      alert("Job saved successfully!");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Error saving job. Please try again.");
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setCv(event.target.files[0]);
    }
  };

  const handleSubmitApplication = async () => {
    if (!coverLetter.trim() || !cv) {
      setMessage("Please provide a cover letter and upload your CV.");
      return;
    }

    // Check if all screening questions are answered
    const unansweredQuestions = screeningQuestions.filter((_, index) => !screeningAnswers[index]?.trim());
    if (unansweredQuestions.length > 0) {
      setMessage("Please answer all screening questions.");
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
    } catch (error) {
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

  return (
    <div className="w-full bg-gray-100">
      {/* Hero Section */}
      <div className="bg-sky-400 text-white py-10 px-6 text-center">
        <h1 className="text-6xl font-bold">
          {job?.title}
          <br />
          <span className="text-5xl text-sky-700 font-normal"> at </span>
          Circlebox Creative
        </h1>
        <p className="mt-4 text-lg py-4 max-w-xl mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fermentum
          diam id ligula semper justo rhoncus.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Button className="w-44 h-14 bg-sky-600 text-stone-200 font-bold">
            VIEW COMPANY
          </Button>
          <Button className="w-44 h-14 bg-sky-600 text-stone-200 font-bold">
            APPLY FOR THIS JOB
          </Button>
        </div>
      </div>

      <div className="container mx-auto py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Job Details Section */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-400">
                  About this role
                </h3>

                {/* Save Job Button */}
                <button
                  className="flex items-center px-4 py-2 rounded-lg text-gray-600 hover:bg-sky-100 hover:border-sky-500 hover:text-sky-600 transition"
                  onClick={handleSaveJob}
                >
                  {/* Save Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-10 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 21l-5-3-5 3V5a2 2 0 012-2h6a2 2 0 012 2z"
                    />
                  </svg>
                  {/* Save Label */}
                  <span className="font-medium">Save</span>
                </button>
              </div>

              <div className="flex items-center gap-4">
                {/* Company Logo */}
                <div className="w-20 h-20 flex items-center justify-center rounded-2xl bg-gray-200">
                  <Image
                    width={80}
                    height={80}
                    src="/logo.webp"
                    alt="Company Logo"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Job Details */}
                <div>
                  <span className="text-lg font-bold">
                    {job?.title}
                    <span className="text-gray-400 font-normal">
                      {" "}
                      ({job?.employmentType})
                    </span>
                  </span>
                  <p className="text-gray-500">
                    Circlebox Creative - Royston, Hertfordshire, UK
                  </p>
                  <p className="font-semibold text-md">
                    {job?.salaryRange?.minimum && job?.salaryRange?.maximum && (
                      <div>
                        ${job?.salaryRange?.minimum}
                        {" - " + "$" + job?.salaryRange?.maximum}
                        {job?.benefits ? " + Benefits" : ""}
                      </div>
                    )}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="mt-6 font-bold">Description</h4>
                <div className="pl-4">
                  {/* Render HTML content */}
                  <div
                    dangerouslySetInnerHTML={{ __html: job?.description || "" }}
                  />
                </div>
              </div>

              {job?.responsibilities && job.responsibilities.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-bold text-lg">Responsibilities</h4>
                  <ul className="list-disc list-inside mt-4 text-gray-700">
                    {job.responsibilities.map((responsibility, index) => (
                      <li key={index} className="mt-2">
                        {responsibility}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h4 className="mt-6 font-bold">Skills</h4>
                <div className="flex flex-col pl-4 gap-2 mt-2">
                  {job?.skill.map((skill) => (
                    <div
                      key={skill}
                      className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md shadow-sm"
                    >
                      <CheckCircle className="text-green-600" size={20} />
                      <span className="text-gray-800 font-medium">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mt-6 font-bold">Benefits</h4>
                {job?.benefits && job.benefits.length > 0 ? (
                  <>
                    <p className="mt-4 pl-4 text-gray-700">
                      This job offers the following benefits:
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pl-4 mt-4">
                      {job.benefits.map((benefit, index) => (
                        <Card
                          key={index}
                          className="min-w-[120px] p-4 text-sm text-sky-500 border border-sky-500 flex items-center justify-center rounded-lg shadow-md"
                        >
                          {benefit.toUpperCase()}
                        </Card>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="mt-4 pl-4 text-gray-500">
                    No benefits listed for this job.
                  </p>
                )}
              </div>
              {job?.location && (
                <div className="mt-10">
                  <h4 className="font-bold">Location</h4>
                  <p className="text-gray-700 pl-4">{job?.location}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Section */}
        <div>
          <Card>
            <CardContent className="p-6">
              {/* Apply Button */}
              {!showForm && (
                <button
                  className="w-full bg-emerald-500 text-white font-semibold p-3 rounded-lg hover:bg-emerald-600 transition"
                  onClick={handleApplyClick}
                >
                  Apply for this job
                </button>
              )}

              <div className="mt-4 space-y-2">
                <Button
                  variant="outline"
                  className="w-full flex items-center gap-4"
                >
                  <FaFacebook className="text-blue-600 text-2xl" />
                  Share on Facebook
                </Button>
                <Button
                  variant="outline"
                  className="w-full flex items-center gap-4"
                >
                  <FaXTwitter className="text-black text-2xl" />
                  Share on X (Twitter)
                </Button>
                <Button
                  variant="outline"
                  className="w-full flex items-center gap-4"
                >
                  <FaLinkedin className="text-blue-700 text-2xl" />
                  Share on LinkedIn
                </Button>
              </div>

              <div className="mt-12">
                <p className="text-sm font-semibold">Job URL</p>
                <div className="relative mt-1">
                  <Input value={jobUrl} readOnly />
                  <Button
                    onClick={copyToClipboard}
                    className="absolute font-semibold py-1 right-0 top-0 bg-sky-600 text-white"
                  >
                    COPY
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="mt-10 font-bold text-gray-400">
                  More from
                  <span className="text-sky-500"> Circlebox Creative</span>
                </h4>

                <div>
                  <h4 className="mt-6 font-bold">
                    <span>
                      <strong>Senior UI/UX Designer</strong>
                      <span className="text-gray-400 font-normal">
                        (Full Time)
                      </span>
                    </span>
                  </h4>
                  <p className="text-sm text-gray-400">
                    Circlebox Creative, Bole, Addis Abeba, Ethiopia
                  </p>
                </div>

                <div>
                  <h4 className="mt-6 font-bold">
                    <span>
                      <strong>Junior Designer</strong>
                      <span className="text-gray-400 font-normal">
                        (Full Time)
                      </span>
                    </span>
                  </h4>
                  <p className="text-sm text-gray-400">
                    Circlebox Creative, Bole, Addis Abeba, Ethiopia
                  </p>
                </div>

                <div>
                  <h4 className="mt-6 font-bold">
                    <span>
                      <strong>Web Developer</strong>
                      <span className="text-gray-400 font-normal">
                        (Full Time)
                      </span>
                    </span>
                  </h4>
                  <p className="text-sm text-gray-400">
                    Circlebox Creative, Bole, Addis Abeba, Ethiopia
                  </p>
                </div>
              </div>

              <div className="mt-8">
              {!showForm && (
                <button
                  className="w-full bg-emerald-500 text-white font-semibold p-3 rounded-lg hover:bg-emerald-600 transition"
                  onClick={handleApplyClick}
                >
                  Apply for this job
                </button>
              )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Application Form - Appears on Apply Click */}
      {showForm && (
        <div
          ref={applySectionRef}
          className="mt-6 p-6 border rounded-2xl shadow-lg bg-white mx-4"
        >
          <h2 className="text-xl font-semibold mb-6 text-gray-800 text-center">
            Complete Your Application
          </h2>

          {/* Cover Letter */}
          <label className="block text-gray-700 font-medium mb-2">
            Cover Letter
          </label>
          <textarea
            placeholder="Write your cover letter..."
            className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none min-h-[120px]"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />

          {/* Screening Questions */}
          {screeningQuestions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Screening Questions</h3>
              {screeningQuestions.map((question, index) => (
                <div key={index} className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    {question}
                  </label>
                  <textarea
                    placeholder="Your answer..."
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none min-h-[100px]"
                    value={screeningAnswers[index] || ""}
                    onChange={(e) => handleScreeningAnswerChange(index, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* File Upload */}
          <label className="block text-gray-700 font-medium mb-2">
            Upload CV
          </label>
          <div className="relative w-full border border-gray-300 rounded-lg flex items-center p-3 bg-gray-100 hover:bg-gray-200 transition">
            <input
              type="file"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            />
            <span className="text-gray-600">
              {cv ? cv.name : "Choose a file (PDF, DOC, DOCX)"}
            </span>
          </div>

          {/* Submit Button */}
          <button
            className="mt-6 w-full bg-emerald-500 text-white font-semibold py-3 rounded-xl hover:bg-emerald-600 transition flex items-center justify-center"
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
            <p className="text-center mt-4 text-sm font-medium text-red-500">
              {message}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default JobDetail;
