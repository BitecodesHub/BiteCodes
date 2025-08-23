import { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, MapPin, Award, Play } from 'lucide-react'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Universities - Top Institutes for Higher Education',
  description: 'Explore top universities like DAU, NIRMA, NFSU for undergraduate and postgraduate programs.',
  keywords: ['universities', 'NFSU', 'DAU', 'DAIICT', 'NIRMA', 'higher education'],
  openGraph: {
    title: 'Universities - Top Institutes for Higher Education',
    description: 'Explore top universities like DAU, NIRMA, NFSU for undergraduate and postgraduate programs.',
    url: '/universities',
    type: 'website',
  },
}

interface University {
  slug: string
  name: string
  description: string
  location: string
  ranking: number
  established: number
  website: string
  admissionLink: string
  examsAccepted: string[]
  courses: { slug: string; name: string }[]
}

// Skeleton Components
function UniversityCardSkeleton() {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md p-6 border border-slate-200/50 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-48"></div>
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
          <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-md w-40"></div>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded mr-2"></div>
          <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-md w-24"></div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-md w-24"></div>
        </div>
      </div>
    </div>
  );
}

function UniversityGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <UniversityCardSkeleton key={i} />
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

async function fetchUniversities(): Promise<University[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  const response = await fetch(`${apiUrl}/api/universities`, { 
    signal: AbortSignal.timeout(10000), // 10 second timeout
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch universities: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error('Invalid API response: Expected an array');
  }
  
  return data as University[];
}

// Hero Stats Component
async function HeroStats() {
  try {
    const universities = await fetchUniversities();
    const totalPrograms = universities.reduce((acc, uni) => acc + uni.courses.length, 0);

    return (
      <div className="mt-8 flex justify-center space-x-4">
        <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20 hover:bg-white/25 transition-all duration-300">
          <div className="text-2xl font-bold text-white">{universities.length}</div>
          <div className="text-sm text-blue-100 font-medium">Universities</div>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20 hover:bg-white/25 transition-all duration-300">
          <div className="text-2xl font-bold text-white">{totalPrograms}</div>
          <div className="text-sm text-blue-100 font-medium">Programs</div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('HeroStats: Error fetching universities:', error);
    return <HeroStatsSkeleton />;
  }
}

// Get ranking configuration for professional colors
function getRankingConfig(ranking: number) {
  if (ranking <= 10) return {
    display: `Top ${ranking}`,
    bg: "bg-gradient-to-r from-amber-50 to-amber-100",
    text: "text-amber-700",
    border: "border-amber-200"
  };
  if (ranking <= 50) return {
    display: `Rank ${ranking}`,
    bg: "bg-gradient-to-r from-blue-50 to-blue-100",
    text: "text-blue-700",
    border: "border-blue-200"
  };
  return {
    display: `Rank ${ranking}+`,
    bg: "bg-gradient-to-r from-slate-50 to-slate-100",
    text: "text-slate-700",
    border: "border-slate-200"
  };
}

// Universities Content Component
async function UniversitiesContent() {
  try {
    const universities = await fetchUniversities();

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {universities.map((university) => {
          const rankingConfig = getRankingConfig(university.ranking);
          
          return (
            <Link
              key={university.slug}
              href={`/universities/${university.slug}`}
              aria-label={`View details for ${university.name}`}
              className="group"
            >
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 p-6 border border-slate-200/50 hover:border-blue-300/50 transform hover:-translate-y-1 hover:scale-[1.02] relative overflow-hidden">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-slate-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-700 transition-colors leading-tight">
                      {university.name}
                    </h3>
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap ${rankingConfig.bg} ${rankingConfig.text} ${rankingConfig.border} border shadow-sm transform group-hover:scale-105 transition-transform duration-300`}>
                      {rankingConfig.display}
                    </span>
                  </div>
                  
                  <p className="text-slate-600 group-hover:text-slate-700 mb-4 text-sm leading-relaxed transition-colors">
                    {university.description}
                  </p>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center text-slate-500 group-hover:text-slate-600 transition-colors">
                      <div className="p-1 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg mr-2">
                        <MapPin className="w-3 h-3 text-white" />
                      </div>
                      <span className="font-medium">{university.location}</span>
                    </div>
                    
                    <div className="flex items-start text-slate-500 group-hover:text-slate-600 transition-colors">
                      <div className="p-1 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg mr-2 mt-0.5">
                        <BookOpen className="w-3 h-3 text-white" />
                      </div>
                      <div>
                        <span className="font-medium">Exams: </span>
                        <span className="text-blue-600 font-semibold">
                          {university.examsAccepted.join(', ')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-slate-500 group-hover:text-slate-600 transition-colors">
                      <div className="p-1 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg mr-2">
                        <Award className="w-3 h-3 text-white" />
                      </div>
                      <span className="font-medium">Established: {university.established}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-blue-600 flex items-center group-hover:text-blue-700 transition-colors">
                        <Play className="w-4 h-4 mr-1" />
                        View Details
                      </span>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">
                          {university.courses.length} courses
                        </div>
                      </div>
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
  } catch (error) {
    console.error('UniversitiesContent: Error fetching universities:', error);
    return (
      <div className="text-center py-12">
        <div className="bg-red-50/90 backdrop-blur-sm border border-red-200/50 rounded-2xl p-8 max-w-md mx-auto shadow-md">
          <h3 className="text-red-800 font-bold text-lg mb-3">Failed to Load Universities</h3>
          <p className="text-red-600 text-sm mb-6 leading-relaxed">
            We're having trouble loading the university data. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
}

export default function UniversitiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-800 via-blue-800 to-slate-800 text-white py-20 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-slate-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-slate-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Top Universities <span className="text-blue-400">2025</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed font-light">
              Discover leading institutes offering programs through{' '}
              <span className="text-blue-400 font-semibold">CMAT, NFAT</span>.{' '}
              Prepare with our mock tests to secure your admission.
            </p>
            
            {/* Hero Stats with Suspense */}
            <Suspense fallback={<HeroStatsSkeleton />}>
              <HeroStats />
            </Suspense>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Universities List - Static heading with suspended content */}
        <div className="mb-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Featured Universities
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Explore prestigious institutions and find your perfect academic match
            </p>
          </div>
          
          <Suspense fallback={<UniversityGridSkeleton />}>
            <UniversitiesContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}