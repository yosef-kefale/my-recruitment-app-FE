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
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [selectedViewJob, setSelectedViewJob] = useState<JobPosting | null>(
    null
  );
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewMode, setViewMode] = useState("card");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  // const router = useRouter();

  const { toast } = useToast();

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    handleFilter();
  }, [searchQuery, statusFilter, jobs]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://196.188.249.24:3010/api/job-postings");
      if (!res.ok) throw new Error("Failed to fetch jobs");

      const data = await res.json();

      // Sort jobs by createdAt in descending order (newest first)
      const sortedJobs = data.items.sort(
        (a: { createdAt: string }, b: { createdAt: string }) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setJobs(sortedJobs);
      setFilteredJobs(sortedJobs);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  const handleFilter = () => {
    let filtered = jobs;
    if (searchQuery) {
      filtered = filtered.filter((job) =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (statusFilter !== "All") {
      filtered = filtered.filter((job) => job.status === statusFilter);
    }
    setFilteredJobs(filtered);
  };

  const handleDelete = async () => {
    if (!jobToDelete) return;
    try {
      const res = await fetch(
        `http://196.188.249.24:3010/api/job-postings/${jobToDelete}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete job posting");
      toast({ title: "Success", description: "Job deleted successfully" });
      setJobs(jobs.filter((job) => job.id !== jobToDelete));
      setShowConfirmDelete(false);
      setJobToDelete(null);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete job",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="my-6 h-screen">
      <div className="p-2 shadow-lg h-full">
        <div className="flex h-full gap-4">
          {/* Filter Section - Fixed Height */}
          <Card className="w-1/4 h-full overflow-hidden">
            <FilterSidebar />
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
