export const API_URL = "http://138.197.105.31:3010/api";

export const loginUser = async (username: string, password: string) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    throw new Error("Invalid username or password");
  }

  return res.json(); // { token: "..." }
};

export const saveToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export interface EtradeRegistrationData {
  tin: string;
  licenseNumber: string;
}

export interface OrganizationAccountData {
  companyName: string;
  industry: string[];
  email: string;
  phone: string;
  companySize?: string;
  website?: string;
  description?: string;
  companyLogo: string | null;
  address?: string;
}

export interface UserRegistrationData {
  phone?: string;
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  gender?: string;
  status: string;
  password: string;
  birthDate?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  yearOfExperience?: string;
  industry: string[];
  telegramUserId?: string;
  preferredJobLocation: string[];
  highestLevelOfEducation: string;
  salaryExpectations?: string;
  aiGeneratedJobFitScore: number;
  skills: string[];
  profile: string | null;
  resume: string | null;
}

export const registerOrganizationWithEtrade = async (data: EtradeRegistrationData) => {
  const res = await fetch(`${API_URL}/Organizations/register-organization-with-etrade`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Organization registration failed");
  }

  return res.json();
};

export const createOrganizationAccount = async (data: OrganizationAccountData) => {
  const res = await fetch(`${API_URL}/Organizations/create-account`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Organization account creation failed");
  }

  return res.json();
};

export const createUser = async (data: UserRegistrationData) => {
  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "User registration failed");
  }

  return res.json();
};
