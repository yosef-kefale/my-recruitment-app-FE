export interface JobPosting {
    id?: string; // Optional, assuming it's generated later
    title: string;
    description: string;
    position: string;
    workLocation: string;
    employmentType: string;
    salary: string;
    experienceLevel: string;
    fieldOfStudy: string;
    educationLevel: string;
    gpa: string;
    skill: string;
    status: string;
    createdAt?: string; // Optional timestamp
    updatedAt?: string; // Optional timestamp
  }
  