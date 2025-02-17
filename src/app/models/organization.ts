export interface Organization {
    id: string;
    createdBy: string | null;
    updatedBy: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    deletedBy: string | null;
    tinNumber: string;
    companyName: string;
    industry: string;
    companySize: string;
    headquarters: string;
    website: string;
    description: string;
    companyLogo: string | null;
    verified: boolean;
  }
  