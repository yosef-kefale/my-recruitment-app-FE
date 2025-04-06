"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { 
  Search, 
  Users, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Eye, 
  Loader2
} from "lucide-react";
import { JobPosting } from "../../models/jobPosting";
import { Application } from "../../models/application";

// Sample data for testing
const sampleJobs: JobPosting[] = [
  {
    id: "job-1",
    title: "Senior Software Engineer",
    description: "We are looking for a senior software engineer to join our team.",
    position: "Software Engineer",
    industry: "Technology",
    type: "Full-time",
    city: "San Francisco",
    location: "San Francisco, CA",
    employmentType: "Full-time",
    salaryRange: { minimum: 120000, maximum: 180000 },
    deadline: "2023-12-31T00:00:00.000Z",
    requirementId: "req-1",
    skill: ["JavaScript", "React", "Node.js", "TypeScript"],
    benefits: ["Health Insurance", "401k", "Remote Work"],
    responsibilities: ["Develop new features", "Code review", "Mentor junior developers"],
    status: "Active",
    gender: "Any",
    minimumGPA: 3.0,
    companyName: "TechCorp Inc.",
    postedDate: "2023-01-01T00:00:00.000Z",
    applicationURL: "https://techcorp.com/careers",
    experienceLevel: "Senior",
    fieldOfStudy: "Computer Science",
    educationLevel: "Bachelor's Degree",
    howToApply: "Submit your resume and cover letter",
    applicationCount: 25,
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
    remotePolicy: "Hybrid"
  },
  {
    id: "job-2",
    title: "Product Designer",
    description: "We are looking for a product designer to join our team.",
    position: "Product Designer",
    industry: "Design",
    type: "Full-time",
    city: "New York",
    location: "New York, NY",
    employmentType: "Full-time",
    salaryRange: { minimum: 90000, maximum: 130000 },
    deadline: "2023-12-31T00:00:00.000Z",
    requirementId: "req-2",
    skill: ["Figma", "Adobe XD", "UI/UX Design", "Prototyping"],
    benefits: ["Health Insurance", "401k", "Remote Work"],
    responsibilities: ["Design new features", "User research", "Prototype testing"],
    status: "Active",
    gender: "Any",
    minimumGPA: 3.0,
    companyName: "DesignStudio Inc.",
    postedDate: "2023-01-01T00:00:00.000Z",
    applicationURL: "https://designstudio.com/careers",
    experienceLevel: "Mid-level",
    fieldOfStudy: "Design",
    educationLevel: "Bachelor's Degree",
    howToApply: "Submit your portfolio and resume",
    applicationCount: 15,
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
    remotePolicy: "Remote"
  },
  {
    id: "job-3",
    title: "Marketing Manager",
    description: "We are looking for a marketing manager to join our team.",
    position: "Marketing Manager",
    industry: "Marketing",
    type: "Full-time",
    city: "Chicago",
    location: "Chicago, IL",
    employmentType: "Full-time",
    salaryRange: { minimum: 80000, maximum: 120000 },
    deadline: "2023-12-31T00:00:00.000Z",
    requirementId: "req-3",
    skill: ["Digital Marketing", "SEO", "Content Marketing", "Analytics"],
    benefits: ["Health Insurance", "401k", "Remote Work"],
    responsibilities: ["Develop marketing strategy", "Manage marketing campaigns", "Track performance metrics"],
    status: "Active",
    gender: "Any",
    minimumGPA: 3.0,
    companyName: "MarketingPro Inc.",
    postedDate: "2023-01-01T00:00:00.000Z",
    applicationURL: "https://marketingpro.com/careers",
    experienceLevel: "Mid-level",
    fieldOfStudy: "Marketing",
    educationLevel: "Bachelor's Degree",
    howToApply: "Submit your resume and cover letter",
    applicationCount: 10,
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
    remotePolicy: "On-site"
  }
];

