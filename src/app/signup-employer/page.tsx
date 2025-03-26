"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import RichTextEditor, { RichTextEditorHandle } from "../../components/RichTextEditor";


const SignupEmployerPage = () => {
  const { register, handleSubmit, setValue } = useForm();
  const [loading, setLoading] = useState(false);
  const editorRef = useRef<RichTextEditorHandle>(null); // Ref for RichTextEditor
  const [editorContent, setEditorContent] = useState<string>(''); // State to store the editor content

  const handleGetContent = () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent(); // Get the editor content
      setEditorContent(content); // Update the state with the content
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    handleGetContent();
    setLoading(true);
    try {
        data.jobDescription = editorContent;
    //   const response = await axios.post(
    //     "http://196.188.249.24:3010/api/Organizations/create-account",
    //     data
    //   );
      console.log("Response:", data);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Employer Signup</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Job Details Section */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label>Job Title</Label>
            <Input
              {...register("jobTitle")}
              placeholder="Enter job title"
              required
            />
          </div>
          <div>
            <Label>Job Position</Label>
            <Input
              {...register("jobPosition")}
              placeholder="Enter job position"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1">
          <Label className="pb-1">Job Description</Label>
            <RichTextEditor ref={editorRef} />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label>Industry</Label>
            <Select
              onValueChange={(value) => setValue("industry", value)}
              defaultValue="InformationTechnology"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="InformationTechnology">
                  Information Technology
                </SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Work Type</Label>
            <Select onValueChange={(value) => setValue("workType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Work Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Full-Time">Full-Time</SelectItem>
                <SelectItem value="Part-Time">Part-Time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Location Section */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label>City</Label>
            <Input {...register("city")} defaultValue="Addis Ababa" required />
          </div>
          <div>
            <Label>Location</Label>
            <Input
              {...register("location")}
              placeholder="Enter location (e.g., Bole Road)"
              required
            />
          </div>
        </div>

        {/* Employment & Salary Section */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label>Employment Type</Label>
            <Select
              onValueChange={(value) => setValue("employmentType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Employment Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Permanent">Permanent</SelectItem>
                <SelectItem value="Temporary">Temporary</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Salary Range</Label>
            <Input
              {...register("salaryRange")}
              placeholder="Enter salary range (e.g., $2000 - $4000)"
              required
            />
          </div>
        </div>

        {/* Application Deadline */}
        <div className="grid grid-cols-1">
          <Label className="pb-1">Application Deadline</Label>
          <Input
            {...register("applicationDeadline")}
            type="datetime-local"
            required
          />
        </div>

        {/* Preferred Gender */}
        <div className="grid grid-cols-1">
          <Label className="pb-2">Preferred Gender</Label>
          <RadioGroup
            defaultValue="Any"
            onValueChange={(value) => setValue("preferredGender", value)}
          >
            <div className="flex gap-4">
              <Label>
                <RadioGroupItem value="Male" /> Male
              </Label>
              <Label>
                <RadioGroupItem value="Female" /> Female
              </Label>
              <Label>
                <RadioGroupItem value="Any" /> Any
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Experience & Education */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label>Experience Level</Label>
            <Input
              {...register("experienceLevel")}
              placeholder="Enter experience level (e.g., Mid-Level)"
              required
            />
          </div>
          <div>
            <Label>Field of Study</Label>
            <Input
              {...register("fieldOfStudy")}
              placeholder="Enter field of study (e.g., Computer Science)"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1">
          <Label className="pb-1">Education Level</Label>
          <Select onValueChange={(value) => setValue("educationLevel", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Education Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Bachelor">Bachelor</SelectItem>
              <SelectItem value="Master">Master</SelectItem>
              <SelectItem value="PhD">PhD</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Required Skills */}

        <div className="grid grid-cols-1">
          <Label className="pb-1">Required Skills</Label>
          <Textarea
            {...register("requiredSkills")}
            placeholder="Enter required skills (comma-separated)"
            required
          />
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1">
          <Label className="pb-1">Benefits</Label>
          <div className="flex gap-4">
            <Label>
              <Checkbox {...register("benefits")} value="Health Insurance" />{" "}
              Health Insurance
            </Label>
            <Label>
              <Checkbox {...register("benefits")} value="Remote Work Option" />{" "}
              Remote Work Option
            </Label>
          </div>
        </div>

        {/* Responsibilities */}
        <div className="grid grid-cols-1">
          <Label className="pb-1">Responsibilities</Label>
          <Textarea
            {...register("responsibilities")}
            placeholder="Enter responsibilities"
            required
          />
        </div>

        {/* How to Apply */}
        <div className="grid grid-cols-1">
          <Label className="pb-1">How to Apply</Label>
          <Textarea
            {...register("howToApply")}
            placeholder="Provide instructions for application"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button type="submit" disabled={loading} className="w-1/2">
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignupEmployerPage;
