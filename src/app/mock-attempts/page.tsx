"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  BookOpen,
  Clock,
  CheckCircle,
  XCircle,
  BarChart,
  Loader2,
  TrendingUp,
  Brain,
  Target,
  Users,
  Calendar,
  ArrowUp,
  ArrowDown,
  Minus,
  Eye,
  Flag,
  Trophy,
  Activity,
  Star,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Shield,
  Lightbulb,
} from "lucide-react";
import { Line, Bar, Pie, Radar, PieLabelRenderProps } from "recharts";
import {
  LineChart,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { useAuth } from "../contexts/AuthContext";

// Types from your backend
interface QuestionResult {
  questionId: string;
  correct: boolean;
  userAnswer: number;
  correctAnswer: number;
  explanation: string;
  topic: string;
  difficulty: string;
  timeSpent: number;
  flagged: boolean;
}

interface TopicPerformance {
  topicName: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number;
  difficultyLevel: string;
}

interface ExamAttempt {
  id: string;
  userId: string;
  courseName: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeTaken: number;
  passed: boolean;
  attemptedAt: string;
  incorrectAnswers: number;
  skipped: number;
  topicPerformance: Record<string, TopicPerformance>;
  aiAnalysis?: string;
  improvementSuggestions?: string;
  weakTopics: string[];
  strongTopics: string[];
  percentile: number;
  cutoffScore: number;
  detailedResults: QuestionResult[];
  difficulty: string;
}

interface UserAnalytics {
  totalAttempts: number;
  averageScore: number;
  totalCorrectAnswers: number;
  totalQuestions: number;
  overallAccuracy: number;
  topicWisePerformance: Record<string, TopicPerformance>;
  strongTopics: string[];
  weakTopics: string[];
  courseWiseScores: Record<string, number>;
  progressData?: any;
  aiInsights?: string;
}

interface TrendPoint {
  date?: string;
  x?: string;
  value?: number;
  y?: number;
  label?: string;
}

interface PerformanceTrends {
  scoreOverTime: TrendPoint[];
  accuracyOverTime?: TrendPoint[];
  timeEfficiencyOverTime?: TrendPoint[];
  topicTrends?: Record<string, TrendPoint[]>;
  trendAnalysis?: string;
  overallTrend?: number;
  trendDirection?: string;
  trendConfidence?: number;
  dataPoints?: number;
  scoreVelocity?: number;
  accuracyVelocity?: number;
  consistencyScore?: number;
  improvingStreak?: number;
  decliningStreak?: number;
  bestStreak?: number;
  currentStreak?: number;
}

interface LeaderboardEntry {
  userId: string;
  username: string;
  bestScore: number;
  totalAttempts: number;
  lastAttempt: string;
  rank: number;
}

interface DetailedAttemptAnalysis {
  attempt: ExamAttempt;
  questionAnalyses: any[];
  topicBreakdown: Record<string, TopicPerformance>;
  timeDistribution: any;
  comparisonData: any;
  aiAnalysis: string;
  keyInsights: string[];
}

interface CourseHistory {
  courseName: string;
  attempts: ExamAttempt[];
  scoreProgression: any;
  topicAnalysis: any;
  timeAnalysis: any;
  improvementSuggestions: string;
}

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: number;
  color?: "blue" | "green" | "purple" | "red" | "yellow";
}

interface CourseDataPoint {
  name: string;
  score: number;
  color: string;
  [key: string]: any;
}

// API Service
class APIService {
  private baseURL: string;
  private authToken: string | null = null;

  constructor() {
    this.baseURL = typeof window !== 'undefined' 
      ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      : "http://localhost:8080";
    
    if (typeof window !== 'undefined') {
      this.authToken = localStorage.getItem("token");
    }
  }

  private getHeaders() {
    return {
      "Content-Type": "application/json",
      ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
    };
  }

