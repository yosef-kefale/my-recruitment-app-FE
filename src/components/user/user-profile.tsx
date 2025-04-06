"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { INDUSTRIES } from "@/lib/enums";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { PublicProfile } from "./public-profile";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Validation Schema
const userSchema = z.object({
  phone: z.string().optional(),
  email: z.string(),
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  gender: z.string().optional(),
  birthDate: z.string().optional(),
  linkedinUrl: z.string().optional(),
  portfolioUrl: z.string().optional(),
  yearOfExperience: z.preprocess((val) => {
    if (typeof val === 'string') {
      return val === "" ? null : Number(val);
    }
    return val;
  }, z.number().nullable().optional()),
  industry: z.array(z.string()).optional(),
  telegramUserId: z.string().optional(),
  preferredJobLocation: z.array(z.string()).optional(),
  highestLevelOfEducation: z.string().optional(),
  salaryExpectations: z.preprocess((val) => {
    if (typeof val === 'string') {
      return val === "" ? null : Number(val);
    }
    return val;
  }, z.number().nullable().optional()),
  technicalSkills: z.array(z.string()).optional(),
  softSkills: z.array(z.string()).optional(),
  profile: z.record(z.unknown()).optional(),
  resume: z.record(z.unknown()).optional(),
  educations: z.record(z.unknown()).optional(),
  experiences: z.record(z.unknown()).optional(),
  socialMediaLinks: z.record(z.unknown()).optional(),
  profileHeadLine: z.string().optional(),
  coverLetter: z.string().optional(),
  professionalSummery: z.string().optional(),
});

type FormValues = z.infer<typeof userSchema>;

