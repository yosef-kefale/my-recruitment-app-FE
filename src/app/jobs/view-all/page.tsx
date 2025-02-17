"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface JobPosting {
  id: string;
  title: string;
  position: string;
  workLocation: string;
  employmentType: string;
  salary: string;
  skill: string[];
  status: string;
}

const ViewJobs = () => {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewMode, setViewMode] = useState("table");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const router = useRouter();

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
      setJobs(data.items);
      setFilteredJobs(data.items);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch job postings", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    let filtered = jobs;
    if (searchQuery) {
      filtered = filtered.filter(job => job.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (statusFilter !== "All") {
      filtered = filtered.filter(job => job.status === statusFilter);
    }
    setFilteredJobs(filtered);
  };

  const handleDelete = async () => {
    if (!jobToDelete) return;
    try {
      const res = await fetch(`http://196.188.249.24:3010/api/job-postings/${jobToDelete}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete job posting");
      toast({ title: "Success", description: "Job deleted successfully" });
      setJobs(jobs.filter(job => job.id !== jobToDelete));
      setShowConfirmDelete(false);
      setJobToDelete(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete job", variant: "destructive" });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between mb-4">
        <Input placeholder="Search by title..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-1/3" />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border rounded p-2">
          <option value="All">All Status</option>
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select>
        <div className="flex items-center gap-2">
          <span>Table</span>
          <Switch checked={viewMode === "card"} onCheckedChange={() => setViewMode(viewMode === "table" ? "card" : "table")} />
          <span>Card</span>
        </div>
      </div>
      
      <Card className="p-4 shadow-lg">
        {loading ? (
          <p>Loading...</p>
        ) : viewMode === "table" ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Employment</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.map(job => (
                <TableRow key={job.id}>
                  <TableCell>{job.title}</TableCell>
                  <TableCell>{job.position}</TableCell>
                  <TableCell>{job.workLocation}</TableCell>
                  <TableCell>{job.employmentType}</TableCell>
                  <TableCell>${job.salary}</TableCell>
                  <TableCell>{job.skill.join(", ")}</TableCell>
                  <TableCell>{job.status}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button size="sm" onClick={() => setSelectedJob(job)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => { setJobToDelete(job.id); setShowConfirmDelete(true); }}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredJobs.map(job => (
              <Card key={job.id} className="p-4 shadow-md">
                <h3 className="font-semibold">{job.title}</h3>
                <p>{job.position} - {job.workLocation}</p>
                <p>Salary: ${job.salary}</p>
                <p>Status: {job.status}</p>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" onClick={() => setSelectedJob(job)}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => { setJobToDelete(job.id); setShowConfirmDelete(true); }}>Delete</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
      <Dialog open={showConfirmDelete} onOpenChange={() => setShowConfirmDelete(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this job posting?</p>
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewJobs;
