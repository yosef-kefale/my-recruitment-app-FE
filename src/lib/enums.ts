export const GENDERS = ["Male", "Female", "Non-binary", "Prefer not to say"];

export const INDUSTRIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Retail",
  "Manufacturing",
  "Other",
];

export const COMPANY_SIZES = [
  "1-10 Employees",
  "11-50 Employees",
  "51-200 Employees",
  "201-500 Employees",
  "501+ Employees",
];

export const EDUCATION_LEVELS = [
  "High School",
  "Diploma",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD",
];

export const JOB_LOCATIONS = [
  "Remote",
  "On-site",
  "Hybrid",
];

export const STATUSES = ["Active", "Inactive"];

export enum JobPostingStatusEnums {
  DRAFT = 'Draft',
  PENDING = 'Pending',
  POSTED = 'Posted',
  EXPIRED = 'Expired',
  ON_HOLD = 'On Hold',
  WITHDRAWN = 'Withdrawn',
  CLOSED = 'Closed',
}

export enum ApplicationStatusEnums {
  PENDING = 'Pending',
  SELECTED = 'Selected',
  REJECTED = 'Rejected',
  HIRED = 'Hired',
}
