"use client";

import { useEffect, useRef, useState } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import RichTextEditor, {
  RichTextEditorHandle,
} from "../../components/RichTextEditor";
import { Organization } from "../../app/models/organization";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "../ui/badge";

import ReactSlider from "react-slider";
import { useRouter } from "next/navigation";

const JobPostingForm = () => {
  const { register, handleSubmit, setValue } = useForm();
  const [loading, setLoading] = useState(false);
  const editorRef = useRef<RichTextEditorHandle>(null); // Ref for RichTextEditor
  const [jobDescription, setJobDescription] = useState(''); 
  const [editorContent, setEditorContent] = useState<string>(""); // State to store the editor content
  const [organization, setOrganization] = useState<Organization | null>(null);

  const [skills, setSkills] = useState<string[]>([]);
  const [skill, setSkill] = useState("");

  const [benefit, setBenefit] = useState<string>(""); // State for the input value
  const [benefits, setBenefits] = useState<string[]>([]); // State to store the list of benefits

  const [salaryRange, setSalaryRange] = useState([5000, 100000]); // Default range

  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const [test, setTest] = useState<unknown>();

  const { toast } = useToast();

  const router = useRouter();

  useEffect(() => {
    const org = localStorage.getItem("organization");
    if (org) {
      setOrganization(JSON.parse(org) as Organization);
      console.log(JSON.parse(org)); // Check if data is retrieved
    }
  }, []);

  const handleChange = (values: number[]) => {
    setSalaryRange(values);
    setValue("salaryRange", `${values[0]} - ${values[1]}`); // Store in form
  };

  const handleGetContent = () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent(); // Get the editor content
      setEditorContent(content); // Update the state with the content
    }
  };

  // For Responsibilities
  const handleAddResponsibility = () => {
    if (inputValue.trim() !== "") {
      const updatedResponsibilities = [...responsibilities, inputValue.trim()];
      setResponsibilities(updatedResponsibilities);
      setValue("responsibilities", updatedResponsibilities); // Update form state
      setInputValue(""); // Clear input
    }
  };

  const handleRemoveResponsibility = (index: number) => {
    const updatedResponsibilities = responsibilities.filter(
      (_, i) => i !== index
    );
    setResponsibilities(updatedResponsibilities);
    setValue("responsibilities", updatedResponsibilities); // Update form state
  };

  // Skills
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && skill.trim() !== "") {
      event.preventDefault();
      if (!skills.includes(skill.trim())) {
        const updatedSkills = [...skills, skill.trim()];
        setSkills(updatedSkills);
        setValue("requiredSkills", updatedSkills); // Update form state
      }
      setSkill(""); // Clear input field
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const updatedSkills = skills.filter((s) => s !== skillToRemove);
    setSkills(updatedSkills);
    setValue("requiredSkills", updatedSkills); // Update form state
  };

  // Function to handle "Enter" key and add the benefit to the list
  const handleKeyDownBenefits = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && benefit.trim() !== "") {
      if (!benefits.includes(benefit.trim())) {
        setBenefits((prevBenefits) => [...prevBenefits, benefit.trim()]);
      }
      setBenefit(""); // Clear the input field after adding
    }
  };

  // Function to remove a benefit from the list
  const removeBenefit = (benefitToRemove: string) => {
    setBenefits(benefits.filter((b) => b !== benefitToRemove));
  };

  const handleSave = () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      console.log('Saved Content:', content);
      setJobDescription(content);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    if (!token) throw new Error("No authentication token found");

    handleGetContent();
    setLoading(true);
     // Get the latest content from the editor before submitting
    const latestEditorContent = editorRef.current?.getContent() || "";

    setTimeout(async () => {
      setLoading(true);
      try {
        data.description = latestEditorContent; // Assign content after ensuring state update
        data.skill = skills;
        data.salaryRange = {
          minimum: salaryRange[0],
          maximum: salaryRange[1],
        };

        data.responsibilities = responsibilities;
        data.benefits = benefits;

        const formattedDeadline = data?.deadline
          ? new Date(data?.deadline).toISOString()
          : "";
        data.deadline = formattedDeadline;

        setTest(data);
        delete data.requiredSkills;
        const res = await fetch(
          "http://196.188.249.24:3010/api/jobs/create-job-posting",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Attach token to the request
            },
            body: JSON.stringify({
              ...data,
              organizationId: "2b004c6d-9af9-4586-bbdb-1d4abcd239fa",
            }),
          }
        );

        if (!res.ok) throw new Error("Failed to create job posting");

        toast({
          title: "Job Posted Successfully",
          description: "Your job posting is live!",
        });
        router.push("/jobs/view-all");

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
      setLoading(false);
    }, 100);

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-2 bg-white rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Post a New Job</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Job Details Section */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label>Job Title</Label>
            <Input
              {...register("title")}
              placeholder="Enter job title"
              required
            />
          </div>
          <div>
            <Label>Job Position</Label>
            <Input
              {...register("position")}
              placeholder="Enter job position"
              required
            />
          </div>
        </div>

        {/* Job Description Section */}
        <div className="grid grid-cols-1">
          <Label className="pb-1">Job Description</Label>
          <RichTextEditor ref={editorRef} onChange={setJobDescription} />
          <button onClick={handleSave}>Save</button>
        </div>

        {/* Job Industry Section */}
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
            <Select onValueChange={(value) => setValue("type", value)}>
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

          <div className="flex flex-col gap-3">
            <Label>Salary Range</Label>

            {/* Custom Styled Slider */}
            <ReactSlider
              className="w-full h-2 bg-gray-300 rounded-full relative"
              thumbClassName="w-5 h-5 bg-blue-600 border-2 border-white rounded-full cursor-pointer hover:scale-110 transition-transform shadow-md"
              trackClassName="bg-gradient-to-r from-blue-400 to-blue-600 h-4 rounded-full"
              min={5000}
              max={200000}
              step={500}
              value={salaryRange}
              onChange={handleChange}
              withTracks
            />

            {/* Display Selected Values */}
            <div className="flex justify-between text-md font-medium text-gray-600">
              <span>${salaryRange[0].toLocaleString()}</span>
              <span>${salaryRange[1].toLocaleString()}</span>
            </div>

            {/* Hidden Input to Store Data for Form Submission */}
            <input
              type="hidden"
              {...register("salaryRange")}
              value={`${salaryRange[0]} - ${salaryRange[1]}`}
            />
          </div>
        </div>

        {/* Application Deadline */}
        <div className="grid grid-cols-1">
          <Label className="pb-1">Application Deadline</Label>
          <Input {...register("deadline")} type="datetime-local" required />
        </div>

        {/* Preferred Gender */}
        <div className="grid grid-cols-1">
          <Label className="pb-2">Preferred Gender</Label>
          <RadioGroup
            defaultValue="Male"
            onValueChange={(value) => setValue("gender", value)}
          >
            <div className="flex gap-4">
              <Label>
                <RadioGroupItem value="Male" /> Male
              </Label>
              <Label>
                <RadioGroupItem value="Female" /> Female
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

        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label className="pb-1">Education Level</Label>
            <Select
              onValueChange={(value) => setValue("educationLevel", value)}
            >
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

          <div>
            <Label>Minimum GPA</Label>
            <Input
              type="number"
              {...register("minimumGPA")}
              placeholder="Enter minimum GPA (e.g. 3.8)"
              required
            />
          </div>
        </div>

        {/* Required Skills */}
        <div className="grid grid-cols-1">
          <Label className="pb-1">Required Skills</Label>
          <Input
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a skill and press Enter to add it"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {skills.map((s, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="flex items-center gap-2"
              >
                {s}
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-red-500 hover:bg-red-100"
                  onClick={() => removeSkill(s)}
                >
                  ✕
                </Button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1">
          <Label className="pb-1">Required Benefits</Label>
          <Input
            value={benefit}
            onChange={(e) => setBenefit(e.target.value)} // Update input value
            onKeyDown={handleKeyDownBenefits} // Add benefit on Enter key
            placeholder="Type a benefit and press Enter to add it"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {benefits.map((b, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="flex items-center gap-2"
              >
                {b}
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-red-500 hover:bg-red-100"
                  onClick={() => removeBenefit(b)} // Remove benefit on click
                >
                  ✕
                </Button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Responsibilities */}
        <div className="mt-4">
          <Label className="pb-1">Responsibilities</Label>
          {/* Input and Add Button */}
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter a responsibility"
              className="flex-1"
            />
            <Button
              type="button"
              onClick={handleAddResponsibility}
              className="bg-blue-500 text-white"
            >
              Add
            </Button>
          </div>

          {/* Display Added Responsibilities */}
          <ul className="mt-3 space-y-2">
            {responsibilities.map((responsibility, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-gray-100 p-2 rounded-md"
              >
                <span className="text-gray-800">{responsibility}</span>
                <Button
                  type="button"
                  onClick={() => handleRemoveResponsibility(index)}
                  className="text-red-500"
                >
                  ✖
                </Button>
              </li>
            ))}
          </ul>
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

      {/* Display test as JSON */}
      <pre className="mt-4 p-2 bg-gray-100 text-sm rounded">
        {JSON.stringify(test, null, 2)}
      </pre>
    </div>
  );
};

export default JobPostingForm;