const UserProfileUpdate = () => {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "profile";
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      phone: "",
      email: "",
      firstName: "",
      middleName: "",
      lastName: "",
      gender: "",
      birthDate: "",
      linkedinUrl: "",
      portfolioUrl: "",
      yearOfExperience: null,
      industry: [],
      telegramUserId: "",
      preferredJobLocation: [],
      highestLevelOfEducation: "",
      salaryExpectations: null,
      technicalSkills: [],
      softSkills: [],
      profile: {},
      resume: {},
      educations: {},
      experiences: {},
      socialMediaLinks: {},
      profileHeadLine: "",
      coverLetter: "",
      professionalSummery: "",
    } as FormValues,
  });

  const [loading, setLoading] = useState(false);
  const [technicalSkill, setTechnicalSkill] = useState("");
  const [softSkill, setSoftSkill] = useState("");
  const [preferredLocation, setPreferredLocation] = useState("");
  const [profileCompleteness, setProfileCompleteness] = useState(0);
  const [uploadingResume, setUploadingResume] = useState(false);
  const user = JSON.parse(localStorage.getItem("organization") || "null");
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchUser() {
      try {
        if (!user?.id || !token) return;
        const response = await axios.get(`http://196.188.249.24:3010/api/users/${user.id}`);
        const userData = response.data;
        
        // Type-safe way to set form values
        if (userData.phone) setValue('phone', userData.phone);
        if (userData.email) setValue('email', userData.email);
        if (userData.firstName) setValue('firstName', userData.firstName);
        if (userData.middleName) setValue('middleName', userData.middleName);
        if (userData.lastName) setValue('lastName', userData.lastName);
        if (userData.gender) setValue('gender', userData.gender);
        if (userData.birthDate) setValue('birthDate', userData.birthDate);
        if (userData.linkedinUrl) setValue('linkedinUrl', userData.linkedinUrl);
        if (userData.portfolioUrl) setValue('portfolioUrl', userData.portfolioUrl);
        if (userData.yearOfExperience !== null) setValue('yearOfExperience', userData.yearOfExperience);
        if (userData.telegramUserId) setValue('telegramUserId', userData.telegramUserId);
        if (userData.highestLevelOfEducation) setValue('highestLevelOfEducation', userData.highestLevelOfEducation);
        if (userData.salaryExpectations !== null) setValue('salaryExpectations', userData.salaryExpectations);
        if (userData.technicalSkills) setValue('technicalSkills', userData.technicalSkills);
        if (userData.softSkills) setValue('softSkills', userData.softSkills);
        if (userData.profileHeadLine) setValue('profileHeadLine', userData.profileHeadLine);
        if (userData.coverLetter) setValue('coverLetter', userData.coverLetter);
        if (userData.professionalSummery) setValue('professionalSummery', userData.professionalSummery);
        if (userData.industry) setValue('industry', userData.industry);
        if (userData.preferredJobLocation) setValue('preferredJobLocation', userData.preferredJobLocation);

        // Fetch profile completeness score
        const completenessResponse = await axios.get(
          `http://196.188.249.24:3010/api/users/get-profile-completeness/${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setProfileCompleteness(completenessResponse.data.score || 0);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
    fetchUser();
  }, [user?.id, token, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoading(true);
      if (!user?.id) return;
      
      // Convert empty strings to null and ensure arrays are properly formatted
      const formattedData = Object.entries(data).reduce((acc, [key, value]) => {
        if (value === "") {
          acc[key] = null;
        } else if (key === "yearOfExperience" || key === "salaryExpectations") {
          acc[key] = value === null ? null : Number(value);
        } else if (key === "preferredJobLocation" || key === "industry" || key === "technicalSkills" || key === "softSkills") {
          // Ensure arrays are properly formatted
          acc[key] = Array.isArray(value) ? value : [];
        } else {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, unknown>);

      const config = {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      };
      
      const response = await axios.put(
        `http://196.188.249.24:3010/api/users/${user.id}`,
        formattedData,
        config
      );
      
      if (response.data) {
        toast({
          title: "Success",
          description: "Profile updated successfully",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      if (axios.isAxiosError(error)) {
        console.error("Error details:", error.response?.data);
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  });

  const handleAddTechnicalSkill = () => {
    if (technicalSkill.trim()) {
      const currentSkills = watch("technicalSkills") || [];
      setValue("technicalSkills", [...currentSkills, technicalSkill.trim()]);
      setTechnicalSkill("");
    }
  };

  const handleRemoveTechnicalSkill = (skillToRemove: string) => {
    const currentSkills = watch("technicalSkills") || [];
    setValue("technicalSkills", currentSkills.filter(skill => skill !== skillToRemove));
  };

  const handleAddSoftSkill = () => {
    if (softSkill.trim()) {
      const currentSkills = watch("softSkills") || [];
      setValue("softSkills", [...currentSkills, softSkill.trim()]);
      setSoftSkill("");
    }
  };

  const handleRemoveSoftSkill = (skillToRemove: string) => {
    const currentSkills = watch("softSkills") || [];
    setValue("softSkills", currentSkills.filter(skill => skill !== skillToRemove));
  };

  const handleAddPreferredLocation = () => {
    if (preferredLocation.trim()) {
      const currentLocations = watch("preferredJobLocation") || [];
      setValue("preferredJobLocation", [...currentLocations, preferredLocation.trim()]);
      setPreferredLocation("");
    }
  };

  const handleRemovePreferredLocation = (locationToRemove: string) => {
    const currentLocations = watch("preferredJobLocation") || [];
    setValue("preferredJobLocation", currentLocations.filter(location => location !== locationToRemove));
  };

  const handleIndustrySelect = (industry: string) => {
    const currentIndustries = watch("industry") || [];
    if (currentIndustries.includes(industry)) {
      setValue("industry", currentIndustries.filter(i => i !== industry));
    } else {
      setValue("industry", [...currentIndustries, industry]);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    try {
      setUploadingResume(true);
      const formData = new FormData();
      formData.append("resume", file);

      const config = {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const response = await axios.post(
        `http://196.188.249.24:3010/api/users/${user.id}/resume`,
        formData,
        config
      );

      if (response.data) {
        toast({
          title: "Success",
          description: "Resume uploaded successfully",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast({
        title: "Error",
        description: "Failed to upload resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingResume(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Profile</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              View Public Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Public Profile</DialogTitle>
            </DialogHeader>
            {user?.id && <PublicProfile userId={user.id} />}
          </DialogContent>
        </Dialog>
      </div>

      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b">
          <RadioGroup 
            defaultValue="active" 
            className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="active" id="active" />
              <Label htmlFor="active" className="font-medium">Active search</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Talenthub will show you as an active candidate for all recruiters and send you messages for every contact</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="passive" id="passive" />
              <Label htmlFor="passive" className="font-medium">Passive search</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Talenthub will not show you as an active candidate, but recruiters can write to you</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="offline" id="offline" />
              <Label htmlFor="offline" className="font-medium">Offline</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Talenthub will not show you as an active candidate and recruiters can not write to you</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </RadioGroup>
          <Button 
            disabled={loading} 
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? "Saving..." : "Save Status"}
          </Button>
        </div>

        <Tabs defaultValue={activeTab} className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none bg-gray-50 p-0 h-auto">
            <TabsTrigger value="profile" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-t-lg px-6 py-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Profile
            </TabsTrigger>
            <TabsTrigger value="cv" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-t-lg px-6 py-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              CV
            </TabsTrigger>
            <TabsTrigger value="contacts" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-t-lg px-6 py-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              Contacts
            </TabsTrigger>
            <TabsTrigger value="statistics" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-t-lg px-6 py-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
              Statistics
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="p-6">
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <Input 
                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500" 
                    {...register("phone")} 
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <Input 
                    className="w-full bg-gray-50 border-gray-300" 
                    readOnly 
                    {...register("email")} 
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <Input 
                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500" 
                    {...register("firstName")} 
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                  <Input 
                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500" 
                    {...register("middleName")} 
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <Input 
                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500" 
                    {...register("lastName")} 
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <Select 
                    onValueChange={(value) => setValue("gender", value)} 
                    defaultValue={watch("gender")}
                  >
                    <SelectTrigger className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Birth Date</label>
                  <Input 
                    type="date" 
                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    {...register("birthDate")} 
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
                  <Input 
                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    {...register("linkedinUrl")} 
                  />
                  {errors.linkedinUrl && (
                    <p className="text-sm text-red-500 mt-1">{errors.linkedinUrl.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Portfolio URL</label>
                  <Input 
                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    {...register("portfolioUrl")} 
                  />
                  {errors.portfolioUrl && (
                    <p className="text-sm text-red-500 mt-1">{errors.portfolioUrl.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Telegram User ID</label>
                  <Input 
                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    {...register("telegramUserId")} 
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
                  <Input 
                    type="number"
                    min="0"
                    step="1"
                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    {...register("yearOfExperience")} 
                  />
                  {errors.yearOfExperience && (
                    <p className="text-sm text-red-500 mt-1">{errors.yearOfExperience.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Industries</label>
                  <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-gray-50">
                    {INDUSTRIES.map((industry) => (
                      <Button
                        key={industry}
                        type="button"
                        variant={watch("industry")?.includes(industry) ? "default" : "outline"}
                        onClick={() => handleIndustrySelect(industry)}
                        className={`${
                          watch("industry")?.includes(industry)
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : "border-gray-300 hover:border-blue-500"
                        }`}
                      >
                        {industry}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Technical Skills</label>
                  <div className="flex gap-2">
                    <Input
                      value={technicalSkill}
                      onChange={(e) => setTechnicalSkill(e.target.value)}
                      placeholder="Add a technical skill"
                      className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddTechnicalSkill}
                      className="bg-blue-500 text-white hover:bg-blue-600"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2 p-3 border rounded-lg bg-gray-50">
                    {watch("technicalSkills")?.map((skill) => (
                      <Badge key={skill} variant="secondary" className="flex items-center gap-2 bg-blue-100 text-blue-800">
                        {skill}
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-4 w-4 p-0 hover:bg-blue-200"
                          onClick={() => handleRemoveTechnicalSkill(skill)}
                        >
                          ×
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Soft Skills</label>
                  <div className="flex gap-2">
                    <Input
                      value={softSkill}
                      onChange={(e) => setSoftSkill(e.target.value)}
                      placeholder="Add a soft skill"
                      className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddSoftSkill}
                      className="bg-blue-500 text-white hover:bg-blue-600"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2 p-3 border rounded-lg bg-gray-50">
                    {watch("softSkills")?.map((skill) => (
                      <Badge key={skill} variant="secondary" className="flex items-center gap-2 bg-green-100 text-green-800">
                        {skill}
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-4 w-4 p-0 hover:bg-green-200"
                          onClick={() => handleRemoveSoftSkill(skill)}
                        >
                          ×
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Preferred Job Locations</label>
                  <div className="flex gap-2">
                    <Input
                      value={preferredLocation}
                      onChange={(e) => setPreferredLocation(e.target.value)}
                      placeholder="Add a preferred location"
                      className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddPreferredLocation}
                      className="bg-blue-500 text-white hover:bg-blue-600"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2 p-3 border rounded-lg bg-gray-50">
                    {watch("preferredJobLocation")?.map((location) => (
                      <Badge key={location} variant="secondary" className="flex items-center gap-2 bg-purple-100 text-purple-800">
                        {location}
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-4 w-4 p-0 hover:bg-purple-200"
                          onClick={() => handleRemovePreferredLocation(location)}
                        >
                          ×
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Highest Level of Education</label>
                  <Select 
                    onValueChange={(value) => setValue("highestLevelOfEducation", value)} 
                    defaultValue={watch("highestLevelOfEducation")}
                  >
                    <SelectTrigger className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Select Education Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Diploma">Diploma</SelectItem>
                      <SelectItem value="BSC">Bachelor&apos;s Degree</SelectItem>
                      <SelectItem value="MSC">Master&apos;s Degree</SelectItem>
                      <SelectItem value="PhD">PhD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Salary Expectations</label>
                  <Input 
                    type="number" 
                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    {...register("salaryExpectations")} 
                  />
                  {errors.salaryExpectations && (
                    <p className="text-sm text-red-500 mt-1">{errors.salaryExpectations.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Profile Headline</label>
                  <Input 
                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    {...register("profileHeadLine")} 
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Professional Summary</label>
                  <Textarea 
                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-[100px]"
                    {...register("professionalSummery")} 
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all"
              >
                {loading ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="cv" className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Cover Letter</h3>
                <Textarea 
                  className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-[200px]"
                  {...register("coverLetter")} 
                />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Resume</h3>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                    className="hidden"
                    id="resume-upload"
                    disabled={uploadingResume}
                  />
                  <label
                    htmlFor="resume-upload"
                    className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer ${
                      uploadingResume ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {uploadingResume ? 'Uploading...' : 'Upload Resume'}
                  </label>
                  <span className="text-sm text-gray-500">
                    Accepted formats: PDF, DOC, DOCX
                  </span>
                </div>
              </div>
              
              <Button 
                onClick={onSubmit} 
                disabled={loading} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all"
              >
                {loading ? "Saving..." : "Save CV"}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="contacts" className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <Input 
                    className="w-full bg-gray-50 border-gray-300" 
                    readOnly 
                    {...register("email")} 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <Input 
                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500" 
                    {...register("phone")} 
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
                  <Input 
                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    {...register("linkedinUrl")} 
                  />
                  {errors.linkedinUrl && (
                    <p className="text-sm text-red-500 mt-1">{errors.linkedinUrl.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Portfolio URL</label>
                  <Input 
                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    {...register("portfolioUrl")} 
                  />
                  {errors.portfolioUrl && (
                    <p className="text-sm text-red-500 mt-1">{errors.portfolioUrl.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Telegram User ID</label>
                  <Input 
                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    {...register("telegramUserId")} 
                  />
                </div>
              </div>
              
              <Button 
                onClick={onSubmit} 
                disabled={loading} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all"
              >
                {loading ? "Saving..." : "Save Contact Information"}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="statistics" className="p-6">
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-none shadow-md">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="text-4xl font-bold text-blue-600 mb-2">12</div>
                      <div className="text-lg font-medium text-gray-700">Applications Submitted</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-none shadow-md">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">5</div>
                      <div className="text-lg font-medium text-gray-700">Interviews Scheduled</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-none shadow-md">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="text-4xl font-bold text-purple-600 mb-2">3</div>
                      <div className="text-lg font-medium text-gray-700">Job Offers Received</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-none shadow-md">
                  <CardHeader>
                    <CardTitle>Application Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Applied</span>
                        <span className="font-medium">12</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Under Review</span>
                        <span className="font-medium">8</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '66%' }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Interviewed</span>
                        <span className="font-medium">5</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '41%' }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Offers</span>
                        <span className="font-medium">3</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-none shadow-md">
                  <CardHeader>
                    <CardTitle>Profile Completeness</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Overall</span>
                        <span className="font-medium">{Math.round(profileCompleteness)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${profileCompleteness}%` }}></div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Basic Information</span>
                          <span className="font-medium">90%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '90%' }}></div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Professional Details</span>
                          <span className="font-medium">75%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Skills</span>
                          <span className="font-medium">60%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">CV & Cover Letter</span>
                          <span className="font-medium">45%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                      <div>
                        <p className="font-medium">Applied to Senior Frontend Developer at TechCorp</p>
                        <p className="text-sm text-gray-500">2 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                      <div>
                        <p className="font-medium">Interview scheduled with HR Manager at Innovate Inc</p>
                        <p className="text-sm text-gray-500">5 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                      <div>
                        <p className="font-medium">Received job offer from StartupX</p>
                        <p className="text-sm text-gray-500">1 week ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
                      <div>
                        <p className="font-medium">Profile viewed by 5 recruiters</p>
                        <p className="text-sm text-gray-500">2 weeks ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfileUpdate;