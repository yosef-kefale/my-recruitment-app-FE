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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const SignupEmployerPage = () => {
  const { register, handleSubmit, setValue, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [progress, setProgress] = useState(0);
  const editorRef = useRef<RichTextEditorHandle>(null);
  const [editorContent, setEditorContent] = useState<string>('');
  const { toast } = useToast();

  const handleGetContent = () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      setEditorContent(content);
    }
  };

  const onSubmit = async (data: any) => {
    handleGetContent();
    setLoading(true);
    try {
      data.jobDescription = editorContent;
      console.log("Response:", data);
      toast({
        title: "Success",
        description: "Job posting created successfully!",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to create job posting. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  // Calculate form completion progress
  const calculateProgress = () => {
    const fields = [
      watch("jobTitle"),
      watch("jobPosition"),
      editorContent,
      watch("industry"),
      watch("workType"),
      watch("city"),
      watch("location"),
      watch("employmentType"),
      watch("salaryRange"),
      watch("applicationDeadline"),
      watch("preferredGender"),
      watch("experienceLevel"),
      watch("fieldOfStudy"),
      watch("educationLevel"),
      watch("requiredSkills"),
      watch("responsibilities"),
      watch("howToApply"),
    ];

    const filledFields = fields.filter(field => field && field.toString().trim() !== '').length;
    const progress = (filledFields / fields.length) * 100;
    setProgress(progress);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create a Job Posting</h1>
          <p className="text-gray-600">Fill in the details to find the perfect candidate for your role</p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="basic" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="details" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                Job Details
              </TabsTrigger>
              <TabsTrigger value="requirements" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                Requirements
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Job Title</Label>
                      <Input
                        {...register("jobTitle")}
                        placeholder="Enter job title"
                        required
                        onChange={calculateProgress}
                      />
                    </div>
                    <div>
                      <Label>Job Position</Label>
                      <Input
                        {...register("jobPosition")}
                        placeholder="Enter job position"
                        required
                        onChange={calculateProgress}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Job Description</Label>
                    <RichTextEditor ref={editorRef} onChange={calculateProgress} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Job Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Industry</Label>
                      <Select
                        onValueChange={(value) => {
                          setValue("industry", value);
                          calculateProgress();
                        }}
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
                      <Select 
                        onValueChange={(value) => {
                          setValue("workType", value);
                          calculateProgress();
                        }}
                      >
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>City</Label>
                      <Input 
                        {...register("city")} 
                        defaultValue="Addis Ababa" 
                        required 
                        onChange={calculateProgress}
                      />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input
                        {...register("location")}
                        placeholder="Enter location (e.g., Bole Road)"
                        required
                        onChange={calculateProgress}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Employment Type</Label>
                      <Select
                        onValueChange={(value) => {
                          setValue("employmentType", value);
                          calculateProgress();
                        }}
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
                        onChange={calculateProgress}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Application Deadline</Label>
                    <Input
                      {...register("applicationDeadline")}
                      type="datetime-local"
                      required
                      onChange={calculateProgress}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requirements" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Preferred Gender</Label>
                    <RadioGroup
                      defaultValue="Any"
                      onValueChange={(value) => {
                        setValue("preferredGender", value);
                        calculateProgress();
                      }}
                      className="flex gap-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Male" id="male" />
                        <Label htmlFor="male">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Female" id="female" />
                        <Label htmlFor="female">Female</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Any" id="any" />
                        <Label htmlFor="any">Any</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Experience Level</Label>
                      <Input
                        {...register("experienceLevel")}
                        placeholder="Enter experience level (e.g., Mid-Level)"
                        required
                        onChange={calculateProgress}
                      />
                    </div>
                    <div>
                      <Label>Field of Study</Label>
                      <Input
                        {...register("fieldOfStudy")}
                        placeholder="Enter field of study (e.g., Computer Science)"
                        required
                        onChange={calculateProgress}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Education Level</Label>
                    <Select 
                      onValueChange={(value) => {
                        setValue("educationLevel", value);
                        calculateProgress();
                      }}
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
                    <Label>Required Skills</Label>
                    <Textarea
                      {...register("requiredSkills")}
                      placeholder="Enter required skills (comma-separated)"
                      required
                      onChange={calculateProgress}
                    />
                  </div>

                  <div>
                    <Label>Benefits</Label>
                    <div className="flex gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          {...register("benefits")} 
                          value="Health Insurance"
                          onCheckedChange={calculateProgress}
                        />
                        <Label>Health Insurance</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          {...register("benefits")} 
                          value="Remote Work Option"
                          onCheckedChange={calculateProgress}
                        />
                        <Label>Remote Work Option</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Responsibilities</Label>
                    <Textarea
                      {...register("responsibilities")}
                      placeholder="Enter responsibilities"
                      required
                      onChange={calculateProgress}
                    />
                  </div>

                  <div>
                    <Label>How to Apply</Label>
                    <Textarea
                      {...register("howToApply")}
                      placeholder="Provide instructions for application"
                      required
                      onChange={calculateProgress}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const tabs = ["basic", "details", "requirements"];
                const currentIndex = tabs.indexOf(activeTab);
                if (currentIndex > 0) {
                  setActiveTab(tabs[currentIndex - 1]);
                }
              }}
              disabled={activeTab === "basic"}
            >
              Previous
            </Button>
            {activeTab === "requirements" ? (
              <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                {loading ? "Submitting..." : "Submit Job Posting"}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => {
                  const tabs = ["basic", "details", "requirements"];
                  const currentIndex = tabs.indexOf(activeTab);
                  if (currentIndex < tabs.length - 1) {
                    setActiveTab(tabs[currentIndex + 1]);
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Next
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupEmployerPage;
