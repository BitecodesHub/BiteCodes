import { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Users, Clock, TrendingUp, Target, Award, Play } from "lucide-react";
import { Suspense } from "react";

// Enable ISR with revalidation every hour
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Mock Tests - Practice & Prepare for Entrance Exams",
  description:
    "Practice with comprehensive mock tests for JEE, NEET, CUET, BITSAT and other entrance exams. Get detailed analytics and improve your scores.",
  keywords: ["mock tests", "practice tests", "JEE mock test", "NEET mock test", "online test", "exam preparation"],
  openGraph: {
    title: "Mock Tests - Practice & Prepare for Entrance Exams",
    description: "Practice with comprehensive mock tests for JEE, NEET, CUET, BITSAT and other entrance exams.",
    url: "/mock-tests",
    type: "website",
  },
};


interface MockTest {
  id: string;
  name: string;
  examType: string;
  description: string;
  duration: string;
  questions: number;
  totalMarks: number;
  difficulty: string;
  attempts: string;
  rating: number;
  topics: string[];
  type: string;
  price: string;
  featured: boolean;
  testDate: string;
  language?: string[];
}

// Skeleton Components
function MockTestCardSkeleton() {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md p-6 border border-slate-200/50 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-40"></div>
        <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl w-20"></div>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-16"></div>
        <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-20"></div>
        <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-16"></div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-md w-full"></div>
        <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-md w-5/6"></div>
        <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-md w-2/3"></div>
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
        <div className="flex items-center">
          <div className="w-5 h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg mr-2"></div>
          <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-md w-28"></div>
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-md w-24"></div>
          <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-md w-20"></div>
        </div>
      </div>
    </div>
  );
}

function MockTestGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <MockTestCardSkeleton key={i} />
      ))}
    </div>
  );
}

function HeroStatsSkeleton() {
  return (
    <div className="mt-8 flex justify-center space-x-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 animate-pulse border border-white/20"
        >
          <div className="h-6 bg-white/30 rounded-lg w-8 mb-1"></div>
          <div className="h-3 bg-white/30 rounded-md w-16"></div>
        </div>
      ))}
    </div>
  );
}

