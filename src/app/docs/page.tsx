import { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, Target, Clock, Award, Play, CheckCircle, Users, Calendar } from 'lucide-react'
import { Suspense } from 'react'
import { ExamsErrorUI } from './ExamsErrorUI';

// Enable ISR with revalidation every hour
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Exam Preparation - Study Resources & Tips',
  description: 'Access study tips, recommended resources, and mock tests to prepare effectively for JEE, NEET, CUET, BITSAT, and other entrance exams.',
  keywords: ['exam preparation', 'study tips', 'JEE preparation', 'NEET preparation', 'mock tests', 'study resources'],
  openGraph: {
    title: 'Exam Preparation - Study Resources & Tips',
    description: 'Access study tips, recommended resources, and mock tests to prepare effectively for JEE, NEET, CUET, BITSAT, and other entrance exams.',
    url: '/docs',
    type: 'website',
  },
}

interface Exam {
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
}

interface PreparationTip {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

interface RecommendedResource {
  name: string
  description: string
  link: string
  examTypes: string[]
}

// Skeleton Components
function PreparationTipSkeleton() {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md p-6 border border-slate-200/50 animate-pulse">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg mr-3"></div>
        <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-48"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-md w-full"></div>
        <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-md w-5/6"></div>
        <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-md w-4/6"></div>
      </div>
    </div>
  );
}

function ResourceCardSkeleton() {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md p-6 border border-slate-200/50 animate-pulse">
      <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-40 mb-4"></div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-md w-full"></div>
        <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-md w-5/6"></div>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded-md w-16"></div>
        <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded-md w-20"></div>
      </div>
      <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-md w-24"></div>
    </div>
  );
}

function ExamCardSkeleton() {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md p-6 border border-slate-200/50 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-32"></div>
        <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full w-16"></div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-md w-full"></div>
        <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-md w-3/4"></div>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded mr-2"></div>
          <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-md w-32"></div>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded mr-2"></div>
          <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-md w-28"></div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-md w-20"></div>
          <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-md w-24"></div>
        </div>
      </div>
    </div>
  );
}

function HeroStatsSkeleton() {
  return (
    <div className="mt-8 flex justify-center space-x-4">
      <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 animate-pulse border border-white/20">
        <div className="h-6 bg-white/30 rounded-lg w-8 mb-1"></div>
        <div className="h-3 bg-white/30 rounded-md w-16"></div>
      </div>
      <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 animate-pulse border border-white/20">
        <div className="h-6 bg-white/30 rounded-lg w-8 mb-1"></div>
        <div className="h-3 bg-white/30 rounded-md w-16"></div>
      </div>
      <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 animate-pulse border border-white/20">
        <div className="h-6 bg-white/30 rounded-lg w-8 mb-1"></div>
        <div className="h-3 bg-white/30 rounded-md w-16"></div>
      </div>
    </div>
  );
}

async function fetchExams(): Promise<Exam[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend.bitecodes.com';
  const res = await fetch(`${apiUrl}/api/exams`, {
    signal: AbortSignal.timeout(10000),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch exams: ${res.status} ${res.statusText}`);
  }
  
  const data = await res.json();
  if (!Array.isArray(data)) {
    throw new Error('Invalid API response: Expected an array');
  }
  
  return data as Exam[];
}

async function fetchPreparationTips(): Promise<PreparationTip[]> {
  return [
    {
      title: 'Create a Study Schedule',
      description: 'Plan your study time effectively by allocating specific hours for each subject. Stick to a consistent routine to cover all topics systematically.',
      icon: Clock,
    },
    {
      title: 'Practice with Mock Tests',
      description: 'Take regular mock tests to simulate exam conditions, improve time management, and identify weak areas for improvement.',
      icon: Play,
    },
    {
      title: 'Focus on Conceptual Clarity',
      description: 'Understand core concepts rather than memorizing. Use NCERT books and reference materials to build a strong foundation.',
      icon: BookOpen,
    },
    {
      title: 'Track Your Progress',
      description: 'Analyze your mock test results to monitor improvement and focus on areas where you need more practice.',
      icon: Award,
    },
    {
      title: 'Stay Consistent',
      description: 'Dedicate daily time to revision and practice to maintain momentum and avoid last-minute cramming.',
      icon: CheckCircle,
    },
  ];
}

async function fetchRecommendedResources(): Promise<RecommendedResource[]> {
  return [
    {
      name: 'NCERT Textbooks',
      description: 'Essential for JEE, NEET, and CUET preparation, covering core concepts in Physics, Chemistry, Biology, and Mathematics.',
      link: '#',
      examTypes: ['JEE Main', 'NEET', 'CUET'],
    },
    {
      name: 'HC Verma - Concepts of Physics',
      description: 'A must-have for JEE aspirants to master Physics concepts and problem-solving.',
      link: '#',
      examTypes: ['JEE Main', 'JEE Advanced'],
    },
    {
      name: 'RD Sharma - Mathematics',
      description: 'Comprehensive resource for Mathematics practice, ideal for JEE and BITSAT preparation.',
      link: '#',
      examTypes: ['JEE Main', 'JEE Advanced', 'BITSAT'],
    },
    {
      name: 'MTG NEET Guide',
      description: 'Complete guide with practice questions and solutions for NEET aspirants.',
      link: '#',
      examTypes: ['NEET'],
    },
    {
      name: 'Arihant CUET Prep Books',
      description: 'Domain-specific books tailored for CUET preparation, covering General Test and subject areas.',
      link: '#',
      examTypes: ['CUET'],
    },
  ];
}

// Get difficulty configuration for professional colors
function getDifficultyConfig(difficulty: string) {
  if (difficulty === 'High') return {
    bg: "bg-gradient-to-r from-red-50 to-red-100",
    text: "text-red-700",
    border: "border-red-200"
  };
  if (difficulty === 'Medium') return {
    bg: "bg-gradient-to-r from-amber-50 to-amber-100",
    text: "text-amber-700",
    border: "border-amber-200"
  };
  return {
    bg: "bg-gradient-to-r from-emerald-50 to-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200"
  };
}

// Hero Stats Component
async function HeroStats() {
  try {
    const exams = await fetchExams();
    const totalSubjects = exams.reduce((acc, exam) => acc + (exam.subjects?.length || 0), 0);
    const upcomingExams = exams.filter(exam => {
      const examDate = new Date(exam.examDate);
      return examDate > new Date();
    }).length;

    return (
      <div className="mt-8 flex justify-center space-x-4">
        <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20 hover:bg-white/25 transition-all duration-300">
          <div className="text-2xl font-bold text-white">{exams.length}</div>
          <div className="text-sm text-blue-100 font-medium">Exams</div>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20 hover:bg-white/25 transition-all duration-300">
          <div className="text-2xl font-bold text-white">{totalSubjects}</div>
          <div className="text-sm text-blue-100 font-medium">Subjects</div>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20 hover:bg-white/25 transition-all duration-300">
          <div className="text-2xl font-bold text-white">{upcomingExams}</div>
          <div className="text-sm text-blue-100 font-medium">Upcoming</div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('HeroStats: Error fetching exams:', error);
    return <HeroStatsSkeleton />;
  }
}

// Exam Card Component
function ExamCard({ exam }: { exam: Exam }) {
  const difficultyConfig = getDifficultyConfig(exam.difficulty);
  const examDate = new Date(exam.examDate);
  const isUpcoming = examDate > new Date();
  
  return (
    <Link
      href={`/entrance-exams/${exam.id}/study-material`}
      className="group"
      aria-label={`View study material for ${exam.name}`}
    >
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 p-6 border border-slate-200/50 hover:border-blue-300/50 transform hover:-translate-y-1 hover:scale-[1.02] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-slate-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-700 transition-colors leading-tight">
              {exam.name}
            </h3>
            <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap ${difficultyConfig.bg} ${difficultyConfig.text} ${difficultyConfig.border} border shadow-sm transform group-hover:scale-105 transition-transform duration-300`}>
              {exam.difficulty}
            </span>
          </div>
          <p className="text-slate-600 group-hover:text-slate-700 mb-4 text-sm leading-relaxed transition-colors">
            {exam.description}
          </p>
          <div className="space-y-3 text-sm">
            <div className="flex items-center text-slate-500 group-hover:text-slate-600 transition-colors">
              <div className="p-1 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg mr-2">
                <Users className="w-3 h-3 text-white" />
              </div>
              <span className="font-medium">{exam.studentsAppear} students</span>
            </div>
            <div className="flex items-center text-slate-500 group-hover:text-slate-600 transition-colors">
              <div className="p-1 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg mr-2">
                <Calendar className="w-3 h-3 text-white" />
              </div>
              <span className="font-medium">
                {isUpcoming ? 'Upcoming: ' : 'Date: '}
                {examDate.toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center text-slate-500 group-hover:text-slate-600 transition-colors">
              <div className="p-1 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg mr-2">
                <BookOpen className="w-3 h-3 text-white" />
              </div>
              <span className="font-medium">
                Subjects: {exam.subjects?.join(', ') || 'NA'}
              </span>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-blue-600 flex items-center group-hover:text-blue-700 transition-colors">
                <Play className="w-4 h-4 mr-1" />
                Study Material
              </span>
              <span className="text-sm text-slate-500 font-medium">
                By {exam.conductedBy}
              </span>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 to-slate-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-sm"></div>
      </div>
    </Link>
  );
}

// Preparation Tip Component
function PreparationTipCard({ tip }: { tip: PreparationTip }) {
  const IconComponent = tip.icon;
  
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-md p-6 border border-slate-200/50 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center mb-4">
        <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg mr-3">
          <IconComponent className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">{tip.title}</h3>
      </div>
      <p className="text-slate-600 text-sm leading-relaxed">{tip.description}</p>
    </div>
  );
}

