"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Organization } from "../../app/models/organization";
import { JobPosting } from "../../app/models/jobPosting";

// Define validation schema
const jobSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  description: z.string().min(1, "Description is required"),
  position: z.string().min(1, "Position is required"),
  workLocation: z.string().min(1, "Work location is required"),
  employmentType: z.string().min(1, "Employment type is required"),
  salary: z.string().min(1, "Salary is required"),
  experienceLevel: z.string().min(1, "Experience level is required"),
  fieldOfStudy: z.string().min(1, "Field of study is required"),
  educationLevel: z.string().min(1, "Education level is required"),
  gpa: z.string().min(1, "GPA is required"),
  skill: z.string().min(1, "Skills are required"),
  status: z.string().min(1, "Job status is required"),
});

const JobPostingForm = () => {
    const [organization, setOrganization] = useState<Organization | null>(null);

    useEffect(() => {
      const org = localStorage.getItem("organization");
      if (org) {
        setOrganization(JSON.parse(org) as Organization);
        console.log(JSON.parse(org)); // Check if data is retrieved
      }
    }, []);
    
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(jobSchema),
  });

  const onSubmit = async (data: JobPosting) => {
console.log(data);

    try {
      const res = await fetch(
        "http://196.188.249.24:3010/api/job-postings/create-job-posting",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data,
            skill: data.skill.split(",").map((s) => s.trim()), // Convert to array and remove spaces
            organizationId: organization?.id }),
        }
      );

      if (!res.ok) throw new Error("Failed to create job posting");

      toast({ title: "Job Posted Successfully", description: "Your job posting is live!" });
      router.push("/jobs/view-all");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center text-gray-900">
          Post a New Job
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Job Title */}
          <div>
            <Label htmlFor="title">Job Title</Label>
            <Input id="title" {...register("title")} placeholder="Enter job title" />
            {errors.title && <p className="text-red-500">{errors.title.message}</p>}
          </div>

          {/* Job Description */}
          <div>
            <Label htmlFor="description">Job Description</Label>
            <Textarea id="description" {...register("description")} placeholder="Write a brief description..." rows={4} />
            {errors.description && <p className="text-red-500">{errors.description.message}</p>}
          </div>

          {/* Row: Position & Work Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="position">Position</Label>
              <Input id="position" {...register("position")} placeholder="e.g., Software Engineer" />
              {errors.position && <p className="text-red-500">{errors.position.message}</p>}
            </div>
            <div>
              <Label htmlFor="workLocation">Work Location</Label>
              <Input id="workLocation" {...register("workLocation")} placeholder="e.g., Remote, On-site" />
              {errors.workLocation && <p className="text-red-500">{errors.workLocation.message}</p>}
            </div>
          </div>

          {/* Row: Employment Type & Salary */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="employmentType">Employment Type</Label>
              <Input id="employmentType" {...register("employmentType")} placeholder="e.g., Full-time" />
              {errors.employmentType && <p className="text-red-500">{errors.employmentType.message}</p>}
            </div>
            <div>
              <Label htmlFor="salary">Salary ($)</Label>
              <Input id="salary" {...register("salary")} type="number" placeholder="Enter salary" />
              {errors.salary && <p className="text-red-500">{errors.salary.message}</p>}
            </div>
          </div>

          {/* Row: Experience Level & Field of Study */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="experienceLevel">Experience Level</Label>
              <Input id="experienceLevel" {...register("experienceLevel")} placeholder="e.g., Mid-level" />
              {errors.experienceLevel && <p className="text-red-500">{errors.experienceLevel.message}</p>}
            </div>
            <div>
              <Label htmlFor="fieldOfStudy">Field of Study</Label>
              <Input id="fieldOfStudy" {...register("fieldOfStudy")} placeholder="e.g., Computer Science" />
              {errors.fieldOfStudy && <p className="text-red-500">{errors.fieldOfStudy.message}</p>}
            </div>
          </div>

          {/* Row: Education Level & GPA */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="educationLevel">Education Level</Label>
              <Input id="educationLevel" {...register("educationLevel")} placeholder="e.g., Bachelor's" />
              {errors.educationLevel && <p className="text-red-500">{errors.educationLevel.message}</p>}
            </div>
            <div>
              <Label htmlFor="gpa">GPA</Label>
              <Input id="gpa" {...register("gpa")} type="number" step="0.1" placeholder="Enter GPA" />
              {errors.gpa && <p className="text-red-500">{errors.gpa.message}</p>}
            </div>
          </div>

          {/* Skills */}
          <div>
            <Label htmlFor="skill">Skills (comma-separated)</Label>
            <Input id="skill" {...register("skill")} placeholder="e.g., JavaScript, React, Node.js" />
            {errors.skill && <p className="text-red-500">{errors.skill.message}</p>}
          </div>

          {/* Job Status */}
          <div>
            <Label htmlFor="status">Job Status</Label>
            <Input id="status" {...register("status")} placeholder="e.g., Open, Closed" />
            {errors.status && <p className="text-red-500">{errors.status.message}</p>}
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Post Job
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default JobPostingForm;
