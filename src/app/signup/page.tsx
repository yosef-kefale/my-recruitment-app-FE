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
  
  const testData = () => {
    console.log(formData);
    console.log(selectedIndustries);
  }

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
    <div>
      <nav className="flex justify-between items-center p-4 shadow-md bg-gray-100 fixed top-0 left-0 w-full z-50">
        <Link href="/">
          <h1 className="text-2xl font-bold text-sky-600 cursor-pointer">
            TalentHub
          </h1>
        </Link>
      </nav>

      <div className="flex mt-14 items-center justify-center bg-gray-100">
        <div className="flex flex-col md:flex-row w-full max-w-6xl p-4 bg-white rounded-lg shadow-lg">
          <Card className="w-full md:min-w-[600px]">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                {userType === "employer"
                  ? "Employer Sign Up"
                  : "Candidate Sign Up"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userType === "employer" && (
                <div className="flex items-center justify-between mb-4">
                  <span></span>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-sm cursor-pointer"
                      onClick={() => setUseEtrade(false)}
                    >
                      Manual Signup
                    </span>
                    <Switch
                      checked={useEtrade}
                      onCheckedChange={() => setUseEtrade(!useEtrade)}
                      className="transition-transform scale-110"
                    />
                    <span
                      onClick={() => setUseEtrade(true)}
                      className="text-sm cursor-pointer"
                    >
                      Sign up with e-Trade
                    </span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {userType === "employer" ? (
                  useEtrade ? (
                    <>
                      <Input
                        name="tin"
                        placeholder="TIN Number"
                        value={formData.tin}
                        onChange={handleInputChange}
                        required
                      />
                      <Input
                        name="licenseNumber"
                        placeholder="License Number"
                        value={formData.licenseNumber}
                        onChange={handleInputChange}
                        required
                      />
                    </>
                  ) : (
                    <>
                      <Input
                        name="companyName"
                        placeholder="Company Name"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        required
                      />

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between"
                          >
                            {selectedIndustries.length > 0
                              ? selectedIndustries.join(", ")
                              : "Select Industries"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="min-w-full left-0 p-2 shadow-lg rounded-md bg-white">
                          <ScrollArea className="max-h-[200px] min-w-full rounded-md border p-2">
                            <div className="space-y-2">
                              {INDUSTRIES.map((industry) => (
                                <div
                                  key={industry}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={industry}
                                    checked={selectedIndustries.includes(
                                      industry
                                    )}
                                    onCheckedChange={() =>
                                      handleSelect(industry)
                                    }
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
                        name="companySize"
                        placeholder="Company Size"
                        value={formData.companySize}
                        onChange={handleInputChange}
                      />
                      <Input
                        name="website"
                        placeholder="Website"
                        value={formData.website}
                        onChange={handleInputChange}
                      />
                      <textarea
                        name="description"
                        placeholder="Company Description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full p-3 border rounded"
                      ></textarea>
                      <Input
                        name="address"
                        placeholder="Address"
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    </>
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

                <Button
                  className="w-full p-3 bg-gray-600 text-white"
                  onClick={()=> testData()}
                >
                  TEST
                </Button>

                <Button
                  type="submit"
                  className="w-full p-3 bg-blue-600 text-white"
                  disabled={loading}
                >
                  {loading ? "Signing up..." : "Sign Up"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
