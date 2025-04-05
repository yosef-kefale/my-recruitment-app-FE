"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { INDUSTRIES } from "@/lib/enums";
import { Progress } from "@/components/ui/progress";

// Validation Schema
const userSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string(),
  firstName: z.string().min(2, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(2, "Last name is required"),
  gender: z.enum(["Male", "Female"] as const),
  birthDate: z.string().optional(),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  portfolioUrl: z.string().url().optional().or(z.literal("")),
  yearOfExperience: z.coerce.number().min(0, "Must be a valid number"),
  industry: z.array(z.string()).optional(),
  telegramUserId: z.string().optional(),
  preferredJobLocation: z.array(z.string()).optional(),
  highestLevelOfEducation: z.enum(["Diploma", "Bachelor", "Master", "PhD"] as const),
  salaryExpectations: z.coerce.number().min(0, "Salary must be a positive number"),
  technicalSkills: z.array(z.string()).optional(),
  softSkills: z.array(z.string()).optional(),
  profileHeadLine: z.string().optional(),
  coverLetter: z.string().optional(),
  professionalSummery: z.string().optional(),
});

const UserProfileUpdate = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      phone: "",
      email: "",
      firstName: "",
      middleName: "",
      lastName: "",
      gender: "Male",
      birthDate: "",
      linkedinUrl: "",
      portfolioUrl: "",
      yearOfExperience: 0,
      industry: [],
      telegramUserId: "",
      preferredJobLocation: [],
      highestLevelOfEducation: "Diploma",
      salaryExpectations: 0,
      technicalSkills: [],
      softSkills: [],
      profileHeadLine: "",
      coverLetter: "",
      professionalSummery: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [technicalSkill, setTechnicalSkill] = useState("");
  const [softSkill, setSoftSkill] = useState("");
  const [preferredLocation, setPreferredLocation] = useState("");
  const [profileCompleteness, setProfileCompleteness] = useState(0);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadingProfilePic, setUploadingProfilePic] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  const user = JSON.parse(localStorage.getItem("organization") || "null");
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchUser() {
      try {
        if (!user?.id || !token) return;
        const response = await axios.get(`http://196.188.249.24:3010/api/users/${user.id}`);
        const userData = response.data;
        
        // Set profile picture URL if available
        if (userData.profilePicUrl) {
          setProfilePicUrl(userData.profilePicUrl);
        }
        console.log(userData);

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
        if (userData.yearOfExperience) setValue('yearOfExperience', userData.yearOfExperience);
        if (userData.telegramUserId) setValue('telegramUserId', userData.telegramUserId);
        if (userData.highestLevelOfEducation) setValue('highestLevelOfEducation', userData.highestLevelOfEducation);
        if (userData.salaryExpectations) setValue('salaryExpectations', userData.salaryExpectations);
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

  const handleProfilePicUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id || !token) return;

    try {
      setUploadingProfilePic(true);
      
      // Create a new FormData object
      const formData = new FormData();
      // Append the file with the correct field name expected by the server
      formData.append('file', file);

      const response = await axios.post(
        `http://196.188.249.24:3010/api/users/upload-profile/${user.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Update profile picture URL from response
      if (response.data.profilePicUrl) {
        setProfilePicUrl(response.data.profilePicUrl);
        console.log("Profile picture uploaded successfully");
      } else {
        console.error("No profile picture URL returned from server");
      }

      // Refresh profile completeness after upload
      const completenessResponse = await axios.get(
        `http://196.188.249.24:3010/api/users/get-profile-completeness/${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setProfileCompleteness(completenessResponse.data.score || 0);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert("Failed to upload profile picture. Please try again.");
    } finally {
      setUploadingProfilePic(false);
    }
  };

  const onSubmit = async (data: unknown) => {
    try {
      setLoading(true);
      if (!user?.id) return;
      const config = {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      };
      await axios.put(`http://196.188.249.24:3010/api/users/${user.id}`, data, config);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id || !token) return;

    try {
      setUploadingResume(true);
      
      // Create a new FormData object
      const formData = new FormData();
      // Append the file with the correct field name expected by the server
      formData.append('file', file);

      const response = await axios.post(
        `http://196.188.249.24:3010/api/users/upload-resume/${user.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        console.log("Resume uploaded successfully");
        alert("Resume uploaded successfully!");
      } else {
        console.error("Resume upload failed:", response.data.message);
        alert("Failed to upload resume: " + (response.data.message || "Unknown error"));
      }

      // Refresh profile completeness after upload
      const completenessResponse = await axios.get(
        `http://196.188.249.24:3010/api/users/get-profile-completeness/${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setProfileCompleteness(completenessResponse.data.score || 0);
    } catch (error) {
      console.error("Error uploading resume:", error);
      alert("Failed to upload resume. Please try again.");
    } finally {
      setUploadingResume(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Update Profile</h2>
        <div className="flex items-center gap-3">
          <div className="text-sm font-medium text-gray-600">
            Profile Completeness
          </div>
          <div className="w-32">
            <Progress value={profileCompleteness} className="h-2" />
          </div>
          <div className="text-sm font-semibold text-blue-600">
            {Math.round(profileCompleteness)}%
          </div>
        </div>
      </div>

      <div className="mb-8 flex flex-col items-center">
        <div className="relative w-32 h-32 mb-4">
          {profilePicUrl ? (
            <img
              src={profilePicUrl}
              alt="Profile"
              className="w-full h-full rounded-full object-cover border-4 border-blue-100"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center border-4 border-blue-100">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePicUpload}
            className="hidden"
            id="profile-pic-upload"
            disabled={uploadingProfilePic}
          />
          <label
            htmlFor="profile-pic-upload"
            className={`absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-blue-600 transition-colors ${
              uploadingProfilePic ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {uploadingProfilePic ? (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            )}
          </label>
        </div>
        <div className="text-sm text-gray-500">
          {uploadingProfilePic ? 'Uploading...' : 'Click to upload profile picture'}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              onValueChange={(value: "Male" | "Female") => setValue("gender", value)} 
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
              onValueChange={(value: "Diploma" | "Bachelor" | "Master" | "PhD") => setValue("highestLevelOfEducation", value)} 
              defaultValue={watch("highestLevelOfEducation")}
            >
              <SelectTrigger className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select Education Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Diploma">Diploma</SelectItem>
                <SelectItem value="Bachelor">Bachelor</SelectItem>
                <SelectItem value="Master">Master</SelectItem>
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

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Cover Letter</label>
            <Textarea 
              className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-[150px]"
              {...register("coverLetter")} 
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Resume</label>
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
        </div>
        
        <Button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all"
        >
          {loading ? "Updating..." : "Update Profile"}
        </Button>
      </form>
    </div>
  );
};

export default UserProfileUpdate;