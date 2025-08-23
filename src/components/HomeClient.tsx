"use client";
// src/app/components/HomeClient.tsx
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight, Users, BookOpen, University, Award, AlertCircle, RefreshCw, Star, TrendingUp, Globe, Target, Zap, Clock, ArrowRight, CheckCircle } from "lucide-react";

// Types
interface EntranceExam {
  id: string;
  name: string;
  fullName: string;
  description: string;
  conductedBy: string;
  mode: string;
  difficulty: string;
  studentsAppear: string;
  examDate: string;
  applicationDeadline: string;
  subjects: string[];
  featured: boolean;
  duration: string;
  totalQuestions: number;
  totalMarks: number;
  examPatternDuration: string;
  ageLimit: string;
  qualification: string;
  minMarks: string;
  generalFees: number;
  scFees: number;
  physicsTopics: string[];
  chemistryTopics: string[];
  mathematicsTopics: string[];
  preparationTips: string[];
}

interface University {
  slug: string;
  name: string;
  description: string;
  location: string;
  ranking: number;
  established: number;
  website: string;
  admissionLink: string;
  examsAccepted: string[];
  courses: {
    slug: string;
    name: string;
    description: string;
    examSlug: string;
  }[];
}

// Animated Counter Component
function AnimatedCounter({ target, duration = 2000, suffix = "", prefix = "" }: { target: number; duration?: number; suffix?: string; prefix?: string; }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [target, duration]);

  return (
    <span className="tabular-nums">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

// Floating Elements Background
function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated geometric shapes */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-100/10 to-slate-200/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-slate-200/10 to-blue-200/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-40 left-20 w-24 h-24 bg-gradient-to-r from-blue-200/10 to-slate-100/10 rounded-full blur-xl animate-pulse delay-2000"></div>
      <div className="absolute bottom-20 right-40 w-16 h-16 bg-gradient-to-r from-slate-100/10 to-blue-100/10 rounded-full blur-xl animate-pulse delay-3000"></div>
      
      {/* Floating icons */}
      <div className="absolute top-32 right-32 opacity-5 animate-bounce delay-500">
        <BookOpen className="w-8 h-8 text-slate-400" />
      </div>
      <div className="absolute bottom-32 left-40 opacity-5 animate-bounce delay-1000">
        <University className="w-10 h-10 text-blue-400" />
      </div>
      <div className="absolute top-60 left-60 opacity-5 animate-bounce delay-1500">
        <Award className="w-6 h-6 text-slate-500" />
      </div>
    </div>
  );
}

// Error component
function ErrorMessage({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex items-center justify-center p-8 bg-red-50/90 backdrop-blur-sm rounded-2xl border border-red-200/50 shadow-md">
      <div className="text-center">
        <div className="relative">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <div className="absolute inset-0 w-12 h-12 bg-red-600/10 rounded-full blur-xl mx-auto"></div>
        </div>
        <p className="text-red-700 mb-4 font-medium">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 flex items-center gap-2 mx-auto shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

// Empty state component
function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-center justify-center p-8 bg-slate-50/90 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-md">
      <div className="text-center">
        <div className="relative">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <div className="absolute inset-0 w-12 h-12 bg-slate-400/10 rounded-full blur-xl mx-auto"></div>
        </div>
        <h3 className="text-lg font-semibold text-slate-700 mb-2">{title}</h3>
        <p className="text-slate-500">{description}</p>
      </div>
    </div>
  );
}

// Enhanced Skeleton components
function ExamsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-slate-200/50 h-48 relative overflow-hidden"
        >
          <div className="animate-pulse">
            <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg mb-4"></div>
            <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-md w-3/4 mb-2"></div>
            <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-md w-1/2 mb-4"></div>
            <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded-md w-2/3"></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-100%] animate-shimmer"></div>
        </div>
      ))}
    </div>
  );
}

function UniversitiesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-slate-200/50 h-48 relative overflow-hidden"
        >
          <div className="animate-pulse">
            <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg mb-4"></div>
            <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-md w-3/4 mb-2"></div>
            <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-md w-1/2 mb-4"></div>
            <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded-md w-2/3"></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-100%] animate-shimmer"></div>
        </div>
      ))}
    </div>
  );
}

