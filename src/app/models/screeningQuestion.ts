export interface ScreeningQuestion {
  id?: string;
  jobPostId: string;
  question: string;
  type: 'text' | 'multiple-choice' | 'yes-no';
  options?: string[];
  correctAnswer?: string;
  required: boolean;
  weight: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface JobStatistics {
  totalApplications: number;
  applicationsByStatus: {
    pending: number;
    reviewed: number;
    shortlisted: number;
    rejected: number;
    hired: number;
  };
  applicationsByDay: {
    date: string;
    count: number;
  }[];
  topSkills: {
    skill: string;
    count: number;
  }[];
  averageScreeningScore?: number;
} 