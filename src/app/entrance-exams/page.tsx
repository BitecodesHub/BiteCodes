import { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, Users, Clock, Filter, ChevronRight, MapPin, Award, Play } from 'lucide-react'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Entrance Exams - Complete List & Details',
  description: 'Comprehensive information about all major entrance exams in India including NFSU, DAIICT, CMAT and more. Get exam dates, syllabus, and preparation tips.',
  keywords: ['entrance exams', 'CMAT', 'DAIICT', 'NFSU','exam dates', 'syllabus', 'preparation'],
  openGraph: {
    title: 'Entrance Exams - Complete List & Details',
    description: 'Comprehensive information about all major entrance exams in India including NFSU, DAIICT, CMAT and more.',
    url: '/entrance-exams',
    type: 'website',
  },
}

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
}

// Skeleton Components
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
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded mr-2"></div>
          <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-md w-40"></div>
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

function ExamGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <ExamCardSkeleton key={i} />
      ))}
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
    </div>
  );
}

async function fetchExams(): Promise<EntranceExam[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend.bitecodes.com';
    const res = await fetch(`${apiUrl}/api/exams`, {
      cache: 'no-store',
      // Removed timeout signal as it can cause issues
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch exams: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();
    if (!Array.isArray(data)) {
      throw new Error('Invalid API response: Expected an array');
    }
    
    return data as EntranceExam[];
  } catch (error) {
    console.error('Error fetching exams:', error);
    // Return mock data as fallback
    return [
      {
        id: 'nfsu',
        name: 'NFSU',
        fullName: 'National Forensic Sciences University Entrance Exam',
        description: 'Entrance exam for forensic science programs at NFSU.',
        conductedBy: 'National Forensic Sciences University',
        mode: 'Online',
        difficulty: 'High',
        studentsAppear: '10,000+',
        examDate: '2024-05-15',
        applicationDeadline: '2024-04-15',
        subjects: ['Forensic Science', 'Biology', 'Chemistry'],
        featured: true
      },
      {
        id: 'daiict',
        name: 'DAIICT',
        fullName: 'DAIICT Entrance Exam',
        description: 'Entrance exam for ICT programs at DAIICT.',
        conductedBy: 'DAIICT',
        mode: 'Online',
        difficulty: 'Medium',
        studentsAppear: '5,000+',
        examDate: '2024-06-10',
        applicationDeadline: '2024-05-10',
        subjects: ['Mathematics', 'Physics', 'Logical Reasoning'],
        featured: true
      },
      {
        id: 'cmat',
        name: 'CMAT',
        fullName: 'Common Management Admission Test',
        description: 'National level entrance exam for management programs.',
        conductedBy: 'NTA',
        mode: 'Online',
        difficulty: 'Medium',
        studentsAppear: '70,000+',
        examDate: '2024-01-25',
        applicationDeadline: '2024-01-10',
        subjects: ['Quantitative Techniques', 'Logical Reasoning', 'Language Comprehension', 'General Awareness'],
        featured: true
      }
    ];
  }
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'TBD' : date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return 'TBD';
  }
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

// Exam Card Component
function ExamCard({ exam }: { exam: EntranceExam }) {
  const difficultyConfig = getDifficultyConfig(exam.difficulty);
  
  return (
    <Link
      href={`/entrance-exams/${exam.id}`}
      prefetch={false}
      className="group"
      aria-label={`View details for ${exam.name}`}
    >
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 p-6 border border-slate-200/50 hover:border-blue-300/50 transform hover:-translate-y-1 hover:scale-[1.02] relative overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-slate-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Content */}
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
                <Clock className="w-3 h-3 text-white" />
              </div>
              <span className="font-medium">Exam Date: {formatDate(exam.examDate)}</span>
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
                View Details
              </span>
              <span className="text-sm text-slate-500 font-medium">
                By {exam.conductedBy}
              </span>
            </div>
          </div>
        </div>

        {/* Animated border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 to-slate-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-sm"></div>
      </div>
    </Link>
  );
}

// Hero Stats Component
async function HeroStats() {
  try {
    const exams = await fetchExams();
    const totalSubjects = exams.reduce((acc, exam) => acc + (exam.subjects?.length || 0), 0);

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
      </div>
    );
  } catch (error) {
    console.error('HeroStats: Error fetching exams:', error);
    return <HeroStatsSkeleton />;
  }
}

// Featured Exams Content Component
async function FeaturedExamsContent() {
  try {
    const exams = await fetchExams();
    const featuredExams = exams.filter((exam) => exam.featured);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredExams.map((exam) => (
          <ExamCard key={exam.id} exam={exam} />
        ))}
      </div>
    );
  } catch (error) {
    console.error('FeaturedExamsContent: Error fetching exams:', error);
    return (
      <div className="text-center py-12">
        <div className="bg-red-50/90 backdrop-blur-sm border border-red-200/50 rounded-2xl p-8 max-w-md mx-auto shadow-md">
          <h3 className="text-red-800 font-bold text-lg mb-3">Failed to Load Featured Exams</h3>
          <p className="text-red-600 text-sm mb-6 leading-relaxed">
            We're having trouble loading the featured exam data. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}

// All Exams Content Component
async function AllExamsContent() {
  try {
    const exams = await fetchExams();
    const otherExams = exams.filter((exam) => !exam.featured);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {otherExams.map((exam) => (
          <ExamCard key={exam.id} exam={exam} />
        ))}
      </div>
    );
  } catch (error) {
    console.error('AllExamsContent: Error fetching exams:', error);
    return (
      <div className="text-center py-12">
        <div className="bg-red-50/90 backdrop-blur-sm border border-red-200/50 rounded-2xl p-8 max-w-md mx-auto shadow-md">
          <h3 className="text-red-800 font-bold text-lg mb-3">Failed to Load All Exams</h3>
          <p className="text-red-600 text-sm mb-6 leading-relaxed">
            We're having trouble loading the exam data. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}

export default function EntranceExamsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-800 via-purple-800 to-slate-800 text-white py-20 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-slate-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-slate-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Entrance Exams <span className="text-purple-400">2025</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed font-light">
              Comprehensive information about all major entrance exams in India.{' '}
              <span className="text-purple-400 font-semibold">Get exam dates, syllabus, and preparation tips.</span>
            </p>
            
            {/* Hero Stats with Suspense */}
            <Suspense fallback={<HeroStatsSkeleton />}>
              <HeroStats />
            </Suspense>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured Exams - Static heading with suspended content */}
        <div className="mb-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Most Popular Exams
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Discover the most sought-after entrance exams and start your preparation journey
            </p>
          </div>
          
          <Suspense fallback={<ExamGridSkeleton />}>
            <FeaturedExamsContent />
          </Suspense>
        </div>

        {/* All Exams - Static heading with suspended content */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-800">All Entrance Exams</h2>
            <button
              className="flex items-center text-slate-700 space-x-2 bg-white/90 backdrop-blur-sm border border-slate-200/50 rounded-xl px-4 py-2.5 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md"
              aria-label="Filter exams"
              disabled
            >
              <Filter className="w-4 h-4" />
              <span className="text-slate-700 font-medium">Filter</span>
            </button>
          </div>
          
          <Suspense fallback={<ExamGridSkeleton />}>
            <AllExamsContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}