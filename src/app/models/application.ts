export interface Application {
  id?: string;
  userId?: string;
  jobId?: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
  coverLetter: string;
  resumeUrl?: string;
  screeningScore?: number;
  applicationInformation: {
    appliedAt: string;
    lastUpdated?: string;
    notes?: string;
  };
  candidateInformation?: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    currentCompany?: string;
    currentPosition?: string;
    experience?: number;
    education?: string;
    skills?: string[];
  };
  interviewInformation?: {
    scheduled?: boolean;
    date?: string;
    time?: string;
    type?: 'phone' | 'video' | 'in-person';
    notes?: string;
    feedback?: string;
  };
}

export interface ScreeningAnswer {
  questionId: string;
  answer: string;
  score?: number;
} 