async function fetchMockTests(): Promise<MockTest[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const res = await fetch(`${apiUrl}/api/exams`, {
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch mock tests: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  if (!Array.isArray(data)) {
    throw new Error("Invalid API response: Expected an array");
  }

  return data as MockTest[];
}

// Get difficulty configuration for professional colors
function getDifficultyConfig(difficulty: string) {
  switch (difficulty) {
    case "Very High":
      return {
        bg: "bg-gradient-to-r from-red-50 to-red-100",
        text: "text-red-700",
        border: "border-red-200",
      };
    case "High":
      return {
        bg: "bg-gradient-to-r from-amber-50 to-amber-100",
        text: "text-amber-700",
        border: "border-amber-200",
      };
    case "Medium":
      return {
        bg: "bg-gradient-to-r from-blue-50 to-blue-100",
        text: "text-blue-700",
        border: "border-blue-200",
      };
    default:
      return {
        bg: "bg-gradient-to-r from-emerald-50 to-emerald-100",
        text: "text-emerald-700",
        border: "border-emerald-200",
      };
  }
}

// Get price configuration
function getPriceConfig(price: string) {
  if (price === "Free") {
    return {
      bg: "bg-gradient-to-r from-emerald-50 to-emerald-100",
      text: "text-emerald-700",
      border: "border-emerald-200",
    };
  }
  return {
    bg: "bg-gradient-to-r from-amber-50 to-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
  };
}

// Hero Stats Component
async function HeroStats() {
  try {
    const mockTests = await fetchMockTests();
    const freeTests = mockTests.filter((test) => test.price === "Free");
    const featuredTests = mockTests.filter((test) => test.featured);

    return (
      <div className="mt-8 flex justify-center space-x-4">
        <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20 hover:bg-white/25 transition-all duration-300">
          <div className="text-2xl font-bold text-white">{mockTests.length}</div>
          <div className="text-sm text-blue-100 font-medium">Mock Tests</div>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20 hover:bg-white/25 transition-all duration-300">
          <div className="text-2xl font-bold text-white">{freeTests.length}</div>
          <div className="text-sm text-blue-100 font-medium">Free Tests</div>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20 hover:bg-white/25 transition-all duration-300">
          <div className="text-2xl font-bold text-white">{featuredTests.length}</div>
          <div className="text-sm text-blue-100 font-medium">Featured</div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("HeroStats: Error fetching mock tests:", error);
    return <HeroStatsSkeleton />;
  }
}

// Mock Test Card Component
function MockTestCard({ test }: { test: MockTest }) {
  const difficultyConfig = getDifficultyConfig(test.difficulty);
  const priceConfig = getPriceConfig(test.price);

  return (
    <Link href={`/mock-tests/${test.id}`} className="group" aria-label={`Start ${test.name}`}>
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 p-6 border border-slate-200/50 hover:border-blue-300/50 transform hover:-translate-y-1 hover:scale-[1.02] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-slate-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-700 transition-colors leading-tight">
              {test.name}
            </h3>
            <span
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap ${difficultyConfig.bg} ${difficultyConfig.text} ${difficultyConfig.border} border shadow-sm transform group-hover:scale-105 transition-transform duration-300`}
            >
              {test.difficulty}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-2.5 py-1 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg text-xs font-semibold border border-blue-200">
              {test.examType}
            </span>
            <span className="px-2.5 py-1 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded-lg text-xs font-semibold border border-purple-200">
              {test.type}
            </span>
            <span
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${priceConfig.bg} ${priceConfig.text} ${priceConfig.border}`}
            >
              {test.price}
            </span>
          </div>
          <p className="text-slate-600 group-hover:text-slate-700 mb-4 text-sm leading-relaxed transition-colors">
            {test.description}
          </p>
          <div className="space-y-3 text-sm">
            <div className="flex items-center text-slate-500 group-hover:text-slate-600 transition-colors">
              <div className="p-1 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg mr-2">
                <Target className="w-3 h-3 text-white" />
              </div>
              <span className="font-medium">
                {test.questions} Questions • {test.totalMarks} Marks
              </span>
            </div>
            <div className="flex items-center text-slate-500 group-hover:text-slate-600 transition-colors">
              <div className="p-1 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg mr-2">
                <Clock className="w-3 h-3 text-white" />
              </div>
              <span className="font-medium">Duration: {test.duration}</span>
            </div>
            <div className="flex items-center text-slate-500 group-hover:text-slate-600 transition-colors">
              <div className="p-1 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg mr-2">
                <Users className="w-3 h-3 text-white" />
              </div>
              <span className="font-medium">{test.attempts} attempts</span>
            </div>
            <div className="flex items-center text-slate-500 group-hover:text-slate-600 transition-colors">
              <div className="p-1 bg-gradient-to-r from-amber-600 to-amber-700 rounded-lg mr-2">
                <Award className="w-3 h-3 text-white" />
              </div>
              <span className="font-medium">Rating: {test.rating}/5</span>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 font-medium">
                {test.language?.length ? test.language.join(", ") : "Not specified"}
              </span>
              <span className="text-sm font-semibold text-blue-600 flex items-center group-hover:text-blue-700 transition-colors">
                <Play className="w-4 h-4 mr-1" />
                Start Test
              </span>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 to-slate-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-sm"></div>
      </div>
    </Link>
  );
}

// Featured Tests Content Component
async function FeaturedTestsContent() {
  try {
    const mockTests = await fetchMockTests();
    const featuredTests = mockTests.filter((test) => test.featured);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredTests.map((test) => (
          <MockTestCard key={test.id} test={test} />
        ))}
      </div>
    );
  } catch (error) {
    console.error("FeaturedTestsContent: Error fetching mock tests:", error);
    return null;
  }
}


export default function MockTestsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="bg-gradient-to-r from-slate-800 via-green-800 to-slate-800 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-400/10 to-slate-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-slate-400/10 to-green-400/10 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Mock Tests <span className="text-green-400">2025</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed font-light">
              Practice with comprehensive mock tests for all major entrance exams.{" "}
              <span className="text-green-400 font-semibold">Get detailed analytics and improve your scores.</span>
            </p>
            <Suspense fallback={<HeroStatsSkeleton />}>
              <HeroStats />
            </Suspense>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Featured Mock Tests</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Handpicked tests to help you prepare effectively for your exams
            </p>
          </div>
          <Suspense fallback={<MockTestGridSkeleton />}>
            <FeaturedTestsContent />
          </Suspense>
        </div>
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-800">All Mock Tests</h2>
          </div>
      
        </div>
      </div>
    </div>
  );
}