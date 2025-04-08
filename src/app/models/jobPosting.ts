export interface CompanyLogo {
  filename: string;
  path: string;
  originalname: string;
  mimetype: string;
  size: number;
  bucketName: string;
}

export interface SalaryRange {
  minimum?: number;
  maximum?: number;
}

export interface JobPosting {
  id?: string,
  title: string;
  description: string;
  position: string;
  industry: string;
  type: string;
  city: string;
  location: string;
  employmentType: string;
  salaryRange?: SalaryRange;
  deadline: string; // ISO 8601 format date
  requirementId: string;
  skill: string[];
  benefits: string[];
  responsibilities: string[];
  status: string;
  gender: string;
  minimumGPA: number;
  companyName: string;
  companyLogo?: CompanyLogo;
  postedDate: string; // ISO 8601 format date
  applicationURL: string;
  experienceLevel: string;
  fieldOfStudy: string;
  educationLevel: string;
  howToApply: string;
  onHoldDate?: string; // Optional date field
  applicationCount?: number;
  createdAt?: string;
  updatedAt?: string;
  remotePolicy: string;
  isSaved?: boolean; // Whether the job is saved by the current user
}
