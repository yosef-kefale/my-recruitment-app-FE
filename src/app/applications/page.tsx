"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Filter, ArrowUp, ArrowDown, FileText, Calendar, Building2, MapPin, Clock, CheckCircle2, XCircle, User, Briefcase, GraduationCap } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { API_URL } from "@/lib/api";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter } from "next/navigation";

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

interface JobApplicationResponse {
  total: number;
  items: JobApplication[];
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

const ApplicationsPage = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortBy, setSortBy] = useState<"date" | "status">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const itemsPerPage = 10;
  const { toast } = useToast();
  const debouncedSearch = useDebounce(searchQuery, 500);
  const router = useRouter();

  useEffect(() => {
    fetchApplications();
  }, [currentPage, debouncedSearch, statusFilter, sortBy, sortDirection]);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const org = localStorage.getItem("organization");
      if (!org) throw new Error("No organization found");
      
      const orgData = JSON.parse(org);
      if (!orgData?.id) throw new Error("No organization ID found");

      const queryParams = new URLSearchParams({
        q: `t=${itemsPerPage}&&sk=${(currentPage - 1) * itemsPerPage}&&w=userId:=:${orgData.id}&&i=JobPost`
      });

      if (debouncedSearch) {
        queryParams.append("search", debouncedSearch);
      }

      if (statusFilter !== "all") {
        queryParams.append("status", statusFilter);
      }

      const res = await fetch(`${API_URL}/applications?${queryParams.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch applications");
      }

      const data: JobApplicationResponse = await res.json();
      const mappedApplications = data.items.map(mapBackendToFrontend);
      setApplications(mappedApplications);
      setTotalItems(data.total || 0);
      setTotalPages(Math.ceil((data.total || 0) / itemsPerPage));
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast({
        title: "Error",
        description: "Failed to fetch applications",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const sortedApplications = [...applications].sort((a, b) => {
    let result = 0;
    switch (sortBy) {
      case "date":
        const dateA = new Date(a.jobPost?.[0]?.postedDate || 0).getTime();
        const dateB = new Date(b.jobPost?.[0]?.postedDate || 0).getTime();
        result = dateB - dateA;
        break;
      case "status":
        result = (a.isViewed ? 1 : 0) - (b.isViewed ? 1 : 0);
        break;
      default:
        return 0;
    }
    return sortDirection === "asc" ? -result : result;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto py-6">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search applications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-10 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[180px] h-10">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Applications</SelectItem>
                  <SelectItem value="viewed">Viewed</SelectItem>
                  <SelectItem value="not_viewed">Not Viewed</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort Controls */}
              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={(value: "date" | "status") => setSortBy(value)}>
                  <SelectTrigger className="w-[140px] h-10">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSortDirection(prev => prev === "asc" ? "desc" : "asc")}
                  className="h-10 w-10"
                  title={sortDirection === "asc" ? "Sort ascending" : "Sort descending"}
                >
                  {sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Applications List */}
          <div className="grid gap-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
              </div>
            ) : sortedApplications.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center justify-center">
                  <FileText className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-700">No applications found</h3>
                  <p className="text-gray-500 mt-2">
                    {searchQuery ? "Try adjusting your search terms" : "You haven't applied to any jobs yet"}
                  </p>
                </div>
              </Card>
            ) : (
              <>
                {sortedApplications.map((application) => (
                  <Card 
                    key={application.id} 
                    className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => router.push(`/applications/${application.id}`)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Company Logo */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                          {application.jobPost?.companyLogo?.path ? (
                            <img
                              src={application.jobPost?.companyLogo?.path}
                              alt={application.jobPost?.companyName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img
                              src="/company-logo.png"
                              alt={application.jobPost?.companyName}
                              className="w-full h-full object-contain p-1"
                            />
                          )}
                        </div>
                      </div>

                      {/* Application Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 
                              className="text-base font-semibold text-gray-900 truncate hover:text-blue-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/applications/${application.id}`);
                              }}
                            >
                              {application.jobPost?.title}
                            </h3>
                            <p className="text-sm text-gray-600 truncate">
                              {application.jobPost?.companyName}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                              application.isViewed
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {application.isViewed ? "Viewed" : "Not Viewed"}
                            </span>
                            <span className="text-xs text-gray-500">
                              {format(new Date(application.jobPost?.postedDate || new Date()), "MMM d, yyyy")}
                            </span>
                          </div>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{application.jobPost?.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-3 w-3" />
                            <span>{application.jobPost?.employmentType}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <GraduationCap className="h-3 w-3" />
                            <span>{application.jobPost?.educationLevel}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{application.jobPost?.experienceLevel}</span>
                          </div>
                        </div>

                        {application.jobPost?.skill && application.jobPost?.skill.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {application.jobPost?.skill.slice(0, 3).map((skill: string, index: number) => (
                              <span key={index} className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                                {skill}
                              </span>
                            ))}
                            {application.jobPost?.skill.length > 3 && (
                              <span className="px-1.5 py-0.5 bg-gray-50 text-gray-500 rounded text-xs">
                                +{application.jobPost?.skill.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-6">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsPage;