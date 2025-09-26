
export interface ExamQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
  courseId: string;
  explanation?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface Answer {
  questionId: string;
  selectedOption: number;
  isMarked?: boolean;
}

export interface ExamAttemptRequest {
  userId: number;
  courseName: string;
  answers: { [key: string]: string };
  timeTaken: number;
  questionIds: string[]; // Added to send all question IDs
}

export interface ExamAttemptResponse {
  id: number;
  userId: number;
  courseName: string;
  score: number;
  passed: boolean;
  attemptedAt: string;
  timeTaken: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skipped: number;
  detailedResults: {
    questionId: string;
    correct: boolean;
    userAnswer: number;
    correctAnswer: number;
    explanation?: string;
  }[];
  totalQuestions: number;
}

export interface ExamSection {
  sectionName: string;
  questions: ExamQuestion[];
}
