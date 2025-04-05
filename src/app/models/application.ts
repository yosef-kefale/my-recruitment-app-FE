export interface Application {
  id: string;
  jobPostId: string;
  userId: string;
  coverLetter: string;
  status: string;
  applicationInformation: {
    appliedAt: string;
    cv: string;
    screeningAnswers?: {
      questionId: string;
      answer: string;
    }[];
  };
  evaluationNotes?: string;
  screeningScore?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ScreeningAnswer {
  questionId: string;
  answer: string;
  score?: number;
} 