"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import JobCard from "../../../components/job/job-card";
import FilterSidebar from "../../../components/job/filter-sidebar";
import JobDetail from "../../../components/job/job-detail";
import { Grid, List, Search, RefreshCw, Loader2, Bookmark } from "lucide-react";
import { JobPosting } from "../../models/jobPosting";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ViewJobs = () => {
  const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedViewJob, setSelectedViewJob] = useState<JobPosting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isListView, setIsListView] = useState(true);
  const [isEmployeeView, setIsEmployeeView] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchJobs();
  }, []); // Fetch jobs when the component mounts

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      if (!token) throw new Error("No authentication token found");

      const role = localStorage.getItem("role");
      const isEmployee = role === "employee" ? true : false;
      setIsEmployeeView(isEmployee);

      // Determine the correct API endpoint
      const apiUrl =
        filterValues.jobType === "For me"
          ? "http://196.188.249.24:3010/api/jobs/get-all-job-postings-by-skills"
          : "http://196.188.249.24:3010/api/jobs/get-all-job-postings";

      const res = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Attach token to the request
        },
      });

      if (!res.ok) throw new Error("Failed to fetch jobs");

      const data = await res.json();

      // Sort jobs by createdAt in descending order (newest first)
      const sortedJobs = data.items.sort(
        (a: { createdAt: string }, b: { createdAt: string }) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      console.log(sortedJobs);
      // If user is an employee, fetch saved jobs to update the isSaved property
      if (isEmployee) {
        try {
          const savedJobsRes = await fetch("http://196.188.249.24:3010/api/save-jobs", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (savedJobsRes.ok) {
            const savedJobsData = await savedJobsRes.json();
            const savedJobIds = savedJobsData.items.map((item: { jobPostId: string }) => item.jobPostId);
            
            // Update the isSaved property for each job
            const jobsWithSavedStatus = sortedJobs.map((job: JobPosting) => ({
              ...job,
              isSaved: savedJobIds.includes(job.id)
            }));
            
            setFilteredJobs(jobsWithSavedStatus);
          } else {
            setFilteredJobs(sortedJobs);
          }
        } catch (error) {
          console.error("Error fetching saved jobs:", error);
          setFilteredJobs(sortedJobs);
        }
      } else {
        setFilteredJobs(sortedJobs);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
      toast({
        title: "Error",
        description: "Failed to fetch job postings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteJob = (deletedJobId: string) => {
    setFilteredJobs((prevJobs) => prevJobs.filter((job) => job.id !== deletedJobId));
  };

  const [filterValues, setFilterValues] = useState<{
    salary?: number;
    jobType?: string;
    location?: string;
    availability?: {
      freelance?: boolean;
      fullTime?: boolean;
      readyWork?: boolean;
    };
    jobPreference?: string;
    specialties?: Array<{ name: string; checked: boolean }>;
    industry?: string;
    experienceLevel?: string;
    educationLevel?: string;
    employmentType?: string;
  }>({
    salary: 1500,
    jobType: "All",
    location: "New York",
    availability: {
      freelance: true,
      fullTime: true,
      readyWork: true,
    },
    specialties: [
      { name: "Graphic Designer", checked: true },
      { name: "UI Designer", checked: true },
      { name: "UX Designer", checked: true },
      { name: "Web Design", checked: true },
    ],
  });

  const handleFilterChange = (updatedFilters: {
    salary?: number;
    jobType?: string;
    location?: string;
    availability?: { freelance?: boolean; fullTime?: boolean; readyWork?: boolean };
    jobPreference?: string;
    specialties?: { name: string; checked: boolean }[];
    industry?: string;
    experienceLevel?: string;
    educationLevel?: string;
    employmentType?: string;
  }) => {
    setFilterValues((prevFilters) => {
      const newFilters = {
        ...prevFilters,
        ...updatedFilters,
      };

      return newFilters;
    });
  };

  // Use useEffect to log the updated state after it changes
  useEffect(() => {
    fetchJobs();
  }, [filterValues.jobType]);

  // Filter jobs based on search query
  const getFilteredJobsBySearch = () => {
    if (!searchQuery.trim()) return filteredJobs;
    
    return filteredJobs.filter(job => 
      job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.position?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Get saved jobs
  const getSavedJobs = () => {
    return filteredJobs.filter(job => job.isSaved === true);
  };

  const displayedJobs = getFilteredJobsBySearch();
  const savedJobs = getSavedJobs();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row gap-6 h-full">
          {/* Filter Section */}
          {isEmployeeView && (
            <div className="w-full md:w-1/4 lg:w-1/5 sticky top-6 self-start">
              <Card className="p-4 shadow-md rounded-lg">
                <FilterSidebar
                  filterValues={filterValues}
                  onFilterChange={handleFilterChange}
                />
              </Card>
            </div>
          )}

          {/* Job List Section */}
          <div className={`${isEmployeeView ? "w-full md:w-3/4 lg:w-4/5" : "w-full"} flex flex-col`}>
            <Card className="p-4 shadow-md rounded-lg mb-2">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:w-3/4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      placeholder="Search by title, position, or description..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 py-6 h-12 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={fetchJobs}
                    className="rounded-full"
                    title="Refresh jobs"
                  >
                    <RefreshCw className="h-5 w-5" />
                  </Button>
                  
                  <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                    <button
                      onClick={() => setIsListView(true)}
                      className={`p-2 rounded-md transition-colors ${
                        isListView ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                      }`}
                      title="List view"
                    >
                      <List className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setIsListView(false)}
                      className={`p-2 rounded-md transition-colors ${
                        !isListView ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                      }`}
                      title="Grid view"
                    >
                      <Grid className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Tabs for All Jobs and Saved Jobs */}
            {isEmployeeView && (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-2">
                <TabsList className="grid grid-cols-2 w-full md:w-auto">
                  <TabsTrigger value="all" className="flex items-center gap-2">
                    <List className="h-4 w-4" />
                    All Jobs
                  </TabsTrigger>
                  <TabsTrigger value="saved" className="flex items-center gap-2">
                    <Bookmark className="h-4 w-4" />
                    Saved Jobs
                    {savedJobs.length > 0 && (
                      <span className="ml-1 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                        {savedJobs.length}
                      </span>
                    )}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}

            {/* Job Listings */}
            <div className="flex-1">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  <span className="ml-2 text-gray-600">Loading jobs...</span>
                </div>
              ) : (activeTab === "saved" && savedJobs.length === 0) ? (
                <Card className="p-8 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Bookmark className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium text-gray-700">No saved jobs</h3>
                    <p className="text-gray-500 mt-2">
                      You haven&apos;t saved any jobs yet. Click the bookmark icon on a job card to save it.
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setActiveTab("all")}
                    >
                      View all jobs
                    </Button>
                  </div>
                </Card>
              ) : displayedJobs.length === 0 ? (
                <Card className="p-8 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Search className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium text-gray-700">No jobs found</h3>
                    <p className="text-gray-500 mt-2">
                      {searchQuery ? "Try adjusting your search terms" : "No jobs match your current filters"}
                    </p>
                    {searchQuery && (
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => setSearchQuery("")}
                      >
                        Clear search
                      </Button>
                    )}
                  </div>
                </Card>
              ) : (
                <div className={`grid ${isListView ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
                  {(activeTab === "saved" ? savedJobs : displayedJobs).map((job) => (
                    <div key={job.id} className={isListView ? 'py-2' : 'h-full'}>
                      <JobCard 
                        job={job} 
                        isEmployer={!isEmployeeView} 
                        onDelete={handleDeleteJob}
                        onClick={() => setSelectedViewJob(job)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Job Details Drawer */}
      {selectedViewJob && (
        <JobDetail
          job={selectedViewJob}
          onClose={() => setSelectedViewJob(null)}
        />
      )}
    </div>
  );
};

export default ViewJobs;
