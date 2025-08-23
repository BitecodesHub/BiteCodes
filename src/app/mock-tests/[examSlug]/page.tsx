"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, CheckCircle, XCircle, RotateCcw, AlertCircle, Loader2, 
  Flag, BookOpen, BarChart, Fullscreen, Volume2, VolumeX,
  ChevronLeft, ChevronRight, HelpCircle, Award
} from 'lucide-react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import Confetti from 'react-confetti';
import { toast, Toaster } from 'react-hot-toast';
import { ExamQuestion, Answer, ExamAttemptResponse, ExamSection } from './types';

// Helper function to check if error is an axios error
const isAxiosError = (error: unknown): error is { response?: { status?: number; data?: any } } => {
  return typeof error === 'object' && error !== null && 'response' in error;
};

// Reusable Components (unchanged, included for completeness)
const TimerDisplay = ({ timeLeft }: { timeLeft: number }) => {
  const isCritical = timeLeft < 300; // Less than 5 minutes
  return (
    <div className={`flex items-center px-4 py-2 rounded-lg shadow-md transition-all duration-300 ${
      isCritical 
        ? 'bg-gradient-to-r from-red-500 to-red-600 animate-pulse' 
        : 'bg-gradient-to-r from-blue-500 to-blue-600'
    } text-white`}>
      <Clock className="w-5 h-5 mr-2" />
      <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
    </div>
  );
};

const DifficultyBadge = ({ difficulty }: { difficulty?: string }) => {
  if (!difficulty) return null;
  
  const colors: { [key: string]: string } = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800'
  };
  
  const colorClass = colors[difficulty.toLowerCase()] || 'bg-gray-100 text-gray-800';
  
  return (
    <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
    </span>
  );
};

const ProgressBar = ({ answeredCount, totalQuestions }: { answeredCount: number; totalQuestions: number }) => (
  <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
    <div
      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-in-out"
      style={{ width: `${totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0}%` }}
    />
  </div>
);

const QuestionNavigation = ({ 
  sections,
  currentSection,
  currentIndex,
  answers,
  markedQuestions,
  onSelect 
}: { 
  sections: ExamSection[];
  currentSection: number;
  currentIndex: number;
  answers: Record<string, Answer>;
  markedQuestions: Set<string>;
  onSelect: (sectionIndex: number, questionIndex: number) => void;
}) => {
  if (!sections[currentSection]?.questions?.length) {
    return <div className="text-gray-600 text-center">No questions available</div>;
  }

  return (
    <div className="grid grid-cols-5 gap-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
      {sections[currentSection].questions.map((q, idx) => {
        const isAnswered = answers[q.id]?.selectedOption !== undefined;
        const isCurrent = idx === currentIndex;
        const isMarked = markedQuestions.has(q.id);
        
        return (
          <button
            key={q.id}
            onClick={() => onSelect(currentSection, idx)}
            className={`relative flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all transform hover:scale-110 shadow-md ${
              isCurrent 
                ? 'ring-2 ring-blue-500 scale-110 bg-blue-200 text-blue-800' 
                : isMarked 
                  ? 'bg-orange-200 text-orange-800 border-2 border-orange-400' 
                  : isAnswered 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-800'
            }`}
          >
            {idx + 1}
            {isMarked && <Flag className="absolute -top-0.5 -right-0.5 w-3 h-3 text-orange-500" />}
          </button>
        );
      })}
    </div>
  );
};

