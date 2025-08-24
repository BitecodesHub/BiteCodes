"use client";

import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, CheckCircle, XCircle, BarChart, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import { ExamAttemptResponse } from './types';
import Link from 'next/link';

// Helper function to check if error is an axios error
const isAxiosError = (error: unknown): error is { response?: { status?: number; data?: any } } => {
  return typeof error === 'object' && error !== null && 'response' in error;
};

// Skeleton component for loading state
function AttemptCardSkeleton() {
  return (
    <div className="bg-white/95 rounded-2xl shadow-md p-6 border border-slate-200/50 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-40"></div>
        <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl w-20"></div>
      </div>
      <div className="space-y-3 text-sm">
        <div className="flex items-center">
          <div className="w-5 h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg mr-2"></div>
          <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-md w-32"></div>
        </div>
        <div className="flex items-center">
          <div className="w-5 h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg mr-2"></div>
          <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-md w-28"></div>
        </div>
        <div className="flex items-center">
          <div className="w-5 h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg mr-2"></div>
          <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-md w-32"></div>
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-slate-100">
        <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-md w-24"></div>
      </div>
    </div>
  );
}

function AttemptsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <AttemptCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Format time helper
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Attempt Card component
function AttemptCard({ attempt }: { attempt: ExamAttemptResponse }) {
  const router = useRouter();
  
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 p-6 border border-slate-200/50 hover:border-blue-300/50 transform hover:-translate-y-1 hover:scale-[1.02] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-slate-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-700 transition-colors leading-tight">
            {attempt.courseName.toUpperCase()}
          </h3>
          <span
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap ${
              attempt.passed
                ? 'bg-green-100 text-green-700 border-green-200'
                : 'bg-red-100 text-red-700 border-red-200'
            } border shadow-sm transform group-hover:scale-105 transition-transform duration-300`}
          >
            {attempt.passed ? 'Passed' : 'Failed'}
          </span>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex items-center text-slate-500 group-hover:text-slate-600 transition-colors">
            <div className="p-1 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg mr-2">
              <BarChart className="w-3 h-3 text-white" />
            </div>
            <span className="font-medium">Score: {attempt.score.toFixed(1)}% ({attempt.correctAnswers}/{attempt.totalQuestions})</span>
          </div>
          <div className="flex items-center text-slate-500 group-hover:text-slate-600 transition-colors">
            <div className="p-1 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg mr-2">
              <Clock className="w-3 h-3 text-white" />
            </div>
            <span className="font-medium">Time Taken: {formatTime(attempt.timeTaken)}</span>
          </div>
          <div className="flex items-center text-slate-500 group-hover:text-slate-600 transition-colors">
            <div className="p-1 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg mr-2">
              {attempt.passed ? (
                <CheckCircle className="w-3 h-3 text-white" />
              ) : (
                <XCircle className="w-3 h-3 text-white" />
              )}
            </div>
            <span className="font-medium">Attempted: {new Date(attempt.attemptedAt).toLocaleString()}</span>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-slate-100">
          <button
            onClick={() => router.push(`/mock-tests/${attempt.courseName}?attemptId=${attempt.id}`)}
            className="text-sm font-semibold text-blue-600 flex items-center group-hover:text-blue-700 transition-colors"
          >
            <BookOpen className="w-4 h-4 mr-1" />
            Review Attempt
          </button>
        </div>
      </div>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 to-slate-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-sm"></div>
    </div>
  );
}

export default function MockAttemptsPage() {
  const [attempts, setAttempts] = useState<ExamAttemptResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  let userData: { id?: string; userid?: string } | null = null;

  if (storedUser) {
    userData = JSON.parse(storedUser);
  }

  const userId = userData?.id || userData?.userid || null;
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  const authToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
  });

  useEffect(() => {
    async function fetchAttempts() {
      if (!userId) {
        setError('Please log in to view your attempts.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const res = await axiosInstance.get(`/api/attempts/user/${userId}`);
        
        if (!Array.isArray(res.data)) {
          throw new Error('Invalid API response format');
        }

        setAttempts(res.data);
      } catch (err) {
        let errorMessage = 'Failed to load attempts';
        
        if (isAxiosError(err)) {
          const status = err.response?.status;
          if (status === 401) {
            errorMessage = 'Unauthorized: Please log in to view your attempts.';
          } else if (status === 404) {
            errorMessage = 'No attempts found for this user.';
          } else if (status === 500) {
            errorMessage = 'Server error. Please try again later.';
          }
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchAttempts();
  }, [userId]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 flex items-center justify-center p-6">
        <div className="flex flex-col items-center">
          <div className="relative">
            <Loader2 className="w-16 h-16 animate-spin text-blue-600" />
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-blue-500 animate-pulse" />
            </div>
          </div>
          <p className="mt-4 text-2xl text-gray-800 font-bold">
            Loading your <span className="text-blue-600">Bitecodes Academy</span> attempts...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg border border-red-100 animate-fade-in">
          <div className="flex items-center mb-4">
            <XCircle className="w-6 h-6 text-red-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Error</h2>
          </div>
          <p className="text-gray-700 text-lg mb-6">{error}</p>
          <div className="flex gap-4">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-gray-600 hover:to-gray-700 transition-all"
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-slate-800 via-green-800 to-slate-800 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-400/10 to-slate-400/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-slate-400/10 to-green-400/10 rounded-full blur-3xl"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Your Mock Test <span className="text-green-400">Attempts</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed font-light">
                Review your past mock test attempts and analyze your performance to improve your scores.
              </p>
            </div>
          </div>
        </div>
        
        <div className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Past Attempts</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              View your previous mock test attempts and access detailed reviews
            </p>
          </div>
          
          {attempts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {attempts.map((attempt) => (
                <AttemptCard key={attempt.id} attempt={attempt} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">No attempts found. Start practicing now!</p>
              <Link
                href="/mock-tests"
                className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all"
              >
                Take a Mock Test
              </Link>
            </div>
          )}
        </div>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}