  private async request<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${url}`, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getUserAttempts(userId: string): Promise<ExamAttempt[]> {
    return this.request<ExamAttempt[]>(`/api/attempts/user/${userId}`);
  }

  async getUserAnalytics(userId: string): Promise<UserAnalytics> {
    const data = await this.request<UserAnalytics>(`/api/attempts/user/${userId}/analytics`);
    if (data.courseWiseScores && typeof data.courseWiseScores === 'object') {
      data.courseWiseScores = Object.fromEntries(
        Object.entries(data.courseWiseScores).filter(([_, value]) => typeof value === 'number')
      ) as Record<string, number>;
    } else {
      data.courseWiseScores = {};
    }
    return data;
  }

  async getPerformanceTrends(userId: string, days: number = 30): Promise<PerformanceTrends> {
    return this.request<PerformanceTrends>(`/api/attempts/user/${userId}/performance-trends?days=${days}`);
  }

  async getCourseHistory(userId: string, courseName: string): Promise<CourseHistory> {
    return this.request<CourseHistory>(`/api/attempts/user/${userId}/course/${encodeURIComponent(courseName)}/history`);
  }

  async getDetailedAnalysis(attemptId: string): Promise<DetailedAttemptAnalysis> {
    return this.request<DetailedAttemptAnalysis>(`/api/attempts/${attemptId}/detailed`);
  }

  async getCourseLeaderboard(courseName: string, limit: number = 10): Promise<LeaderboardEntry[]> {
    return this.request<LeaderboardEntry[]>(`/api/attempts/course/${encodeURIComponent(courseName)}/leaderboard?limit=${limit}`);
  }
}

// Utility functions
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getScoreColor = (score: number) => {
  if (score >= 90) return "text-green-700 bg-green-100";
  if (score >= 80) return "text-blue-700 bg-blue-100";
  if (score >= 70) return "text-yellow-700 bg-yellow-100";
  return "text-red-700 bg-red-100";
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty?.toLowerCase()) {
    case 'easy': return "text-green-700 bg-green-100";
    case 'medium': return "text-yellow-700 bg-yellow-100";
    case 'hard': return "text-red-700 bg-red-100";
    default: return "text-gray-700 bg-gray-100";
  }
};

// Color schemes
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

// Components
function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4 sm:p-6">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 animate-spin text-blue-600" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 animate-pulse" />
          </div>
        </div>
        <p className="text-xl sm:text-2xl font-bold text-gray-900">Loading Analytics...</p>
        <p className="text-gray-600 text-sm sm:text-base">Preparing your comprehensive performance report</p>
      </div>
    </div>
  );
}

function ErrorMessage({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-md sm:max-w-lg border border-red-100">
        <div className="flex items-center mb-4">
          <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 mr-3" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Error Loading Data</h2>
        </div>
        <p className="text-gray-700 text-sm sm:text-base mb-6">{error}</p>
        <button
          onClick={onRetry}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center space-x-2"
        >
          <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Retry</span>
        </button>
      </div>
    </div>
  );
}

function StatsCard({ title, value, subtitle, icon: Icon, trend, color = "blue" }: StatsCardProps) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600 bg-blue-50 text-blue-700",
    green: "from-green-500 to-green-600 bg-green-50 text-green-700",
    purple: "from-purple-500 to-purple-600 bg-purple-50 text-purple-700",
    red: "from-red-500 to-red-600 bg-red-50 text-red-700",
    yellow: "from-yellow-500 to-yellow-600 bg-yellow-50 text-yellow-700"
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-slate-200/50 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r ${colorClasses[color]}`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center space-x-1 ${trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600'}`}>
            {trend > 0 ? <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4" /> : trend < 0 ? <ArrowDown className="w-3 h-3 sm:w-4 sm:h-4" /> : <Minus className="w-3 h-3 sm:w-4 sm:h-4" />}
            <span className="text-xs sm:text-sm font-medium">{Math.abs(trend).toFixed(1)}%</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{value}</p>
        <p className="text-sm sm:text-base text-gray-700">{title}</p>
        {subtitle && <p className="text-xs sm:text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

function AttemptCard({ attempt, onViewDetails }: { attempt: ExamAttempt; onViewDetails: (id: string) => void }) {
  return (
    <div className="group bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-4 sm:p-6 border border-slate-200/50 hover:border-blue-300/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
            {attempt.courseName}
          </h3>
          <div className="flex items-center space-x-2">
            <span className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold ${getDifficultyColor(attempt.difficulty)} border shadow-sm`}>
              {attempt.difficulty}
            </span>
            <span className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold ${
              attempt.passed ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"
            } border shadow-sm`}>
              {attempt.passed ? "PASSED" : "FAILED"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div className="space-y-2 sm:space-y-3 text-sm">
            <div className="flex items-center text-gray-700">
              <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
              <span className="font-medium">Score: {attempt.score.toFixed(1)}%</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Target className="w-4 h-4 mr-2 text-blue-500" />
              <span className="font-medium">
                {attempt.correctAnswers}/{attempt.totalQuestions} Correct
              </span>
            </div>
            <div className="flex items-center text-gray-700">
              <Clock className="w-4 h-4 mr-2 text-purple-500" />
              <span className="font-medium">Time: {formatTime(attempt.timeTaken)}</span>
            </div>
          </div>
          
          <div className="space-y-2 sm:space-y-3 text-sm">
            <div className="flex items-center text-gray-700">
              <Users className="w-4 h-4 mr-2 text-green-500" />
              <span className="font-medium">Percentile: {attempt.percentile}%</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Calendar className="w-4 h-4 mr-2 text-orange-500" />
              <span className="font-medium">{formatDate(attempt.attemptedAt)}</span>
            </div>
            {attempt.skipped > 0 && (
              <div className="flex items-center text-gray-700">
                <Flag className="w-4 h-4 mr-2 text-red-500" />
                <span className="font-medium">Skipped: {attempt.skipped}</span>
              </div>
            )}
          </div>
        </div>

        {attempt.strongTopics.length > 0 && (
          <div className="mb-3 sm:mb-4">
            <p className="text-xs font-medium text-green-700 mb-2">Strong Topics:</p>
            <div className="flex flex-wrap gap-1">
              {attempt.strongTopics.slice(0, 3).map((topic, i) => (
                <span key={i} className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {attempt.weakTopics.length > 0 && (
          <div className="mb-3 sm:mb-4">
            <p className="text-xs font-medium text-red-700 mb-2">Needs Improvement:</p>
            <div className="flex flex-wrap gap-1">
              {attempt.weakTopics.slice(0, 3).map((topic, i) => (
                <span key={i} className="px-2 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="pt-3 sm:pt-4 border-t border-slate-100/50 flex items-center justify-between">
          <button
            onClick={() => onViewDetails(attempt.id)}
            className="text-sm font-semibold text-blue-600 flex items-center hover:text-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
          >
            <Eye className="w-4 h-4 mr-1" />
            View Analysis
          </button>
          
          {attempt.aiAnalysis && (
            <div className="flex items-center text-xs text-purple-600">
              <Brain className="w-3 h-3 mr-1" />
              <span>AI Analysis</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailedAnalysisModal({ analysis, onClose }: { analysis: DetailedAttemptAnalysis | null; onClose: () => void }) {
  if (!analysis) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl sm:max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Detailed Analysis</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
        
        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
          {analysis.aiAnalysis && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 sm:p-6">
              <div className="flex items-center mb-3 sm:mb-4">
                <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mr-2" />
                <h3 className="text-base sm:text-lg font-bold text-gray-900">AI Analysis</h3>
              </div>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{analysis.aiAnalysis}</p>
            </div>
          )}

          {analysis.keyInsights && analysis.keyInsights.length > 0 && (
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 mr-2" />
                Key Insights
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {analysis.keyInsights.map((insight, index) => (
                  <div key={index} className="bg-yellow-50 border-l-4 border-yellow-400 p-3 sm:p-4 rounded">
                    <p className="text-gray-700 text-sm sm:text-base">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {analysis.topicBreakdown && Object.keys(analysis.topicBreakdown).length > 0 && (
            <div>
              <h3 className="text-base sm:text-lg font-bold text-black mb-3 sm:mb-4">Topic Performance Breakdown</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {Object.entries(analysis.topicBreakdown).map(([topic, performance]) => (
                  <div key={topic} className="bg-gray-50 rounded-xl p-3 sm:p-4">
                    <h4 className="font-semibold text-black mb-2 text-sm sm:text-base">{performance.topicName}</h4>
                    <div className="space-y-2 text-xs sm:text-sm text-black">
                      <div className="flex justify-between">
                        <span>Accuracy:</span>
                        <span
                          className={`font-semibold ${
                            performance.accuracy >= 80
                              ? 'text-green-700'
                              : performance.accuracy >= 60
                              ? 'text-yellow-700'
                              : 'text-red-700'
                          }`}
                        >
                          {performance.accuracy.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Questions:</span>
                        <span>{performance.totalQuestions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Correct:</span>
                        <span className="text-green-700">{performance.correctAnswers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Incorrect:</span>
                        <span className="text-red-700">{performance.incorrectAnswers}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

{analysis.questionAnalyses && analysis.questionAnalyses.length > 0 && (
  <div>
    <h3 className="text-base sm:text-lg font-bold text-black mb-3 sm:mb-4">
      Question-by-Question Analysis
    </h3>
    <div className="space-y-3 sm:space-y-4 max-h-80 sm:max-h-96 overflow-y-auto">
      {analysis.questionAnalyses.map((qa: any, index) => (
        <div
          key={index}
          className={`border rounded-lg p-3 sm:p-4 ${
            qa.userCorrect
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-sm sm:text-base text-black">
              Question {index + 1}
            </span>
            <div className="flex items-center space-x-2">
              {qa.userCorrect ? (
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-700" />
              ) : (
                <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-700" />
              )}
              <span
                className={`px-2 py-1 rounded text-xs ${getDifficultyColor(
                  qa.difficulty
                )}`}
              >
                {qa.difficulty}
              </span>
              <span className="px-2 py-1 bg-gray-100 text-black rounded text-xs">
                {qa.topic}
              </span>
            </div>
          </div>
          {qa.explanation && (
            <p className="text-sm text-black mt-2">{qa.explanation}</p>
          )}
          {qa.improvementTip && (
            <div className="mt-2 p-2 bg-blue-50 border-l-4 border-blue-400 rounded">
              <p className="text-sm text-blue-700">💡 {qa.improvementTip}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
)}

        </div>
      </div>
    </div>
  );
}

function PerformanceTrendsSection({ trends, userId }: { trends: PerformanceTrends; userId: string }) {
  const [selectedCourse, setSelectedCourse] = useState<string>("all");

  // Extract unique courses from scoreOverTime
  const availableCourses = useMemo(() => {
    const courses = new Set<string>();
    trends.scoreOverTime.forEach((point) => {
      if (point.label) {
        courses.add(point.label);
      }
    });
    return ["all", ...Array.from(courses).sort()];
  }, [trends.scoreOverTime]);

  // Filter chart data based on selected course
  const chartData = useMemo(() => {
    if (!trends.scoreOverTime || trends.scoreOverTime.length === 0) {
      return [];
    }
    return trends.scoreOverTime
      .filter((point) => selectedCourse === "all" || point.label === selectedCourse)
      .map((point, index) => {
        const dateStr = point.date || point.x;
        const matchingAccuracy = trends.accuracyOverTime?.find(
          (a) => (a.date || a.x) === dateStr && a.label === point.label
        );
        const matchingEfficiency = trends.timeEfficiencyOverTime?.find(
          (e) => (e.date || e.x) === dateStr && e.label === point.label
        );
        return {
          date: dateStr ? new Date(dateStr).toLocaleDateString() : `Point ${index + 1}`,
          score: point.value ?? point.y ?? 0,
          accuracy: matchingAccuracy ? matchingAccuracy.value ?? matchingAccuracy.y ?? 0 : 0,
          efficiency: matchingEfficiency ? matchingEfficiency.value ?? matchingEfficiency.y ?? 0:0,
        };
      });
  }, [trends, selectedCourse]);

  // Filter topic trends based on selected course
  const filteredTopicTrends = useMemo(() => {
    if (!trends.topicTrends) return {};
    if (selectedCourse === "all") return trends.topicTrends;
    
    const filtered: Record<string, TrendPoint[]> = {};
    Object.entries(trends.topicTrends).forEach(([topic, topicData]) => {
      const filteredData = topicData.filter((point) => point.label === selectedCourse);
      if (filteredData.length > 0) {
        filtered[topic] = filteredData;
      }
    });
    return filtered;
  }, [trends.topicTrends, selectedCourse]);

  const streakData = useMemo(() => [
    { name: 'Current Streak', value: Math.abs(trends.currentStreak ?? 0), color: (trends.currentStreak ?? 0) > 0 ? '#10B981' : '#EF4444' },
    { name: 'Best Streak', value: trends.bestStreak ?? 0, color: '#3B82F6' },
    { name: 'Improving', value: trends.improvingStreak ?? 0, color: '#10B981' },
    { name: 'Declining', value: trends.decliningStreak ?? 0, color: '#EF4444' },
  ], [trends]);

  return (
    <div className="bg-white/95 rounded-2xl shadow-lg p-4 sm:p-8 mb-8 sm:mb-12 border border-slate-200/50">
      <div className="flex flex-wrap items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
          <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-purple-500" />
          Performance Trends
        </h2>
        <div className="flex items-center space-x-3 sm:space-x-4">
          {trends.trendDirection && (
            <div className={`flex items-center space-x-2 px-2 sm:px-3 py-1 rounded-full ${
              trends.trendDirection === 'improving' ? 'bg-green-100 text-green-700' :
              trends.trendDirection === 'declining' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {trends.trendDirection === 'improving' ? <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4" /> :
               trends.trendDirection === 'declining' ? <ArrowDown className="w-3 h-3 sm:w-4 sm:h-4" /> :
               <Minus className="w-3 h-3 sm:w-4 sm:h-4" />}
              <span className="text-xs sm:text-sm font-medium capitalize">{trends.trendDirection}</span>
            </div>
          )}
          {trends.trendConfidence && (
            <div className="text-xs sm:text-sm text-gray-600">
              Confidence: {trends.trendConfidence.toFixed(1)}%
            </div>
          )}
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {availableCourses.map((course) => (
              <option key={course} value={course}>
                {course === "all" ? "All Courses" : course}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        <StatsCard
          title="Score Velocity"
          value={trends.scoreVelocity !== undefined ? `${trends.scoreVelocity > 0 ? '+' : ''}${trends.scoreVelocity.toFixed(2)}` : '0'}
          subtitle="Points per attempt"
          icon={TrendingUp}
          trend={trends.scoreVelocity}
          color="blue"
        />
        <StatsCard
          title="Accuracy Trend"
          value={trends.accuracyVelocity !== undefined ? `${trends.accuracyVelocity > 0 ? '+' : ''}${trends.accuracyVelocity.toFixed(2)}%` : '0%'}
          subtitle="Per attempt change"
          icon={Target}
          trend={trends.accuracyVelocity}
          color="green"
        />
        <StatsCard
          title="Consistency"
          value={trends.consistencyScore !== undefined ? `${trends.consistencyScore.toFixed(1)}%` : '0%'}
          subtitle="Performance stability"
          icon={Shield}
          color="purple"
        />
        <StatsCard
          title="Data Points"
          value={trends.dataPoints ?? 0}
          subtitle="Attempts analyzed"
          icon={BarChart}
          color="yellow"
        />
      </div>

      {chartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Score & Accuracy Progression</h3>
            <ResponsiveContainer width="100%" height={200} className="sm:min-h-[250px] sm:max-h-[300px]">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                <Legend />
                <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={2} name="Score %" />
                <Line type="monotone" dataKey="accuracy" stroke="#10B981" strokeWidth={2} name="Accuracy %" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Performance Streaks</h3>
            <ResponsiveContainer width="100%" height={200} className="sm:min-h-[250px] sm:max-h-[300px]">
              <RechartsBarChart data={streakData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: number) => `${value}`} />
                <Bar dataKey="value">
                  {streakData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {Object.keys(filteredTopicTrends).length > 0 && (
        <div className="mb-6 sm:mb-8">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Topic-wise Performance Trends</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
            {Object.entries(filteredTopicTrends).slice(0, 4).map(([topic, topicData]) => {
              const chartData = topicData.map((point, index) => ({
                date: point.date || point.x ? new Date(point.date || point.x!).toLocaleDateString() : `Point ${index + 1}`,
                accuracy: point.value ?? point.y ?? 0,
              }));
              
              return (
                <div key={topic} className="bg-gray-50 rounded-xl p-3 sm:p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{topic}</h4>
                  <ResponsiveContainer width="100%" height={120} className="sm:min-h-[150px]">
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                      <Area type="monotone" dataKey="accuracy" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {trends.trendAnalysis && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 sm:p-6">
          <div className="flex items-center mb-3 sm:mb-4">
            <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-2" />
            <h3 className="text-base sm:text-lg font-bold text-gray-900">Trend Analysis</h3>
          </div>
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">{trends.trendAnalysis}</p>
        </div>
      )}
    </div>
  );
}

function UserAnalyticsSection({ analytics }: { analytics: UserAnalytics }) {
  const topicData = useMemo(() => {
    if (!analytics.topicWisePerformance) return [];
    return Object.values(analytics.topicWisePerformance).map((topic, index) => ({
      name: topic.topicName,
      accuracy: topic.accuracy,
      questions: topic.totalQuestions,
      correct: topic.correctAnswers,
      color: COLORS[index % COLORS.length],
    }));
  }, [analytics.topicWisePerformance]);

  const courseData = useMemo<CourseDataPoint[]>(() => {
    if (!analytics.courseWiseScores) return [];
    return Object.entries(analytics.courseWiseScores).map(([course, score], index) => ({
      name: course,
      score: typeof score === 'number' ? score : 0,
      color: COLORS[index % COLORS.length],
    }));
  }, [analytics.courseWiseScores]);

  return (
    <div className="bg-white/95 rounded-2xl shadow-lg p-4 sm:p-8 mb-8 sm:mb-12 border border-slate-200/50">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
        <BarChart className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-500" />
        Analytics Overview
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        <StatsCard
          title="Total Attempts"
          value={analytics.totalAttempts}
          subtitle="Mock tests completed"
          icon={BookOpen}
          color="blue"
        />
        <StatsCard
          title="Average Score"
          value={`${analytics.averageScore.toFixed(1)}%`}
          subtitle="Overall performance"
          icon={Trophy}
          color="green"
        />
        <StatsCard
          title="Overall Accuracy"
          value={`${analytics.overallAccuracy.toFixed(1)}%`}
          subtitle={`${analytics.totalCorrectAnswers}/${analytics.totalQuestions} correct`}
          icon={Target}
          color="purple"
        />
        <StatsCard
          title="Strong Topics"
          value={analytics.strongTopics.length}
          subtitle="Areas of excellence"
          icon={Star}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Topic Performance</h3>
          {topicData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200} className="sm:min-h-[250px] sm:max-h-[300px]">
              <RechartsBarChart data={topicData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, 'Accuracy']} />
                <Bar dataKey="accuracy" fill="#3B82F6" />
              </RechartsBarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-600 text-sm sm:text-base text-center py-8 sm:py-12">No topic data available</p>
          )}
        </div>

        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Course-wise Scores</h3>
          {courseData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200} className="sm:min-h-[250px] sm:max-h-[300px]">
              <PieChart>
                <Pie
                  data={courseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: PieLabelRenderProps) => `${props.name}: ${(props.value ?? 0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="score"
                >
                  {courseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-600 text-sm sm:text-base text-center py-8 sm:py-12">No course data available</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2" />
            Strong Areas
          </h3>
          <div className="space-y-2">
            {analytics.strongTopics.length > 0 ? (
              analytics.strongTopics.map((topic, index) => (
                <div key={index} className="flex items-center justify-between bg-green-50 rounded-lg p-2 sm:p-3">
                  <span className="font-medium text-green-800 text-sm sm:text-base">{topic}</span>
                  <Star className="w-4 h-4 text-green-600" />
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-sm sm:text-base">Complete more attempts to identify strengths</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mr-2" />
            Areas for Improvement
          </h3>
          <div className="space-y-2">
            {analytics.weakTopics.length > 0 ? (
              analytics.weakTopics.map((topic, index) => (
                <div key={index} className="flex items-center justify-between bg-red-50 rounded-lg p-2 sm:p-3">
                  <span className="font-medium text-red-800 text-sm sm:text-base">{topic}</span>
                  <Target className="w-4 h-4 text-red-600" />
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-sm sm:text-base">No weak areas identified - great job!</p>
            )}
          </div>
        </div>
      </div>

      {analytics.aiInsights && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 sm:p-6">
          <div className="flex items-center mb-3 sm:mb-4">
            <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mr-2" />
            <h3 className="text-base sm:text-lg font-bold text-gray-900">AI Insights</h3>
          </div>
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">{analytics.aiInsights}</p>
        </div>
      )}
    </div>
  );
}

function LeaderboardSection({ leaderboard, currentUserId }: { leaderboard: LeaderboardEntry[]; currentUserId: string }) {
  return (
    <div className="bg-white/95 rounded-2xl shadow-lg p-4 sm:p-8 mb-8 sm:mb-12 border border-slate-200/50">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
        <Trophy className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-yellow-500" />
        Course Leaderboard
      </h2>

      <div className="space-y-2 sm:space-y-3">
        {leaderboard.map((entry, index) => {
          const isCurrentUser = entry.userId === currentUserId;
          return (
            <div
              key={entry.userId}
              className={`flex items-center justify-between p-3 sm:p-4 rounded-xl transition-all ${
                isCurrentUser 
                  ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200' 
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full font-bold text-xs sm:text-sm ${
                  entry.rank === 1 ? 'bg-yellow-500 text-white' :
                  entry.rank === 2 ? 'bg-gray-400 text-white' :
                  entry.rank === 3 ? 'bg-orange-500 text-white' :
                  'bg-gray-200 text-gray-700'
                }`}>
                  {entry.rank}
                </div>
                <div>
                  <p className={`font-semibold text-sm sm:text-base ${isCurrentUser ? 'text-blue-800' : 'text-gray-900'}`}>
                    {isCurrentUser ? 'You' : entry.username || `User ${entry.userId}`}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {entry.totalAttempts} attempts • Last: {formatDate(entry.lastAttempt)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-base sm:text-lg font-bold text-gray-900">{entry.bestScore.toFixed(1)}%</p>
                <p className="text-xs sm:text-sm text-gray-600">Best Score</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function EnhancedMockAttemptsPage() {
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [trends, setTrends] = useState<PerformanceTrends | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [detailedAnalysis, setDetailedAnalysis] = useState<DetailedAttemptAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const apiService = useMemo(() => new APIService(), []);

  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const fetchAllData = useCallback(
    async (userId: string) => {
      try {
        setLoading(true);
        setError(null);

        const [attemptsData, analyticsData, trendsData] = await Promise.all([
          apiService.getUserAttempts(userId),
          apiService.getUserAnalytics(userId),
          apiService.getPerformanceTrends(userId, 30),
        ]);

        setAttempts(attemptsData);
        setAnalytics(analyticsData);
        setTrends(trendsData);

        if (attemptsData.length > 0) {
          const latestCourse = attemptsData[0].courseName;
          setSelectedCourse(latestCourse);
          try {
            const leaderboardData = await apiService.getCourseLeaderboard(
              latestCourse,
              10
            );
            setLeaderboard(leaderboardData);
          } catch (leaderboardError) {
            console.warn("Failed to fetch leaderboard:", leaderboardError);
            setLeaderboard([]);
          }
        }
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [apiService]
  );

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn || !user?.userid) return;
    fetchAllData(user.userid.toString());
  }, [user, isLoggedIn, authLoading, fetchAllData]);

  const handleCourseChange = useCallback(
    async (courseName: string) => {
      if (!user?.userid || !courseName) return;

      setSelectedCourse(courseName);
      try {
        const leaderboardData = await apiService.getCourseLeaderboard(
          courseName,
          10
        );
        setLeaderboard(leaderboardData);
      } catch (error) {
        console.warn("Failed to fetch leaderboard for course:", error);
        setLeaderboard([]);
      }
    },
    [user, apiService]
  );

  const handleViewDetails = useCallback(
    async (attemptId: string) => {
      try {
        const analysis = await apiService.getDetailedAnalysis(attemptId);
        setDetailedAnalysis(analysis);
        setShowAnalysisModal(true);
      } catch (error) {
        console.error("Failed to fetch detailed analysis:", error);
        const attempt = attempts.find((a) => a.id === attemptId);
        if (attempt) {
          setDetailedAnalysis({
            attempt,
            questionAnalyses: [],
            topicBreakdown: attempt.topicPerformance,
            timeDistribution: null,
            comparisonData: null,
            aiAnalysis: attempt.aiAnalysis ?? "",
            keyInsights: attempt.improvementSuggestions
              ? [attempt.improvementSuggestions]
              : [],
          });
          setShowAnalysisModal(true);
        }
      }
    },
    [attempts, apiService]
  );

  const handleRetry = useCallback(() => {
    setRetryCount((prev) => prev + 1);
    if (user?.userid) {
      fetchAllData(user.userid.toString());
    }
  }, [user, fetchAllData]);

  const availableCourses = useMemo(() => {
    return Array.from(new Set(attempts.map((a) => a.courseName))).sort();
  }, [attempts]);

  if (authLoading || loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={handleRetry} />;
  }

  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-md sm:max-w-lg text-center">
          <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-700 text-sm sm:text-base mb-6">
            Please log in to view your mock test attempts and analytics.
          </p>
          <button
            onClick={() => window.location.href = "/login"}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* {user.premiumStatus?.isPremium && (
          <div className="mb-6 text-center">
            <p className="text-sm sm:text-base text-purple-600 font-semibold">
              Premium User: {user.premiumStatus.plan} (Expires:{" "}
              {user.premiumStatus.expiresAt
                ? new Date(user.premiumStatus.expiresAt).toLocaleDateString()
                : "Lifetime"}
              )
            </p>
          </div>
        )} */}

        {analytics && <UserAnalyticsSection analytics={analytics} />}

        {trends && user.userid && (
          <PerformanceTrendsSection
            trends={trends}
            userId={user.userid.toString()}
          />
        )}

        {availableCourses.length > 0 && (
          <div className="mb-8 sm:mb-12">
            <div className="flex flex-wrap items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Course Performance
              </h2>
              <select
                value={selectedCourse}
                onChange={(e) => handleCourseChange(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableCourses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>

            {leaderboard.length > 0 && (
              <LeaderboardSection
                leaderboard={leaderboard}
                currentUserId={user.userid.toString()}
              />
            )}
          </div>
        )}

        <div className="mb-8 sm:mb-12">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Your Mock Test History
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-xl sm:max-w-2xl mx-auto">
              Detailed analysis of every attempt with AI-powered insights
            </p>
          </div>

          {attempts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {attempts.map((attempt) => (
                <AttemptCard
                  key={attempt.id}
                  attempt={attempt}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-base sm:text-lg mb-4">
                No mock test attempts found
              </p>
              <p className="text-gray-600 text-sm sm:text-base mb-6">
                Start your learning journey by taking your first mock test
              </p>
              <button
                onClick={() => window.location.href = "/mock-tests"}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all"
              >
                Take a Mock Test
              </button>
            </div>
          )}
        </div>

        {showAnalysisModal && (
          <DetailedAnalysisModal
            analysis={detailedAnalysis}
            onClose={() => {
              setShowAnalysisModal(false);
              setDetailedAnalysis(null);
            }}
          />
        )}
      </div>
    </div>
  );
}