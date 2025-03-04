"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    categoryId: "",
    userName: "",
    middleName: "",
    lastName: "",
    firstName: "",
    phone: "",
    password: "",
    confirmPassword: "",
    email: "",
    accountUserType: "Employee",
    clusterId: "",
    gender: "",
    organizationTin: "",
    organizationName: "",
    subCityId: "",
    woredaId: "",
    cityId: "",
    serviceDepartmentId: "",
    serviceCategoryId: "",
    organizationTypeId: "",
    institutionTypeId: "",
    employmentPositionId: "",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match!",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "http://196.188.249.24:3010/api/users",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            status: "Active",
            createdAt: new Date().toISOString(),
          }),
        }
      );

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
      <nav className="flex justify-between items-center p-6 shadow-md bg-white">
        <h1
          onClick={() => router.push("/")}
          className="text-2xl font-bold cursor-pointer text-sky-600"
        >
          TALENT-HUB
        </h1>
        <div className="space-x-6"></div>
      </nav>
      <div className="flex pt-2 items-center justify-center bg-gray-100">
        <div className="flex flex-col md:flex-row w-full max-w-6xl p-4 bg-white rounded-lg shadow-lg">
          {/* Left side: Form */}
          <div className="flex">
            <Card className="w-full md:min-w-[600px]">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">
                  Sign Up
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-1">
                    <Input
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="p-3"
                    />
                    <Input
                      name="middleName"
                      placeholder="Middle Name"
                      value={formData.middleName}
                      onChange={handleChange}
                      className="p-3"
                    />
                  </div>

                  <Input
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="p-3"
                  />
                  <Input
                    name="userName"
                    placeholder="Username"
                    value={formData.userName}
                    onChange={handleChange}
                    required
                    className="p-3"
                  />

                  <div className="flex flex-col md:flex-row gap-1">
                    <Input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="p-3"
                    />
                    <Input
                      type="tel"
                      name="phone"
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="p-3"
                    />
                  </div>

                  <div className="flex flex-col md:flex-row gap-1">
                    <Input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="p-3"
                    />
                    <Input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="p-3"
                    />
                  </div>

                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border rounded"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>

                  <div className="flex flex-col md:flex-row gap-1">
                    <Input
                      name="organizationName"
                      placeholder="Organization Name"
                      value={formData.organizationName}
                      onChange={handleChange}
                      className="p-3"
                    />
                    <Input
                      name="organizationTin"
                      placeholder="Organization TIN"
                      value={formData.organizationTin}
                      onChange={handleChange}
                      className="p-3"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full p-3 bg-blue-600 text-white"
                    disabled={loading}
                  >
                    {loading ? "Signing up..." : "Sign Up"}
                  </Button>

                  {/* Go back to login link */}
                  <div className="text-center mt-4">
                    <Button
                      variant="link"
                      onClick={() => router.push("/login")}
                      className="text-blue-600"
                    >
                      Already have an account? Go back to login
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right side: Image and Description */}
          <div className="hidden md:flex flex-1 justify-center items-center p-6">
            <div className="text-center">
              <Image
                src="/signup-anim.jpg"
                width={300}
                height={400}
                alt="Sign up illustration"
                className="w-full h-auto mb-6 rounded-lg shadow-lg"
              />
              <p className="text-lg text-gray-600">
                Create an account to get started with our platform and access
                all features!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