// Resource Card Component
function ResourceCard({ resource }: { resource: RecommendedResource }) {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-md p-6 border border-slate-200/50 hover:shadow-lg transition-all duration-300">
      <h3 className="text-xl font-bold text-slate-800 mb-2">{resource.name}</h3>
      <p className="text-slate-600 mb-4 text-sm leading-relaxed">{resource.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {resource.examTypes.map((exam) => (
          <span
            key={exam}
            className="px-2.5 py-1 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg text-xs font-semibold border border-blue-200"
          >
            {exam}
          </span>
        ))}
      </div>
      <Link
        href={resource.link}
        aria-label={`Access ${resource.name} resource`}
        className="text-sm font-semibold text-blue-600 flex items-center hover:text-blue-700 transition-colors"
      >
        <BookOpen className="w-4 h-4 mr-1" />
        Get Resource
      </Link>
    </div>
  );
}

// Featured Exams Content Component
async function FeaturedExamsContent() {
  try {
    const exams = await fetchExams();
    const featuredExams = exams;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredExams.map((exam) => (
          <ExamCard key={exam.id} exam={exam} />
        ))}
      </div>
    );
  } catch (error) {
    console.error('FeaturedExamsContent: Error fetching exams:', error);
    return <ExamsErrorUI />;
  }
}

// Preparation Tips Content Component
async function PreparationTipsContent() {
  try {
    const preparationTips = await fetchPreparationTips();

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {preparationTips.map((tip) => (
          <PreparationTipCard key={tip.title} tip={tip} />
        ))}
      </div>
    );
  } catch (error) {
    console.error('PreparationTipsContent: Error fetching preparation tips:', error);
    return (
      <div className="text-center py-8">
        <div className="bg-red-50/90 backdrop-blur-sm border border-red-200/50 rounded-2xl p-6 max-w-md mx-auto shadow-md">
          <h3 className="text-red-800 font-bold text-lg mb-3">Failed to Load Preparation Tips</h3>
          <p className="text-red-600 text-sm mb-4 leading-relaxed">
            We're having trouble loading the preparation tips. Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }
}

export default function PreparationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-800 via-green-800 to-slate-800 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-400/10 to-slate-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-slate-400/10 to-green-400/10 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Exam Preparation <span className="text-green-400">Hub</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed font-light">
              Discover expert study tips, curated resources, and practice tests to excel in{' '}
              <span className="text-green-400 font-semibold">JEE, NEET, CUET, BITSAT, and more</span>.
            </p>
            <Suspense fallback={<HeroStatsSkeleton />}>
              <HeroStats />
            </Suspense>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured Exams */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Featured Exams
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Explore study materials for the most popular entrance exams
            </p>
          </div>
          <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><ExamCardSkeleton /><ExamCardSkeleton /><ExamCardSkeleton /></div>}>
            <FeaturedExamsContent />
          </Suspense>
        </div>

        {/* Preparation Tips */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Study Tips for Success
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Expert advice to help you prepare effectively and maximize your scores
            </p>
          </div>
          <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><PreparationTipSkeleton /><PreparationTipSkeleton /><PreparationTipSkeleton /></div>}>
            <PreparationTipsContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}