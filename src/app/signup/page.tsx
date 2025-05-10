"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { INDUSTRIES } from "../../lib/enums";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Label } from "../../components/ui/label";
import { Checkbox } from "../../components/ui/checkbox";
import { ScrollArea } from "../../components/ui/scroll-area";
import { registerOrganizationWithEtrade, createOrganizationAccount, createUser } from "@/lib/api";

export default function SignupPage() {
  const [userType, setUserType] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUserType(params.get("type") || "employee");
  }, []);

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [useEtrade, setUseEtrade] = useState(true);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);

  // Default form data based on user type
  const [formData, setFormData] = useState(
    userType === "employer"
      ? {
          tin: "",
          licenseNumber: "",
          companyName: "",
          industry: [""],
          email: "",
          phone: "",
          companySize: "",
          website: "",
          description: "",
          companyLogo: null,
          address: "",
        }
      : {
          phone: "",
          email: "",
          firstName: "",
          middleName: "",
          lastName: "",
          gender: "",
          status: "Active",
          password: "",
          birthDate: "",
          linkedinUrl: "",
          portfolioUrl: "",
          yearOfExperience: "",
          industry: [""],
          telegramUserId: "",
          preferredJobLocation: [""],
          highestLevelOfEducation: "Diploma",
          salaryExpectations: "",
          aiGeneratedJobFitScore: 0,
          skills: [""],
          profile: null,
          resume: null,
        }
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelect = (industry: string) => {
    setSelectedIndustries((prev) => {
      const updatedIndustries = prev.includes(industry)
        ? prev.filter((item) => item !== industry)
        : [...prev, industry];
  
      setFormData((formData) => ({
        ...formData,
        industry: updatedIndustries,
      }));
  
      return updatedIndustries;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (userType === "employer") {
        if (useEtrade) {
          if (!formData.tin || !formData.licenseNumber) {
            throw new Error("TIN and License Number are required");
          }
          await registerOrganizationWithEtrade({
            tin: formData.tin,
            licenseNumber: formData.licenseNumber,
          });
        } else {
          if (!formData.companyName || !formData.email || !formData.phone) {
            throw new Error("Company Name, Email, and Phone are required");
          }
          await createOrganizationAccount({
            companyName: formData.companyName,
            industry: formData.industry || [],
            email: formData.email,
            phone: formData.phone,
            companySize: formData.companySize || "",
            website: formData.website || "",
            description: formData.description || "",
            companyLogo: formData.companyLogo,
            address: formData.address || "",
          });
        }
      } else {
        if (!formData.email || !formData.firstName || !formData.lastName || !formData.password) {
          throw new Error("Email, First Name, Last Name, and Password are required");
        }
        await createUser({
          phone: formData.phone || "",
          email: formData.email,
          firstName: formData.firstName,
          middleName: formData.middleName || "",
          lastName: formData.lastName,
          gender: formData.gender || "",
          status: formData.status || "Active",
          password: formData.password,
          birthDate: formData.birthDate || "",
          linkedinUrl: formData.linkedinUrl || "",
          portfolioUrl: formData.portfolioUrl || "",
          yearOfExperience: formData.yearOfExperience || "",
          industry: formData.industry || [],
          telegramUserId: formData.telegramUserId || "",
          preferredJobLocation: formData.preferredJobLocation || [],
          highestLevelOfEducation: formData.highestLevelOfEducation || "Diploma",
          salaryExpectations: formData.salaryExpectations || "",
          aiGeneratedJobFitScore: formData.aiGeneratedJobFitScore || 0,
          skills: formData.skills || [],
          profile: formData.profile,
          resume: formData.resume,
        });
      }

      toast({
        title: "Signup successful!",
        description: "Redirecting to login...",
      });
      router.push("/login");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="flex justify-between items-center p-4 shadow-sm bg-white fixed top-0 left-0 w-full z-50">
        <Link href="/">
          <h1 className="text-2xl font-bold text-sky-600 cursor-pointer hover:text-sky-700 transition-colors">
            TalentHub
          </h1>
        </Link>
      </nav>

      <div className="flex mt-14 items-center justify-center min-h-[calc(100vh-56px)] p-4">
        <div className="w-full max-w-4xl">
          <Card className="w-full overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-sky-600 to-blue-600 text-white">
              <CardTitle className="text-3xl font-bold">
                {userType === "employer" ? "Employer Sign Up" : "Candidate Sign Up"}
              </CardTitle>
              <p className="text-sky-100 mt-2">
                {userType === "employer" 
                  ? "Join our platform to find the best talent for your organization"
                  : "Create your profile and start your job search journey"}
              </p>
            </CardHeader>
            <CardContent className="p-6">
              {userType === "employer" && (
                <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${!useEtrade ? 'text-gray-900' : 'text-gray-500'}`}>
                        Manual Signup
                      </span>
                      <Switch
                        checked={useEtrade}
                        onCheckedChange={() => setUseEtrade(!useEtrade)}
                        className="transition-transform scale-110"
                      />
                      <span className={`text-sm ${useEtrade ? 'text-gray-900' : 'text-gray-500'}`}>
                        Sign up with e-Trade
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {userType === "employer" ? (
                  useEtrade ? (
                    <div className="grid gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="tin" className="text-gray-700">TIN Number</Label>
                        <Input
                          id="tin"
                          name="tin"
                          placeholder="Enter your TIN number"
                          value={formData.tin}
                          onChange={handleInputChange}
                          required
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="licenseNumber" className="text-gray-700">License Number</Label>
                        <Input
                          id="licenseNumber"
                          name="licenseNumber"
                          placeholder="Enter your license number"
                          value={formData.licenseNumber}
                          onChange={handleInputChange}
                          required
                          className="h-12"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="companyName" className="text-gray-700">Company Name</Label>
                        <Input
                          id="companyName"
                          name="companyName"
                          placeholder="Enter your company name"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          required
                          className="h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray-700">Industries</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between h-12"
                            >
                              {selectedIndustries.length > 0
                                ? selectedIndustries.join(", ")
                                : "Select Industries"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[400px] p-4">
                            <ScrollArea className="h-[300px]">
                              <div className="grid grid-cols-2 gap-2">
                                {INDUSTRIES.map((industry) => (
                                  <div
                                    key={industry}
                                    className="flex items-center space-x-2"
                                  >
                                    <Checkbox
                                      id={industry}
                                      checked={selectedIndustries.includes(industry)}
                                      onCheckedChange={() => handleSelect(industry)}
                                    />
                                    <Label
                                      htmlFor={industry}
                                      className="cursor-pointer text-sm"
                                    >
                                      {industry}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </ScrollArea>
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-gray-700">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-gray-700">Phone</Label>
                          <Input
                            id="phone"
                            type="tel"
                            name="phone"
                            placeholder="Enter your phone number"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="h-12"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="companySize" className="text-gray-700">Company Size</Label>
                          <Input
                            id="companySize"
                            name="companySize"
                            placeholder="Enter company size"
                            value={formData.companySize}
                            onChange={handleInputChange}
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="website" className="text-gray-700">Website</Label>
                          <Input
                            id="website"
                            name="website"
                            placeholder="Enter company website"
                            value={formData.website}
                            onChange={handleInputChange}
                            className="h-12"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-gray-700">Company Description</Label>
                        <textarea
                          id="description"
                          name="description"
                          placeholder="Tell us about your company"
                          value={formData.description}
                          onChange={handleInputChange}
                          className="w-full p-3 border rounded-md min-h-[120px] focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-gray-700">Address</Label>
                        <Input
                          id="address"
                          name="address"
                          placeholder="Enter company address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="h-12"
                        />
                      </div>
                    </div>
                  )
                ) : (
                  <>
                    <Input
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      name="middleName"
                      placeholder="Middle Name"
                      value={formData.middleName}
                      onChange={handleInputChange}
                    />
                    <Input
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      type="tel"
                      name="phone"
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      name="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      name="linkedinUrl"
                      placeholder="LinkedIn URL"
                      value={formData.linkedinUrl}
                      onChange={handleInputChange}
                    />
                    <Input
                      name="portfolioUrl"
                      placeholder="Portfolio URL"
                      value={formData.portfolioUrl}
                      onChange={handleInputChange}
                    />
                    <Input
                      name="yearOfExperience"
                      type="number"
                      placeholder="Years of Experience"
                      value={formData.yearOfExperience}
                      onChange={handleInputChange}
                    />
                    <Input
                      name="salaryExpectations"
                      type="number"
                      placeholder="Salary Expectations"
                      value={formData.salaryExpectations}
                      onChange={handleInputChange}
                    />
                  </>
                )}

                <div className="flex flex-col gap-4 pt-4">
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-semibold transition-all duration-200"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Signing up...</span>
                      </div>
                    ) : (
                      "Sign Up"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
