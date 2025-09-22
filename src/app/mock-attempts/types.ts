export interface ExamAttemptResponse {
  id: string;
  userId: string;
  courseName: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeTaken: number;
  passed: boolean;
  attemptedAt: string;
  aiAnalysis?: string;
}

export interface TopicPerformance {
  topicName: string;
  accuracy: number;
  totalQuestions: number;
  correctAnswers: number;
}

export interface UserAnalytics {
  totalAttempts: number;
  averageScore: number;
  overallAccuracy: number;
  weakTopics: string[];
  strongTopics: string[];
  topicWisePerformance: Record<string, TopicPerformance>;
  aiInsights?: string;
}

export interface TrendPoint {
  x: string;
  y: number;
}

export interface TopicTrend {
  date: string;
  accuracy: number;
  topicName: string;
}

export interface PerformanceTrends {
  scoreOverTime: TrendPoint[];
  accuracyOverTime?: TrendPoint[];
  topicTrends?: Record<string, TopicTrend[]>;
  trendDirection?: string;
  scoreVelocity?: number;
  trendAnalysis?: string;
}