export default function AllCandidates() {
  const router = useRouter();
  const { toast } = useToast();
  
  // State for jobs and candidates
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [selectedJob, setSelectedJob] = useState<string>("");
  const [candidates, setCandidates] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  
  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);
  
  // Fetch candidates when a job is selected
  useEffect(() => {
    console.log(`Job selection changed to: ${selectedJob}`);
    if (selectedJob) {
      console.log(`Fetching candidates for selected job: ${selectedJob}`);
      fetchCandidates(selectedJob);
    } else {
      console.log("No job selected, clearing candidates");
      setCandidates([]);
      setLoading(false);
    }
  }, [selectedJob]);
  
  // Fetch jobs from API
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Error",
          description: "No authentication token found. Please log in again.",
          variant: "destructive",
        });
        // Use sample data when token is missing
        setJobs(sampleJobs);
        return;
      }

      console.log("Fetching jobs with token:", token.substring(0, 10) + "...");

      const response = await fetch("http://196.188.249.24:3010/api/jobs", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch jobs: ${response.status} ${response.statusText}`);
      }

      // Check if the response is empty
      const responseText = await response.text();
      if (!responseText || responseText.trim() === '') {
        console.log("Empty response received from API");
        // Use sample data when API returns empty response
        setJobs(sampleJobs);
        return;
      }

      // Try to parse the response as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
        // Use sample data when API returns invalid JSON
        setJobs(sampleJobs);
        return;
      }
      
      console.log("Jobs API response:", data);
      
      // Check if data has an items property (like in view-all page)
      const jobsData = data.items || data;
      console.log("Processed jobs data:", jobsData);
      
      // Ensure jobsData is an array
      if (Array.isArray(jobsData) && jobsData.length > 0) {
        setJobs(jobsData);
      } else {
        // Use sample data when API returns empty array
        setJobs(sampleJobs);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast({
        title: "Error",
        description: "Failed to fetch jobs. Using sample data instead.",
        variant: "destructive",
      });
      // Use sample data on error
      setJobs(sampleJobs);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch candidates for a specific job
  const fetchCandidates = async (jobId: string) => {
    console.log(`fetchCandidates called with jobId: ${jobId}, type: ${typeof jobId}`);
    
    // Create sample candidates for the actual job ID
    const sampleCandidatesForJob: Application[] = [
      {
        id: `${jobId}-app1`,
        userId: "user-1",
        jobId: jobId,
        status: "pending",
        coverLetter: "I am excited to apply for this position. I have 5 years of experience in this field and I am confident that I would be a great fit for this role.",
        screeningScore: 8,
        applicationInformation: {
          appliedAt: "2024-01-15T00:00:00.000Z",
          lastUpdated: "2024-01-15T00:00:00.000Z"
        }
      },
      {
        id: `${jobId}-app2`,
        userId: "user-2",
        jobId: jobId,
        status: "shortlisted",
        coverLetter: "I am writing to express my interest in this position. With my background and experience, I believe I can contribute to your team's success.",
        screeningScore: 9,
        applicationInformation: {
          appliedAt: "2024-01-10T00:00:00.000Z",
          lastUpdated: "2024-01-12T00:00:00.000Z"
        }
      },
      {
        id: `${jobId}-app3`,
        userId: "user-3",
        jobId: jobId,
        status: "rejected",
        coverLetter: "I am interested in this position. I have relevant experience and I am looking forward to the opportunity to work with your team.",
        screeningScore: 5,
        applicationInformation: {
          appliedAt: "2024-01-05T00:00:00.000Z",
          lastUpdated: "2024-01-08T00:00:00.000Z"
        }
      },
      {
        id: `${jobId}-app4`,
        userId: "user-4",
        jobId: jobId,
        status: "reviewed",
        coverLetter: "I am excited to apply for this position. I have a strong background in the required skills and I am confident that I would be a great fit for this role.",
        screeningScore: 7,
        applicationInformation: {
          appliedAt: "2024-01-20T00:00:00.000Z",
          lastUpdated: "2024-01-22T00:00:00.000Z"
        }
      },
      {
        id: `${jobId}-app5`,
        userId: "user-5",
        jobId: jobId,
        status: "hired",
        coverLetter: "I am writing to express my interest in this position. With my experience and skills, I believe I can contribute to your team's success.",
        screeningScore: 9,
        applicationInformation: {
          appliedAt: "2024-01-18T00:00:00.000Z",
          lastUpdated: "2024-01-25T00:00:00.000Z"
        }
      }
    ];
    
    try {
      setLoading(true);
      console.log(`Starting to fetch candidates for job ID: ${jobId}`);
      
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found, using sample data");
        toast({
          title: "Error",
          description: "No authentication token found. Please log in again.",
          variant: "destructive",
        });
        // Use sample data when token is missing
        console.log(`Using ${sampleCandidatesForJob.length} sample candidates for job ID: ${jobId}`);
        setCandidates(sampleCandidatesForJob);
        return;
      }

      console.log(`Fetching candidates for job ID: ${jobId}`);

      const response = await fetch(`http://196.188.249.24:3010/api/applications/${jobId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.log(`API returned error status: ${response.status} ${response.statusText}`);
        throw new Error(`Failed to fetch candidates: ${response.status} ${response.statusText}`);
      }

      // Check if the response is empty
      const responseText = await response.text();
      if (!responseText || responseText.trim() === '') {
        console.log("Empty response received from API");
        // Use sample data when API returns empty response
        console.log(`Using ${sampleCandidatesForJob.length} sample candidates for job ID: ${jobId}`);
        setCandidates(sampleCandidatesForJob);
        return;
      }

      // Try to parse the response as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
        // Use sample data when API returns invalid JSON
        console.log(`Using ${sampleCandidatesForJob.length} sample candidates for job ID: ${jobId}`);
        setCandidates(sampleCandidatesForJob);
        return;
      }
      
      console.log("Candidates API response:", data);
      
      // Check if data is an array and has items
      if (Array.isArray(data) && data.length > 0) {
        console.log(`Found ${data.length} candidates from API for job ID: ${jobId}`);
        setCandidates(data);
      } else {
        // Use sample data when API returns empty array
        console.log(`Using ${sampleCandidatesForJob.length} sample candidates for job ID: ${jobId}`);
        setCandidates(sampleCandidatesForJob);
      }
    } catch (error) {
      console.error("Error fetching candidates:", error);
      toast({
        title: "Error",
        description: "Failed to fetch candidates. Using sample data instead.",
        variant: "destructive",
      });
      // Use sample data on error
      console.log(`Using ${sampleCandidatesForJob.length} sample candidates for job ID: ${jobId}`);
      setCandidates(sampleCandidatesForJob);
    } finally {
      setLoading(false);
    }
  };
  
  // Filter and sort candidates
  const filteredCandidates = candidates
    .filter(candidate => {
      // Filter by status
      if (statusFilter !== "all" && candidate.status !== statusFilter) {
        return false;
      }
      
      // Filter by search query (search in cover letter)
      if (searchQuery && !candidate.coverLetter.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by date
      if (sortBy === "newest") {
        return new Date(b.applicationInformation.appliedAt).getTime() - 
               new Date(a.applicationInformation.appliedAt).getTime();
      } else if (sortBy === "oldest") {
        return new Date(a.applicationInformation.appliedAt).getTime() - 
               new Date(b.applicationInformation.appliedAt).getTime();
      } else if (sortBy === "score") {
        // Use optional chaining to handle potential undefined values
        return (b.screeningScore || 0) - (a.screeningScore || 0);
      }
      return 0;
    });

  console.log(`Total candidates: ${candidates.length}, Filtered candidates: ${filteredCandidates.length}`);
  
  // Get status color for badge
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'reviewed': return 'bg-blue-500';
      case 'shortlisted': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'hired': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };
  
  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 mr-1" />;
      case 'reviewed': return <Eye className="h-4 w-4 mr-1" />;
      case 'shortlisted': return <CheckCircle className="h-4 w-4 mr-1" />;
      case 'rejected': return <XCircle className="h-4 w-4 mr-1" />;
      case 'hired': return <AlertCircle className="h-4 w-4 mr-1" />;
      default: return null;
    }
  };
  
  // Handle view candidate details
  const handleViewCandidate = (candidateId: string) => {
    router.push(`/candidates/details/${candidateId}`);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-800">All Candidates</CardTitle>
          <CardDescription>
            View and manage all candidates who have applied to your job postings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Job Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Job</label>
            <Select 
              value={selectedJob} 
              onValueChange={(value) => {
                console.log(`Job selected in dropdown: ${value}, type: ${typeof value}`);
                setSelectedJob(value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a job to view candidates" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(jobs) && jobs.length > 0 ? (
                  jobs.map((job) => (
                    <SelectItem key={job.id} value={job.id || "no-id"}>
                      {job.title} - {job.position}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-jobs" disabled>No jobs available</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          {selectedJob ? (
            <>
              {/* Filters and Search */}
              <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Applications</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewed">Reviewed</SelectItem>
                      <SelectItem value="shortlisted">Shortlisted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="hired">Hired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input 
                      placeholder="Search in cover letters..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sort candidates" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="score">Screening Score</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Candidates Table */}
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  <span className="ml-2 text-gray-500">Loading candidates...</span>
                </div>
              ) : filteredCandidates.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <div className="flex flex-col items-center justify-center">
                    <Users className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500 text-lg">No candidates found</p>
                    <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or search query</p>
                  </div>
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead>Candidate</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Screening Score</TableHead>
                        <TableHead>Applied Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCandidates.map((candidate) => (
                        <TableRow key={candidate.id}>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                                {candidate.userId?.charAt(0).toUpperCase() || "C"}
                              </div>
                              <div className="ml-3">
                                <p className="font-medium">Candidate {candidate.userId?.slice(0, 8)}</p>
                                <p className="text-sm text-gray-500">ID: {candidate.id?.slice(0, 8)}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getStatusColor(candidate.status)} text-white flex items-center`}>
                              {getStatusIcon(candidate.status)}
                              {candidate.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {candidate.screeningScore ? (
                              <span className="font-medium">{candidate.screeningScore}/10</span>
                            ) : (
                              <span className="text-gray-400">Not scored</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {new Date(candidate.applicationInformation.appliedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewCandidate(candidate.id || "")}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <div className="flex flex-col items-center justify-center">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">Select a job to view candidates</p>
                <p className="text-gray-400 text-sm mt-1">Choose a job from the dropdown above</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
} 