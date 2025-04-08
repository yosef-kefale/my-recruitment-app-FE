"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Switch } from "@/components/ui/switch"; // Import switch component
import { INDUSTRIES } from "../../lib/enums";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Label } from "../../components/ui/label";
import { Checkbox } from "../../components/ui/checkbox";
import { ScrollArea } from "../../components/ui/scroll-area";

export default function SignupPage() {
  const [userType, setUserType] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUserType(params.get("type") || "employee");
  }, []);

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [useEtrade, setUseEtrade] = useState(true); // Default to eTrade signup
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    const endpoint =
      userType === "employer"
        ? useEtrade
          ? "https://196.188.249.24:3010/api/Organizations/register-organization-with-etrade"
          : "https://196.188.249.24:3010/api/Organizations/create-account"
        : "https://196.188.249.24:3010/api/users";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");

      toast({
        title: "Signup successful!",
        description: "Redirecting to login...",
      });
      router.push("/login");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
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
                        onChange={handleChange}
                        required
                      />
                      <Input
                        name="licenseNumber"
                        placeholder="License Number"
                        value={formData.licenseNumber}
                        onChange={handleChange}
                        required
                      />
                    </>
                  ) : (
                    <>
                      <Input
                        name="companyName"
                        placeholder="Company Name"
                        value={formData.companyName}
                        onChange={handleChange}
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
                        onChange={handleChange}
                        required
                      />
                      <Input
                        type="tel"
                        name="phone"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        name="companySize"
                        placeholder="Company Size"
                        value={formData.companySize}
                        onChange={handleChange}
                      />
                      <Input
                        name="website"
                        placeholder="Website"
                        value={formData.website}
                        onChange={handleChange}
                      />
                      <textarea
                        name="description"
                        placeholder="Company Description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full p-3 border rounded"
                      ></textarea>
                      <Input
                        name="address"
                        placeholder="Address"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </>
                  )
                ) : (
                  <>
                    <Input
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      name="middleName"
                      placeholder="Middle Name"
                      value={formData.middleName}
                      onChange={handleChange}
                    />
                    <Input
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      type="tel"
                      name="phone"
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      name="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      name="linkedinUrl"
                      placeholder="LinkedIn URL"
                      value={formData.linkedinUrl}
                      onChange={handleChange}
                    />
                    <Input
                      name="portfolioUrl"
                      placeholder="Portfolio URL"
                      value={formData.portfolioUrl}
                      onChange={handleChange}
                    />
                    <Input
                      name="yearOfExperience"
                      type="number"
                      placeholder="Years of Experience"
                      value={formData.yearOfExperience}
                      onChange={handleChange}
                    />
                    <Input
                      name="salaryExpectations"
                      type="number"
                      placeholder="Salary Expectations"
                      value={formData.salaryExpectations}
                      onChange={handleChange}
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
