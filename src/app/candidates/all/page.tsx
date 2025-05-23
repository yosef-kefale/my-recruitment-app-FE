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
        setJobs([]);
        return;
      }

      console.log("Fetching jobs with token:", token.substring(0, 10) + "...");

      const response = await fetch("https://196.188.249.24:3010/api/jobs", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch jobs: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Jobs API response:", data);
      
      // Check if data has an items property (like in view-all page)
      const jobsData = data.items || data;
      console.log("Processed jobs data:", jobsData);
      
      // Ensure jobsData is an array
      if (Array.isArray(jobsData)) {
        setJobs(jobsData);
      } else {
        setJobs([]);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast({
        title: "Error",
        description: "Failed to fetch jobs. Please try again.",
        variant: "destructive",
      });
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch candidates for a specific job
  const fetchCandidates = async (jobId: string) => {
    console.log(`fetchCandidates called with jobId: ${jobId}, type: ${typeof jobId}`);
    
    try {
      setLoading(true);
      console.log(`Starting to fetch candidates for job ID: ${jobId}`);
      
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found");
        toast({
          title: "Error",
          description: "No authentication token found. Please log in again.",
          variant: "destructive",
        });
        setCandidates([]);
        return;
      }

      console.log(`Fetching candidates for job ID: ${jobId}`);

      const response = await fetch(
        `https://196.188.249.24:3010/api/applications?q=i=JobPost%26%26w=JobPostId:=:${jobId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        console.log(`API returned error status: ${response.status} ${response.statusText}`);
        throw new Error(`Failed to fetch candidates: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Candidates API response:", data);
      
      // Check if data has an items property
      const candidatesData = data.items || [];
      console.log(`Found ${candidatesData.length} candidates from API for job ID: ${jobId}`);
      setCandidates(candidatesData);
      
    } catch (error) {
      console.error("Error fetching candidates:", error);
      toast({
        title: "Error",
        description: "Failed to fetch candidates. Please try again.",
        variant: "destructive",
      });
      setCandidates([]);
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