const ResultCard = ({ 
  result, 
  resetExam,
  showReview
}: { 
  result: ExamAttemptResponse; 
  resetExam: () => void;
  showReview: () => void;
}) => {
  const [showConfetti, setShowConfetti] = useState(result.passed);
  
  useEffect(() => {
    if (result.passed) {
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [result.passed]);
  
  return (
    
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto border border-gray-100 relative overflow-hidden">
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}

      <div className="text-center mb-8 animate-fade-in">
        {result.passed ? (
          <div className="relative inline-block">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4 animate-bounce" />
            <Award className="absolute -top-2 -right-2 w-8 h-8 text-yellow-500 animate-spin-slow" />
          </div>
        ) : (
          <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4 animate-bounce" />
        )}
        <h1 className="text-4xl font-bold text-gray-800 mb-3">Test Results</h1>
        <p className={`text-2xl font-semibold ${result.passed ? 'text-green-600' : 'text-red-600'} animate-pulse`}>
          {result.passed ? 'Congratulations! You Passed!' : 'Better Luck Next Time!'}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-200 to-indigo-50 rounded-xl p-6 shadow-sm border border-blue-100">
          <h3 className="font-semibold text-xl text-gray-800 mb-4 flex items-center">
            <BarChart className="mr-2 w-6 h-6 text-blue-600" />
            Performance Summary
          </h3>
          <div className="space-y-3 text-gray-700">
            <div className="flex justify-between">
              <span><strong>Score:</strong></span>
              <span className="font-bold text-2xl text-blue-600">{result.score.toFixed(1)}% ({result.correctAnswers}/{result.totalQuestions})</span>
            </div>
            <div className="flex justify-between">
              <span><strong>Correct Answers:</strong></span>
              <span className="text-green-600">{result.correctAnswers}</span>
            </div>
            <div className="flex justify-between">
              <span><strong>Incorrect Answers:</strong></span>
              <span className="text-red-600">{result.incorrectAnswers}</span>
            </div>
            <div className="flex justify-between">
              <span><strong>Skipped:</strong></span>
              <span className="text-yellow-600">{result.skipped}</span>
            </div>
            <div className="flex justify-between">
              <span><strong>Time Taken:</strong></span>
              <span>{formatTime(result.timeTaken)} / 30:00</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-xl text-gray-800 mb-4 flex items-center">
            <BookOpen className="mr-2 w-6 h-6 text-indigo-600" />
            Course Details
          </h3>
          <div className="space-y-3 text-gray-700">
            <p>
              <strong>Course:</strong> 
              <span className="ml-2 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                {result.courseName.toUpperCase()}
              </span>
            </p>
            <p>
              <strong>Status:</strong>
              <span className={`ml-2 px-3 py-1 rounded-full text-sm ${
                result.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {result.passed ? 'Passed' : 'Failed'}
              </span>
            </p>
            <p><strong>Date:</strong> {new Date(result.attemptedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <button
          onClick={resetExam}
          className="group bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 flex items-center justify-center transition-all shadow-lg hover:shadow-xl"
        >
          <RotateCcw className="w-5 h-5 mr-2 group-hover:animate-spin" />
          Retake Test
        </button>
        
        <button
          onClick={showReview}
          className="group bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 flex items-center justify-center transition-all shadow-lg hover:shadow-xl"
        >
          <BookOpen className="w-5 h-5 mr-2 group-hover:animate-pulse" />
          Review Answers
        </button>
      </div>
    </div>
  );
};

const QuestionCard = ({ 
  question, 
  index,
  selectedOption, 
  handleOptionChange,
  toggleMarkQuestion,
  isMarked,
  isReviewMode,
  correctAnswer,
  userAnswer
}: { 
  question: ExamQuestion;
  index: number;
  selectedOption: number | undefined;
  handleOptionChange: (questionId: string, optionIndex: number) => void;
  toggleMarkQuestion: (questionId: string) => void;
  isMarked: boolean;
  isReviewMode: boolean;
  correctAnswer?: number;
  userAnswer?: number;
}) => {
  const showResults = isReviewMode && correctAnswer !== undefined;
  
  return (
    <div className={`border-b border-gray-200 pb-8 last:border-b-0 transition-all duration-300 ${
      showResults ? (userAnswer === correctAnswer ? 'bg-green-50' : 'bg-red-50') : ''
    } rounded-lg p-4`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-xl text-gray-800">
          {index + 1}. {question.questionText}
          <DifficultyBadge difficulty={question.difficulty} />
        </h3>
        
        <button
          onClick={() => toggleMarkQuestion(question.id)}
          className={`ml-4 p-2 rounded-full ${
            isMarked 
              ? 'bg-orange-100 text-orange-500' 
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
          aria-label={isMarked ? "Unmark question" : "Mark question for review"}
        >
          <Flag className="w-5 h-5" fill={isMarked ? 'currentColor' : 'none'} />
        </button>
      </div>
      
      <div className="space-y-3">
        {question.options.map((opt, optIdx) => {
          let optionStyle = '';
          if (showResults) {
            if (optIdx === correctAnswer) {
              optionStyle = 'bg-green-100 border-green-300 shadow-green-sm';
            } else if (optIdx === userAnswer && userAnswer !== correctAnswer) {
              optionStyle = 'bg-red-100 border-red-300 shadow-red-sm';
            }
          }
          
          return (
            <label
              key={optIdx}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:bg-blue-50 ${
                selectedOption === optIdx 
                  ? 'bg-blue-100 border-blue-300 shadow-blue-sm' 
                  : 'border-gray-200'
              } ${optionStyle}`}
            >
              <input
                type="radio"
                name={question.id}
                checked={selectedOption === optIdx}
                onChange={() => handleOptionChange(question.id, optIdx)}
                className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500"
                disabled={isReviewMode}
              />
              <span className="text-gray-800 text-lg">{opt}</span>
              
              {showResults && optIdx === correctAnswer && (
                <span className="ml-auto text-green-600 flex items-center">
                  Correct <CheckCircle className="ml-2 w-5 h-5" />
                </span>
              )}
              
              {showResults && optIdx === userAnswer && userAnswer !== correctAnswer && (
                <span className="ml-auto text-red-600 flex items-center">
                  Your Answer <XCircle className="ml-2 w-5 h-5" />
                </span>
              )}
            </label>
          );
        })}
      </div>
      
      {showResults && question.explanation && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800 flex items-center mb-2">
            <HelpCircle className="mr-2 w-5 h-5" /> Explanation
          </h4>
          <p className="text-blue-700">{question.explanation}</p>
        </div>
      )}
    </div>
  );
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function MockTestPage() {
  const params = useParams();
  const router = useRouter();
  const examSlug = (params?.examSlug as string) || 'cmat';
  const [sections, setSections] = useState<ExamSection[]>([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [markedQuestions, setMarkedQuestions] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<ExamAttemptResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(1800);
  const [examStarted, setExamStarted] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const userId = 1;
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  const authToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
  });

  // Timer effect
  useEffect(() => {
    if (examStarted && timeLeft > 0 && !result) {
      const timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !result) {
      handleSubmit();
    }
  }, [examStarted, timeLeft, result]);

  // Fullscreen effect
  useEffect(() => {
    if (fullScreen && containerRef.current) {
      containerRef.current.requestFullscreen?.().catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else if (document.fullscreenElement) {
      document.exitFullscreen?.();
    }
  }, [fullScreen]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showReview || loading || result) return;
      
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextQuestion();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevQuestion();
      }
      
      if (e.key >= '1' && e.key <= '4') {
        e.preventDefault();
        const optionIndex = parseInt(e.key) - 1;
        const currentQuestion = sections[currentSection]?.questions[currentQuestionIndex];
        if (currentQuestion && optionIndex < currentQuestion.options.length) {
          handleOptionChange(currentQuestion.id, optionIndex);
        }
      }
      
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        const currentQuestion = sections[currentSection]?.questions[currentQuestionIndex];
        if (currentQuestion) {
          toggleMarkQuestion(currentQuestion.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSection, currentQuestionIndex, sections, showReview, loading, result]);

  // Fetch questions
  useEffect(() => {
    async function fetchQuestions() {
      if (!examSlug) {
        setError('No exam specified. Please select an exam.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const res = await axiosInstance.get(`/api/questions/course/${examSlug}/random`);
        
        if (!res.data || !Array.isArray(res.data)) {
          throw new Error('Invalid API response format');
        }

        const sectionsData: ExamSection[] = res.data.map((section: any) => ({
          sectionName: section.sectionName || 'Unnamed Section',
          questions: Array.isArray(section.questions) ? section.questions
            .map((q: any) => ({
              id: q.id?.toString(),
              questionText: q.questionText,
              options: [q.optionA, q.optionB, q.optionC, q.optionD].filter(Boolean),
              correctAnswer: ['A', 'B', 'C', 'D'].indexOf(q.correctOption),
              courseId: q.courseName,
              difficulty: q.difficulty,
              explanation: q.explanation
            }))
            .filter(
              (q: ExamQuestion) =>
                q &&
                q.id &&
                q.questionText &&
                Array.isArray(q.options) &&
                q.options.length === 4 &&
                q.correctAnswer >= 0
            ) : []
        })).filter((section: ExamSection) => section.questions.length > 0);

        if (sectionsData.length === 0 || sectionsData.every(section => section.questions.length === 0)) {
          throw new Error('No valid questions found');
        }

        const totalQuestions = sectionsData.reduce((acc, section) => acc + section.questions.length, 0);
        if (totalQuestions !== 100) {
          throw new Error(`Expected 100 questions, but received ${totalQuestions}`);
        }

        setSections(sectionsData);
        setExamStarted(true);
        
        const savedProgress = localStorage.getItem(`examProgress-${examSlug}`);
        if (savedProgress) {
          const { answers, marked, timeLeft, currentSection, currentQuestionIndex } = JSON.parse(savedProgress);
          setAnswers(answers || {});
          setMarkedQuestions(new Set(marked || []));
          setTimeLeft(timeLeft || 1800);
          setCurrentSection(Math.min(currentSection || 0, sectionsData.length - 1));
          setCurrentQuestionIndex(Math.min(
            currentQuestionIndex || 0, 
            sectionsData[Math.min(currentSection || 0, sectionsData.length - 1)]?.questions.length - 1 || 0
          ));
        }
      } catch (err) {
        let errorMessage = 'Failed to load questions';
        
        if (isAxiosError(err)) {
          const status = err.response?.status;
          if (status === 401) {
            errorMessage = 'Unauthorized: Please log in to access the exam.';
          } else if (status === 404) {
            errorMessage = `Exam "${examSlug}" not found. Please check the exam slug.`;
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

    fetchQuestions();
  }, [examSlug]);

  // Auto-save progress
  useEffect(() => {
    if (examStarted && sections.length > 0) {
      const saveProgress = () => {
        localStorage.setItem(`examProgress-${examSlug}`, JSON.stringify({
          answers,
          marked: Array.from(markedQuestions),
          timeLeft,
          currentSection,
          currentQuestionIndex,
          timestamp: Date.now()
        }));
      };
      
      const saveInterval = setInterval(saveProgress, 30000);
      return () => clearInterval(saveInterval);
    }
  }, [examStarted, sections, answers, markedQuestions, timeLeft, examSlug, currentSection, currentQuestionIndex]);

  const handleOptionChange = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({ 
      ...prev, 
      [questionId]: { 
        ...prev[questionId], 
        selectedOption: optionIndex 
      } 
    }));
    
    if (soundEnabled) {
      const audio = new Audio('/sounds/select.mp3');
      audio.volume = 0.3;
      audio.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  const toggleMarkQuestion = (questionId: string) => {
    setMarkedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handlePrevQuestion = () => {
    if (!sections[currentSection]) return;
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
      setCurrentQuestionIndex(sections[currentSection - 1].questions.length - 1);
    }
  };

  const handleNextQuestion = () => {
    if (!sections[currentSection]) return;
    if (currentQuestionIndex < sections[currentSection].questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1);
      setCurrentQuestionIndex(0);
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;
    
    const totalQuestions = sections.reduce((acc, section) => acc + (section.questions?.length || 0), 0);
    const unanswered = sections.reduce((acc, section) => 
      acc + (section.questions?.filter(q => answers[q.id]?.selectedOption === undefined).length || 0), 0);
    if (unanswered > 0 && !window.confirm(`You have ${unanswered} unanswered questions. Are you sure you want to submit?`)) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const formattedAnswers: { [key: string]: string } = {};
      Object.entries(answers).forEach(([questionId, answer]) => {
        formattedAnswers[parseInt(questionId)] = ['A', 'B', 'C', 'D'][answer.selectedOption];
      });

      // Collect all question IDs from sections
      const questionIds = sections.flatMap(section => 
        section.questions.map(q => q.id)
      );

      const res = await axiosInstance.post('/api/exams/submit', {
        userId,
        courseName: examSlug,
        answers: formattedAnswers,
        timeTaken: 1800 - timeLeft,
        questionIds
      });

      // Validate response
      const responseTotal = res.data.correctAnswers + res.data.incorrectAnswers + res.data.skipped;
      if (responseTotal !== res.data.totalQuestions || res.data.totalQuestions !== totalQuestions) {
        throw new Error(`Total questions mismatch: expected ${totalQuestions}, received ${responseTotal} (backend total: ${res.data.totalQuestions})`);
      }

      setResult(res.data);
      localStorage.removeItem(`examProgress-${examSlug}`);
      
      if (res.data.passed && soundEnabled) {
        const audio = new Audio('/sounds/success.mp3');
        audio.play().catch(e => console.log('Audio play failed:', e));
      }
    } catch (err) {
      let errorMessage = 'Failed to submit exam. Please try again.';
      
      if (isAxiosError(err)) {
        const status = err.response?.status;
        if (status === 401) {
          errorMessage = 'Unauthorized: Please log in to submit the exam.';
        } else if (status === 400) {
          errorMessage = err.response?.data || 'Invalid submission data. Please check your answers and try again.';
        } else if (status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const getAnsweredCount = () => Object.values(answers).filter(a => a.selectedOption !== undefined).length;

  const resetExam = () => {
    setResult(null);
    setAnswers({});
    setMarkedQuestions(new Set());
    setTimeLeft(1800);
    setExamStarted(false);
    setCurrentSection(0);
    setCurrentQuestionIndex(0);
    setShowReview(false);
    setError(null);
    localStorage.removeItem(`examProgress-${examSlug}`);
  };

  const toggleFullScreen = () => {
    setFullScreen(!fullScreen);
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  const handleQuestionSelect = (sectionIndex: number, questionIndex: number) => {
    if (sectionIndex >= 0 && sectionIndex < sections.length && sections[sectionIndex]?.questions?.length > questionIndex) {
      setCurrentSection(sectionIndex);
      setCurrentQuestionIndex(questionIndex);
    }
  };

  // Error state
  if (error && !result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg border border-red-100 animate-fade-in">
          <div className="flex items-center mb-4">
            <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Error</h2>
          </div>
          <p className="text-gray-700 text-lg mb-6">
            {error === 'No valid questions found'
              ? `No questions are available for the "${examSlug}" exam. Please try a different exam or contact support.`
              : error}
          </p>
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
            Preparing your <span className="text-blue-600">Bitecodes Academy</span> exam...
          </p>
          <p className="text-gray-600 mt-2">Loading questions</p>
        </div>
      </div>
    );
  }

  // Result state
  if (result && !showReview) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 py-12 px-6">
        <ResultCard result={result} resetExam={resetExam} showReview={() => setShowReview(true)} />
        <Toaster position="bottom-right" />
      </div>
    );
  }

  // Review state
  if (result && showReview) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                <BookOpen className="mr-3 text-indigo-600" />
                Answer Review: {result.courseName.toUpperCase()}
              </h1>
              <button
                onClick={() => setShowReview(false)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold"
              >
                Back to Results
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {sections.map((section, idx) => (
                  <button
                    key={section.sectionName}
                    onClick={() => {
                      setCurrentSection(idx);
                      setCurrentQuestionIndex(0);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      currentSection === idx
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {section.sectionName}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              {sections[currentSection]?.questions?.length ? (
                sections[currentSection].questions.map((q, idx) => {
                  const userAnswer = answers[q.id]?.selectedOption;
                  const detailedResult = result.detailedResults.find(r => r.questionId === q.id);
                  
                  return (
                    <QuestionCard
                      key={q.id}
                      question={q}
                      index={idx}
                      selectedOption={userAnswer}
                      handleOptionChange={() => {}}
                      toggleMarkQuestion={() => {}}
                      isMarked={markedQuestions.has(q.id)}
                      isReviewMode={true}
                      correctAnswer={q.correctAnswer}
                      userAnswer={userAnswer}
                    />
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No questions available for this section.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main exam interface
  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 py-12 px-4 sm:px-6"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-2 rounded-lg mr-3">
                Bitecodes
              </span>
              Academy Mock Test
            </h1>
            <p className="text-gray-600 mt-1 capitalize">Exam: {examSlug}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSound}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
              aria-label={soundEnabled ? "Mute sounds" : "Unmute sounds"}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            
            <button
              onClick={toggleFullScreen}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
              aria-label={fullScreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {fullScreen ? <Fullscreen className="w-5 h-5" /> : <Fullscreen className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {sections.length > 0 ? (
          <>
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
              <div className="flex flex-wrap gap-3 mb-6">
                {sections.map((section, idx) => (
                  <button
                    key={section.sectionName}
                    onClick={() => {
                      setCurrentSection(idx);
                      setCurrentQuestionIndex(0);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      currentSection === idx
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {section.sectionName}
                  </button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center space-x-6">
                  <TimerDisplay timeLeft={timeLeft} />
                  <div className="text-gray-700 text-lg font-medium">
                    {getAnsweredCount()} / {sections.reduce((acc, section) => acc + (section.questions?.length || 0), 0)} answered
                  </div>
                  <div className="hidden md:flex items-center text-orange-600">
                    <Flag className="w-5 h-5 mr-2" />
                    {markedQuestions.size} marked
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={handlePrevQuestion}
                    disabled={currentSection === 0 && currentQuestionIndex === 0}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700"
                    aria-label="Previous question"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={handleNextQuestion}
                    disabled={currentSection === sections.length - 1 && 
                             currentQuestionIndex === (sections[currentSection]?.questions?.length - 1 || 0)}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700"
                    aria-label="Next question"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="mt-4">
                <ProgressBar 
                  answeredCount={getAnsweredCount()} 
                  totalQuestions={sections.reduce((acc, section) => acc + (section.questions?.length || 0), 0)} 
                />
              </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">
                <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
                  {sections[currentSection]?.questions?.length > 0 ? (
                    <QuestionCard
                      question={sections[currentSection].questions[currentQuestionIndex]}
                      index={currentQuestionIndex}
                      selectedOption={answers[sections[currentSection].questions[currentQuestionIndex]?.id]?.selectedOption}
                      handleOptionChange={handleOptionChange}
                      toggleMarkQuestion={toggleMarkQuestion}
                      isMarked={markedQuestions.has(sections[currentSection].questions[currentQuestionIndex]?.id)}
                      isReviewMode={false}
                    />
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-600 text-lg">No questions available for this section.</p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row justify-between mt-8 gap-4">
                    <button
                      onClick={handlePrevQuestion}
                      disabled={currentSection === 0 && currentQuestionIndex === 0}
                      className="flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50"
                    >
                      <ChevronLeft className="w-5 h-5 mr-2" />
                      Previous
                    </button>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => toggleMarkQuestion(sections[currentSection]?.questions[currentQuestionIndex]?.id)}
                        className={`flex items-center justify-center px-6 py-3 rounded-lg font-medium ${
                          markedQuestions.has(sections[currentSection]?.questions[currentQuestionIndex]?.id)
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        disabled={!sections[currentSection]?.questions[currentQuestionIndex]}
                      >
                        <Flag className="w-5 h-5 mr-2" />
                        {markedQuestions.has(sections[currentSection]?.questions[currentQuestionIndex]?.id) ? 'Unmark' : 'Mark'}
                      </button>
                      
                      <button
                        onClick={handleNextQuestion}
                        disabled={currentSection === sections.length - 1 && 
                                 currentQuestionIndex === (sections[currentSection]?.questions?.length - 1 || 0)}
                        className="flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50"
                      >
                        Next
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 sticky top-6">
                  <h3 className="font-semibold text-xl text-gray-800 mb-4">Question Navigation</h3>
                  
                  <QuestionNavigation
                    sections={sections}
                    currentSection={currentSection}
                    currentIndex={currentQuestionIndex}
                    answers={answers}
                    markedQuestions={markedQuestions}
                    onSelect={handleQuestionSelect}
                  />
                  
                <div className="flex flex-col space-y-3 mb-6">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-blue-100 mr-2"></div>
                    <span className="text-sm text-black">Answered</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-gray-100 border border-black-800 mr-2"></div>
                    <span className="text-sm text-black">Unanswered</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-orange-100 border-2 border-orange-400 mr-2"></div>
                    <span className="text-sm text-black">Marked</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-white ring-4 ring-blue-500 mr-2"></div>
                    <span className="text-sm text-black">Current</span>
                  </div>
                </div>
                  
                  <button
                    onClick={() => {
                      if (window.confirm('Are you ready to submit your test?')) {
                        handleSubmit();
                      }
                    }}
                    disabled={submitting}
                    className={`w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center transition-all shadow-lg ${
                      submitting
                        ? 'bg-gray-400'
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:shadow-xl'
                    }`}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Test'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No sections available for this exam.</p>
          </div>
        )}
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}
