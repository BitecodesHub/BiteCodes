// app/mock-tests/[examSlug]/types.ts
export interface ExamQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
  courseId: string;
}

export interface Answer {
  questionId: string;
  selectedOption: number;
}

export interface ExamAttemptResponse {
  id: number;
  userId: number;
  courseId: string;
  score: number;
  passed: boolean;
  attemptedAt: string;
}
