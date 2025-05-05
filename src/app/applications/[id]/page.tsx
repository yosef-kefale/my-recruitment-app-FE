"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Calendar, Building2, MapPin, Clock, User, Briefcase, GraduationCap, Link, Award, MessageSquare, File, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { API_URL } from "@/lib/api";

interface FileObject {
  filename: string;
  path: string;
  originalname: string;
  mimetype: string;
  size: number;
  bucketName: string;
}

interface ReferralInformation {
  fullName: string;
  employeeId: string;
  id: string;
}

interface User {
  id: string;
  phone: string;
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  status: string;
  birthDate: string;
  linkedinUrl: string;
  portfolioUrl: string;
  yearOfExperience: number;
  telegramUserId: string;
  industry: string[];
  preferredJobLocation: string[];
  highestLevelOfEducation: string;
  salaryExpectations: number;
  aiGeneratedJobFitScore: number;
  profile: Record<string, any>;
  resume: Record<string, any>;
  technicalSkills: string[];
  softSkills: string[];
  socialMediaLinks: Record<string, any>;
  profileHeadLine: string;
  coverLetter: string;
  professionalSummery: string;
  educations: Record<string, any>;
  experiences: Record<string, any>;
}

interface JobPost {
  id: string;
  title: string;
  description: string;
  position: string;
  industry: string;
  type: string;
  city: string;
  location: string;
  employmentType: string;
  salaryRange: Record<string, any>;
  organizationId: string;
  deadline: string;
  requirementId: string;
  skill: string[];
  benefits: string[];
  responsibilities: string[];
  status: string;
  gender: string;
  minimumGPA: number;
  companyName: string;
  companyLogo: FileObject;
  postedDate: string;
  applicationURL: string;
  experienceLevel: string;
  fieldOfStudy: string;
  educationLevel: string;
  howToApply: string;
  onHoldDate: string;
  applicationCount: number;
  jobPostRequirement: string[];
  applications: string[];
  savedUsers: string[];
  preScreeningQuestions: string[];
  isSaved: boolean;
  isApplied: boolean;
  positionNumbers: number;
  paymentType: string;
  createdAt: string;
  updatedAt: string;
}

interface JobApplication {
  id: string;
  userId: string;
  JobPostId: string;
  cv: FileObject;
  coverLetter: string;
  applicationInformation: Record<string, any>;
  userInfo: Record<string, any>;
  user: User;
  remark: string;
  notification: string;
  questionaryScore: number;
  isViewed: boolean;
  referralInformation: ReferralInformation;
  referenceReason: string;
  jobPost: JobPost[];
}

const mapBackendToFrontend = (backendData: any): JobApplication => {
  return {
    ...backendData,
    jobPost: backendData.JobPost,
    jobPostId: backendData.JobPostId,
    cv: backendData.cv,
    coverLetter: backendData.coverLetter,
    applicationInformation: backendData.applicationInformation,
    userInfo: backendData.userInfo,
    user: backendData.user,
    remark: backendData.remark,
    notification: backendData.notification,
    questionaryScore: backendData.questionaryScore,
    isViewed: backendData.isViewed,
    referralInformation: backendData.referralInformation,
    referenceReason: backendData.referenceReason
  };
};

const ApplicationDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchApplication();
    }
  }, [id, mounted]);

  const fetchApplication = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Error",
          description: "Authentication required",
          variant: "destructive",
        });
        router.push("/login");
        return;
      }

      const res = await fetch(`${API_URL}/applications/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch application");
      }

      const data = await res.json();
      setApplication(mapBackendToFrontend(data));
    } catch (error) {
      console.error("Error fetching application:", error);
      toast({
        title: "Error",
        description: "Failed to fetch application details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Application not found</h2>
          <p className="text-gray-500 mt-2">The application you're looking for doesn't exist or you don't have access to it.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push("/applications")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Applications
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto py-6">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              className="flex items-center gap-2"
              onClick={() => router.push("/applications")}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Applications
            </Button>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              application.isViewed
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}>
              {application.isViewed ? "Viewed" : "Not Viewed"}
            </span>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Job Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                      {application.jobPost?.[0]?.companyLogo?.path ? (
                        <img
                          src={application.jobPost?.[0]?.companyLogo?.path}
                          alt={application.jobPost?.[0]?.companyName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src="/company-logo.png"
                          alt={application.jobPost?.[0]?.companyName}
                          className="w-full h-full object-contain p-2"
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {application.jobPost?.[0]?.title}
                    </h1>
                    <p className="text-lg text-gray-600">
                      {application.jobPost?.[0]?.companyName}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{application.jobPost?.[0]?.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        <span>{application.jobPost?.[0]?.employmentType}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GraduationCap className="h-4 w-4" />
                        <span>{application.jobPost?.[0]?.educationLevel}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{application.jobPost?.[0]?.experienceLevel}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-500">Posted Date</h3>
                    <p className="text-sm text-gray-900">
                      {format(new Date(application.jobPost?.[0]?.postedDate || new Date()), "MMM d, yyyy")}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-500">Deadline</h3>
                    <p className="text-sm text-gray-900">
                      {format(new Date(application.jobPost?.[0]?.deadline || new Date()), "MMM d, yyyy")}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-500">Industry</h3>
                    <p className="text-sm text-gray-900">{application.jobPost?.[0]?.industry}</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-500">Position Type</h3>
                    <p className="text-sm text-gray-900">{application.jobPost?.[0]?.type}</p>
                  </div>
                </div>

                {application.jobPost?.[0]?.skill && application.jobPost?.[0]?.skill.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {application.jobPost?.[0]?.skill.map((skill: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {application.jobPost?.[0]?.description && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Job Description</h3>
                    <p className="text-sm text-gray-900 whitespace-pre-line">
                      {application.jobPost?.[0]?.description}
                    </p>
                  </div>
                )}
              </Card>

              {/* Application Details */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Application Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Application Date</h3>
                      <p className="text-sm text-gray-900">
                        {format(new Date(application.jobPost?.[0]?.postedDate || new Date()), "MMM d, yyyy")}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Questionnaire Score</h3>
                      <p className="text-sm text-gray-900">{application.questionaryScore || "Not scored"}</p>
                    </div>
                    {application.referralInformation && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Referred By</h3>
                        <p className="text-sm text-gray-900">{application.referralInformation.fullName}</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Cover Letter</h3>
                      <p className="text-sm text-gray-900 mt-1">
                        {application.coverLetter || "No cover letter provided"}
                      </p>
                    </div>
                    {application.cv && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">CV</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-1"
                          onClick={() => window.open(application.cv.path, '_blank')}
                        >
                          <File className="h-4 w-4 mr-2" />
                          View CV
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* Applicant Details */}
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Applicant Information</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                    <p className="text-sm text-gray-900">
                      {application.user ? `${application.user.firstName || ''} ${application.user.lastName || ''}`.trim() || 'Not provided' : 'Not available'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="text-sm text-gray-900">{application.user?.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                    <p className="text-sm text-gray-900">{application.user?.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Experience</h3>
                    <p className="text-sm text-gray-900">
                      {application.user?.yearOfExperience ? `${application.user.yearOfExperience} years` : 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Education</h3>
                    <p className="text-sm text-gray-900">
                      {application.user?.highestLevelOfEducation || 'Not provided'}
                    </p>
                  </div>
                  {application.user?.linkedinUrl && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">LinkedIn</h3>
                      <a
                        href={application.user.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Link className="h-4 w-4" />
                        View Profile
                      </a>
                    </div>
                  )}
                  {application.user?.portfolioUrl && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Portfolio</h3>
                      <a
                        href={application.user.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Link className="h-4 w-4" />
                        View Portfolio
                      </a>
                    </div>
                  )}
                </div>

                {application.user?.technicalSkills?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Technical Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {application.user.technicalSkills.map((skill: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {application.user?.softSkills?.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Soft Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {application.user.softSkills.map((skill: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {application.user?.industry?.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Industry</h3>
                    <div className="flex flex-wrap gap-2">
                      {application.user.industry.map((industry: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                          {industry}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {application.user?.preferredJobLocation?.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Preferred Job Locations</h3>
                    <div className="flex flex-wrap gap-2">
                      {application.user.preferredJobLocation.map((location: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs">
                          {location}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {application.user?.profileHeadLine && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Profile Headline</h3>
                    <p className="text-sm text-gray-900">{application.user.profileHeadLine}</p>
                  </div>
                )}

                {application.user?.professionalSummery && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Professional Summary</h3>
                    <p className="text-sm text-gray-900 whitespace-pre-line">{application.user.professionalSummery}</p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailPage; 