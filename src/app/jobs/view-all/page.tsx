"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import JobCard from "../../../components/job/job-card";
import FilterSidebar from "../../../components/job/filter-sidebar";
import JobDetail from "../../../components/job/job-detail";

interface JobPosting {
  id: string;
  title: string;
  description: string;
  position: string;
  workLocation: string;
  employmentType: string;
  salary: number;
  organizationId: string;
  requirementId: string;
  skill: string[];
  status: string;
  createdAt: string;
}

const ViewJobs = () => {
  const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedViewJob, setSelectedViewJob] = useState<JobPosting | null>(
    null
  );

  // const router = useRouter();

  const { toast } = useToast();


  const fetchJobs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      if (!token) throw new Error("No authentication token found");
  
      // Determine the correct API endpoint
      const apiUrl =
        filterValues.jobType === "For me"
          ? "http://196.188.249.24:3010/api/job-postings/get-all-job-postings-by-skills"
          : "http://196.188.249.24:3010/api/job-postings/get-all-job-postings";
  
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

      setFilteredJobs(sortedJobs);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch job postings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const [filterValues, setFilterValues] = useState({
    salary: 1500,
    jobType: "For me",
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
    salary: number; 
    jobType: string; 
    location: string; 
    availability: { freelance: boolean; fullTime: boolean; readyWork: boolean }; 
    jobPreference: string; 
    specialties: { name: string; checked: boolean }[] 
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
  

  return (
    <div className="my-4 h-screen">
      <div className="p-2 shadow-lg h-full">
        <div className="flex h-full gap-4">
          {/* Filter Section - Fixed Height */}
          <Card className="w-1/4 overflow-y-auto">
          <FilterSidebar filterValues={filterValues} onFilterChange={handleFilterChange} />
          </Card>
  
          {/* Job List Section - Scrollable */}
          <div className="w-3/4 flex flex-col pr-4 h-full">
            <Card className="flex p-2 mb-2 shadow-lg gap-2">
              <Input
                placeholder="Search by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-3/4"
              />
              <Button className="bg-blue-500">Search</Button>
              <Button className="bg-red-500">Reset</Button>
            </Card>
            
  
            {/* Scrollable Job List */}
            <div className="overflow-y-auto flex-1">
              {filteredJobs.map((job) => (
                <div key={job.id}>
                  <JobCard job={job} onOpen={() => setSelectedViewJob(job)} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Job Details Drawer */}
      {selectedViewJob && (
        <JobDetail job={selectedViewJob} onClose={() => setSelectedViewJob(null)} />
      )}
    </div>
  );
  
};

export default ViewJobs;
