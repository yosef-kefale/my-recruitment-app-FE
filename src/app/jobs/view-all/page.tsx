"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useToast } from "@/hooks/use-toast";
import JobCard from "../../../components/job/job-card";
import FilterSidebar from "../../../components/job/filter-sidebar";
import JobDetail from "../../../components/job/job-detail";
import { Grid, List } from "lucide-react";
import { JobPosting } from "../../models/jobPosting";


const ViewJobs = () => {
  const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedViewJob, setSelectedViewJob] = useState<JobPosting | null>(
    null
  );

  useEffect(() => {
    fetchJobs();
  }, []); // Fetch jobs when the component mounts

  const [isListView, setIsListView] = useState(true);
  const [isEmployeeView, setIsEmployeeView] = useState(true);

  // const router = useRouter();

  const { toast } = useToast();

  const fetchJobs = async () => {
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
          : "http://196.188.249.24:3010/api/jobs";

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
      
      setFilteredJobs(sortedJobs);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch job postings",
        variant: "destructive",
      });
    } finally {
      // setLoading(false);
    }
  };

  const handleDeleteJob = (deletedJobId: string) => {
    setFilteredJobs((prevJobs) => prevJobs.filter((job) => job.id !== deletedJobId));
  };

  const [filterValues, setFilterValues] = useState({
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
    salary: number;
    jobType: string;
    location: string;
    availability: { freelance: boolean; fullTime: boolean; readyWork: boolean };
    jobPreference: string;
    specialties: { name: string; checked: boolean }[];
  }) => {
    setFilterValues((prevFilters) => {
      const newFilters = {
        ...prevFilters,
        ...updatedFilters,
      };

      console.log(newFilters);

      return newFilters;
    });
  };

  // Use useEffect to log the updated state after it changes
  useEffect(() => {
    console.log(filterValues);
    fetchJobs();
  }, [filterValues.jobType]);

  return (
    <div className="h-screen bg-slate-100">
      <div className="shadow-lg h-full">
        <div className="flex h-full gap-4">
          {/* Filter Section - Fixed Height */}
          {isEmployeeView && (
            <div className="w-1/5 overflow-y-auto border-t-0 rounded-none">
              <FilterSidebar
                filterValues={filterValues}
                onFilterChange={handleFilterChange}
              />
            </div>
          )}

          {/* Job List Section - Scrollable */}
          <div className={`${isEmployeeView ? "w-4/5" : "w-full mx-4"} flex flex-col h-full pr-4`}>
            <div className="mb-1 border-none">
              <div className="flex justify-between items-center">
                <div className="flex w-3/4 p-1 gap-2">
                  <Input
                    placeholder="Search by title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="py-2 h-10"
                  />
                  <Button className="bg-sky-600">Search</Button>
                  {/* <Button className="bg-red-500">Reset</Button> */}
                </div>

                <div className="flex justify-between items-center mb-4 mt-2 mr-2">
                  <div className="flex gap-4">
                    <button
                      onClick={() => setIsListView(true)}
                      className={`p-1 rounded-lg ${
                        isListView ? "bg-blue-500 text-white" : "bg-gray-200"
                      }`}
                    >
                      <List className="h-6 w-6" />
                    </button>
                    <button
                      onClick={() => setIsListView(false)}
                      className={`p-1 rounded-lg ${
                        !isListView ? "bg-blue-500 text-white" : "bg-gray-200"
                      }`}
                    >
                      <Grid className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Job List */}
            <div className="overflow-y-auto flex-1">
              <div className={`grid ${isListView ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-6 p-4`}>
                {filteredJobs.map((job) => (
                  <div key={job.id} className={isListView ? 'py-2' : 'h-full'}>
                    <JobCard job={job} isEmployer={!isEmployeeView} onDelete={handleDeleteJob}/>
                  </div>
                ))}
              </div>
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