// Enhanced Components
function FeaturedExams({ exams }: { exams: EntranceExam[] }) {
  const featuredExams = exams.filter(exam => exam.featured).slice(0, 4);
  
  if (featuredExams.length === 0) {
    return <EmptyState title="No Featured Exams Available" description="We're working on adding more entrance exams. Please check back soon!" />;
  }

  const getDifficultyConfig = (difficulty: string) => {
    const lowerDifficulty = difficulty.toLowerCase();
    if (lowerDifficulty.includes('hard')) 
      return { 
        bg: "bg-gradient-to-r from-red-50 to-red-100", 
        text: "text-red-700",
        border: "border-red-200",
        glow: "shadow-red-100/50"
      };
    if (lowerDifficulty.includes('moderate')) 
      return { 
        bg: "bg-gradient-to-r from-amber-50 to-amber-100", 
        text: "text-amber-700",
        border: "border-amber-200",
        glow: "shadow-amber-100/50"
      };
    return { 
      bg: "bg-gradient-to-r from-emerald-50 to-emerald-100", 
      text: "text-emerald-700",
      border: "border-emerald-200",
      glow: "shadow-emerald-100/50"
    };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {featuredExams.map((exam, index) => {
        const difficultyConfig = getDifficultyConfig(exam.difficulty);
        return (
          <Link key={exam.id} href={`/entrance-exams/${exam.id}`} className="group">
            <div className={`bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-500 border border-slate-200/50 hover:border-blue-300/50 transform hover:-translate-y-1 hover:scale-[1.02] relative overflow-hidden`}>
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-slate-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 pr-2">
                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-700 transition-colors leading-tight">
                      {exam.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 group-hover:text-slate-600 transition-colors">
                      {exam.conductedBy}
                    </p>
                  </div>
                  <div className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap ${difficultyConfig.bg} ${difficultyConfig.text} ${difficultyConfig.border} border shadow-sm ${difficultyConfig.glow} transform group-hover:scale-105 transition-transform duration-300`}>
                    {exam.difficulty}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-slate-600 group-hover:text-slate-700 space-x-2 transition-colors">
                    <div className="p-1 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg">
                      <Users className="w-3 h-3 text-white" />
                    </div>
                    <span className="font-medium">{exam.studentsAppear} students appear</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600 group-hover:text-slate-700 space-x-2 transition-colors">
                    <div className="p-1 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg">
                      <BookOpen className="w-3 h-3 text-white" />
                    </div>
                    <span className="font-medium">{exam.mode} • {exam.duration}</span>
                  </div>
                </div>

                {/* Hover arrow */}
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <div className="flex items-center text-blue-600 text-sm font-semibold">
                    Learn more <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </div>

              {/* Animated border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 to-slate-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-sm"></div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function TopUniversities({ universities }: { universities: University[] }) {
  const topUniversities = universities.slice(0, 4);
  
  if (topUniversities.length === 0) {
    return <EmptyState title="No Universities Available" description="We're working on adding more university information. Please check back soon!" />;
  }

  const getRankingConfig = (ranking: number) => {
    if (ranking <= 10) return {
      display: `Top ${ranking}`,
      bg: "bg-gradient-to-r from-amber-50 to-amber-100",
      text: "text-amber-700",
      border: "border-amber-200",
      glow: "shadow-amber-100/50"
    };
    if (ranking <= 50) return {
      display: `Rank ${ranking}`,
      bg: "bg-gradient-to-r from-blue-50 to-blue-100",
      text: "text-blue-700",
      border: "border-blue-200",
      glow: "shadow-blue-100/50"
    };
    return {
      display: `Rank ${ranking}+`,
      bg: "bg-gradient-to-r from-slate-50 to-slate-100",
      text: "text-slate-700",
      border: "border-slate-200",
      glow: "shadow-slate-100/50"
    };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {topUniversities.map((uni, index) => {
        const rankingConfig = getRankingConfig(uni.ranking);
        return (
          <Link key={uni.slug} href={`/universities/${uni.slug}`} className="group">
            <div className={`bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-500 border border-slate-200/50 hover:border-blue-300/50 transform hover:-translate-y-1 hover:scale-[1.02] relative overflow-hidden`}>
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-slate-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 pr-2">
                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-700 transition-colors leading-tight">
                      {uni.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 group-hover:text-slate-600 transition-colors">
                      {uni.location}
                    </p>
                  </div>
                  <div className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap ${rankingConfig.bg} ${rankingConfig.text} ${rankingConfig.border} border shadow-sm ${rankingConfig.glow} transform group-hover:scale-105 transition-transform duration-300`}>
                    {rankingConfig.display}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-slate-600 group-hover:text-slate-700 space-x-2 transition-colors">
                    <div className="p-1 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg">
                      <University className="w-3 h-3 text-white" />
                    </div>
                    <span className="font-medium">Est. {uni.established}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600 group-hover:text-slate-700 space-x-2 transition-colors">
                    <div className="p-1 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg">
                      <BookOpen className="w-3 h-3 text-white" />
                    </div>
                    <span className="font-medium">{uni.courses.length} courses available</span>
                  </div>
                </div>

                {/* Hover arrow */}
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <div className="flex items-center text-blue-600 text-sm font-semibold">
                    Explore university <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </div>

              {/* Animated border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 to-slate-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-sm"></div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

// Main Client Component
export default function HomeClient() {
  const [exams, setExams] = useState<EntranceExam[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loadingExams, setLoadingExams] = useState(true);
  const [loadingUniversities, setLoadingUniversities] = useState(true);
  const [examError, setExamError] = useState<string | null>(null);
  const [universityError, setUniversityError] = useState<string | null>(null);

  const stats = [
    { 
      number: 50000, 
      suffix: "+", 
      label: "Students Helped", 
      icon: Users, 
      gradient: "from-blue-600 to-blue-700",
      description: "Success stories worldwide"
    },
    { 
      number: 100, 
      suffix: "+", 
      label: "Entrance Exams", 
      icon: BookOpen, 
      gradient: "from-slate-600 to-slate-700",
      description: "Comprehensive coverage"
    },
    { 
      number: 500, 
      suffix: "+", 
      label: "Universities", 
      icon: University, 
      gradient: "from-blue-700 to-slate-700",
      description: "Top institutions globally"
    },
    { 
      number: 95, 
      suffix: "%", 
      label: "Success Rate", 
      icon: Award, 
      gradient: "from-emerald-600 to-emerald-700",
      description: "Proven track record"
    },
  ];

  const fetchExams = async () => {
    try {
      setLoadingExams(true);
      setExamError(null);
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backend.bitecodes.com";
      console.log("Fetching exams from:", `${apiUrl}/api/exams`);
      
      const response = await fetch(`${apiUrl}/api/exams`, { 
        cache: "no-store",
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log("Exams response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Exams data:", data);
      
      setExams(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching exams:", error);
      setExamError(error instanceof Error ? error.message : "Failed to load exams");
    } finally {
      setLoadingExams(false);
    }
  };

  const fetchUniversities = async () => {
    try {
      setLoadingUniversities(true);
      setUniversityError(null);
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backend.bitecodes.com";
      console.log("Fetching universities from:", `${apiUrl}/api/universities`);
      
      const response = await fetch(`${apiUrl}/api/universities`, { 
        cache: "no-store",
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log("Universities response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Universities data:", data);
      
      setUniversities(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching universities:", error);
      setUniversityError(error instanceof Error ? error.message : "Failed to load universities");
    } finally {
      setLoadingUniversities(false);
    }
  };

  useEffect(() => {
    fetchExams();
    fetchUniversities();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/20 via-slate-50/10 to-transparent"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-slate-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-slate-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <FloatingElements />

      {/* Hero Section */}
      <section className="relative py-24 text-center max-w-7xl mx-auto px-4 z-10">
        <div className="relative">
          {/* Main heading with enhanced styling */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-800 mb-6 leading-tight">
            Your Gateway to
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-slate-700 bg-clip-text text-transparent">
              Academic Excellence
            </span>
          </h1>
          
          {/* Enhanced subtitle */}
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Master entrance exams with comprehensive preparation resources, detailed university insights, and 
            <span className="text-blue-600 font-semibold"> AI-powered mock tests</span>.
          </p>
          
          {/* Enhanced CTA buttons */}
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/mock-tests"
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold text-lg flex items-center gap-3 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Zap className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Start Free Mock Test</span>
              <ChevronRight className="w-5 h-5 relative z-10 transform group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            
            <Link
              href="/entrance-exams"
              className="group px-8 py-4 bg-white/80 backdrop-blur-sm text-slate-700 border border-slate-200 rounded-xl font-semibold text-lg flex items-center gap-3 hover:bg-white hover:border-slate-300 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <BookOpen className="w-5 h-5" />
              <span>Explore Exams</span>
              <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

     
      {/* Featured Exams */}
      <section className="relative py-20 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Most <span className="text-blue-600">Popular</span> Entrance Exams
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Discover the most sought-after entrance exams with comprehensive preparation materials
            </p>
          </div>
          
          {loadingExams ? (
            <ExamsSkeleton />
          ) : examError ? (
            <ErrorMessage message={`Error loading exams: ${examError}`} onRetry={fetchExams} />
          ) : (
            <FeaturedExams exams={exams} />
          )}
        </div>
      </section>

      {/* Top Universities */}
      <section className="relative py-20 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Top <span className="text-blue-600">Universities</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Explore prestigious institutions and find your perfect academic match
            </p>
          </div>
          
          {loadingUniversities ? (
            <UniversitiesSkeleton />
          ) : universityError ? (
            <ErrorMessage message={`Error loading universities: ${universityError}`} onRetry={fetchUniversities} />
          ) : (
            <TopUniversities universities={universities} />
          )}
        </div>
      </section>

     

      {/* Additional CSS for animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.1); }
          50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.2); }
        }
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}