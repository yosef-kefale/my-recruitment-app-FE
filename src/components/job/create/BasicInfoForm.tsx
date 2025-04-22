import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BasicInfoFormProps {
  title: string;
  setTitle: (value: string) => void;
  position: string;
  setPosition: (value: string) => void;
  industry: string;
  setIndustry: (value: string) => void;
  type: string;
  setType: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  employmentType: string;
  setEmploymentType: (value: string) => void;
  salaryRange: { min: string; max: string };
  setSalaryRange: (value: { min: string; max: string }) => void;
  deadline: string;
  setDeadline: (value: string) => void;
  positions: number;
  setPositions: (value: number) => void;
  status: string;
  setStatus: (value: string) => void;
  gender: string;
  setGender: (value: string) => void;
  minimumGPA: string;
  setMinimumGPA: (value: string) => void;
  applicationURL: string;
  setApplicationURL: (value: string) => void;
  experienceLevel: string;
  setExperienceLevel: (value: string) => void;
  fieldOfStudy: string;
  setFieldOfStudy: (value: string) => void;
  educationLevel: string;
  setEducationLevel: (value: string) => void;
  howToApply: string;
  setHowToApply: (value: string) => void;
  errors: Record<string, string>;
}

export default function BasicInfoForm({
  title,
  setTitle,
  position,
  setPosition,
  industry,
  setIndustry,
  type,
  setType,
  city,
  setCity,
  location,
  setLocation,
  employmentType,
  setEmploymentType,
  salaryRange,
  setSalaryRange,
  deadline,
  setDeadline,
  positions,
  setPositions,
  status,
  setStatus,
  gender,
  setGender,
  minimumGPA,
  setMinimumGPA,
  applicationURL,
  setApplicationURL,
  experienceLevel,
  setExperienceLevel,
  fieldOfStudy,
  setFieldOfStudy,
  educationLevel,
  setEducationLevel,
  howToApply,
  setHowToApply,
  errors,
}: BasicInfoFormProps) {
  return (
    <Card className="mb-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Basic Job Information</CardTitle>
        <CardDescription className="text-sm">
          Provide the basic information about the job.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Senior Software Engineer"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Position *</Label>
            <Select value={position} onValueChange={setPosition}>
              <SelectTrigger id="position">
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Software Engineer">Software Engineer</SelectItem>
                <SelectItem value="Product Manager">Product Manager</SelectItem>
                <SelectItem value="Data Scientist">Data Scientist</SelectItem>
                <SelectItem value="UX Designer">UX Designer</SelectItem>
                <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
                <SelectItem value="Project Manager">Project Manager</SelectItem>
                <SelectItem value="Business Analyst">Business Analyst</SelectItem>
                <SelectItem value="Marketing Manager">Marketing Manager</SelectItem>
                <SelectItem value="Sales Representative">Sales Representative</SelectItem>
                <SelectItem value="HR Manager">HR Manager</SelectItem>
                <SelectItem value="Financial Analyst">Financial Analyst</SelectItem>
                <SelectItem value="Content Writer">Content Writer</SelectItem>
                <SelectItem value="Customer Support">Customer Support</SelectItem>
                <SelectItem value="Operations Manager">Operations Manager</SelectItem>
                <SelectItem value="Research Analyst">Research Analyst</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="industry">Industry *</Label>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger id="industry">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="InformationTechnology">Information Technology</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                <SelectItem value="Retail">Retail</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="employmentType">Employment Type *</Label>
            <Select value={employmentType} onValueChange={setEmploymentType}>
              <SelectTrigger id="employmentType">
                <SelectValue placeholder="Select employment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Full-Time">Full-Time</SelectItem>
                <SelectItem value="Part-Time">Part-Time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Freelance">Freelance</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
                <SelectItem value="Temporary">Temporary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="experienceLevel">Experience Level *</Label>
            <Select value={experienceLevel} onValueChange={setExperienceLevel}>
              <SelectTrigger id="experienceLevel">
                <SelectValue placeholder="Select experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Entry-Level">Entry-Level</SelectItem>
                <SelectItem value="Mid-Level">Mid-Level</SelectItem>
                <SelectItem value="Senior">Senior</SelectItem>
                <SelectItem value="Lead">Lead</SelectItem>
                <SelectItem value="Executive">Executive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Job Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select job type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Remote">Remote</SelectItem>
                <SelectItem value="On-site">On-site</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g., Addis Ababa"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Bole Road, Addis Ababa, Ethiopia"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="salaryMin">Salary Range (Min)</Label>
            <Input
              id="salaryMin"
              value={salaryRange.min}
              onChange={(e) => setSalaryRange({ ...salaryRange, min: e.target.value })}
              placeholder="e.g., 50000"
              type="number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="salaryMax">Salary Range (Max)</Label>
            <Input
              id="salaryMax"
              value={salaryRange.max}
              onChange={(e) => setSalaryRange({ ...salaryRange, max: e.target.value })}
              placeholder="e.g., 100000"
              type="number"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="deadline">Application Deadline</Label>
            <Input
              id="deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              type="date"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="positions">Number of Positions</Label>
            <Input
              id="positions"
              type="number"
              min="1"
              value={positions}
              onChange={(e) => setPositions(Number(e.target.value))}
              placeholder="e.g., 1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="onHold">On Hold</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Any">Any</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="minimumGPA">Minimum GPA</Label>
            <Input
              id="minimumGPA"
              type="number"
              min="0"
              max="4"
              step="0.01"
              value={minimumGPA}
              onChange={(e) => setMinimumGPA(e.target.value)}
              placeholder="e.g., 3.0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="educationLevel">Education Level</Label>
            <Select value={educationLevel} onValueChange={setEducationLevel}>
              <SelectTrigger id="educationLevel">
                <SelectValue placeholder="Select education level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High School">High School</SelectItem>
                <SelectItem value="Associate">Associate</SelectItem>
                <SelectItem value="Bachelor">Bachelor</SelectItem>
                <SelectItem value="Master">Master</SelectItem>
                <SelectItem value="PhD">PhD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="applicationURL">Application URL</Label>
          <Input
            id="applicationURL"
            value={applicationURL}
            onChange={(e) => setApplicationURL(e.target.value)}
            placeholder="e.g., https://example.com/apply"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="howToApply">How to Apply</Label>
          <Textarea
            id="howToApply"
            value={howToApply}
            onChange={(e) => setHowToApply(e.target.value)}
            placeholder="Provide clear instructions on how candidates should apply. For example: 'To apply for this position, please submit your resume and a cover letter explaining why you are a good fit for this role. Applications should be sent to careers@company.com with the subject line 'Application for [Position Name]'. All applications will be reviewed within 5 business days.'"
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fieldOfStudy">Field of Study</Label>
          <Input
            id="fieldOfStudy"
            value={fieldOfStudy}
            onChange={(e) => setFieldOfStudy(e.target.value)}
            placeholder="e.g., Computer Science, Business Administration"
          />
        </div>
      </CardContent>
    </Card>
  );
} 