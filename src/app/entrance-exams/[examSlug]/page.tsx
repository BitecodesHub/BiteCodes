import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, Clock, Users, BookOpen, FileText, Target, Award, IndianRupee, GraduationCap, Bell, MessageSquare, BarChart, ClipboardCheck, HelpCircle } from 'lucide-react'

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface BasicExamData {
  id: string;
  name: string;
  fullName: string | null;
  description: string;
  conductedBy: string;
  mode: string | null;
  difficulty: string;
  studentsAppear: string;
  examDate: string;
  applicationDeadline: string | null;
  subjects: string[];
  featured: boolean;
  duration?: string;
  totalQuestions?: number | null;
  totalMarks?: number;
  examPatternDuration?: string;
  ageLimit?: string;
  qualification?: string;
  minMarks?: string;
  generalFees?: number;
  scFees?: number;
  physicsTopics?: string[];
  chemistryTopics?: string[];
  mathematicsTopics?: string[];
  preparationTips?: string[];
}

interface ExamData extends BasicExamData {
  examDates?: {
    session1: string;
    session2?: string;
  };
  applicationDates?: {
    session1: string;
  };
  examPattern?: {
    totalQuestions: number;
    totalMarks: number;
    duration: string;
    sections: Array<{
      subject: string;
      questions: number;
      marks: number;
    }>;
  };
  eligibility?: {
    age: string;
    qualification: string;
    minMarks: string;
  };
  fees?: {
    general: number;
    sc: number;
  };
  syllabus?: {
    physics: string[];
    chemistry: string[];
    mathematics: string[];
  };
}

export async function generateMetadata({ params }: { params: Promise<{ examSlug: string }> }): Promise<Metadata> {
  const { examSlug } = await params;
  
  if (!examSlug || typeof examSlug !== 'string') {
    return {
      title: 'Exam Not Found - Complete Information & Preparation Guide',
      description: 'Comprehensive guide for entrance exams including syllabus, exam pattern, important dates, and preparation strategies.',
      keywords: ['entrance exam', 'syllabus', 'exam pattern', 'preparation', 'eligibility'],
    };
  }

  return {
    title: `${examSlug.toUpperCase()} - Complete Information & Preparation Guide`,
    description: `Comprehensive guide for ${examSlug.toUpperCase()} entrance exam including syllabus, exam pattern, important dates, and preparation strategies.`,
    keywords: [examSlug, 'entrance exam', 'syllabus', 'exam pattern', 'preparation', 'eligibility'],
  };
}

async function fetchExamDetail(slug: string): Promise<BasicExamData> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  // Add timestamp to prevent any potential caching issues
  const timestamp = Date.now();
  const url = `${apiUrl}/api/exams/${slug}?t=${timestamp}`;
  
  const res = await fetch(url, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    }
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`Exam not found for slug: ${slug}`);
    }
    throw new Error(`Failed to fetch exam details: HTTP ${res.status}`);
  }

  const data = await res.json();
  
  // Basic validation
  if (!data || !data.name || !data.id) {
    throw new Error('Invalid API response: Missing required fields');
  }

  return data as BasicExamData;
}

const transformExamData = (apiData: BasicExamData): ExamData => {
  return {
    ...apiData,
    fullName: apiData.fullName || apiData.name,
    mode: apiData.mode || 'Online',
    examDates: {
      session1: apiData.examDate,
      session2: undefined
    },
    applicationDates: {
      session1: apiData.applicationDeadline || 'TBD'
    },
    examPattern: {
      totalQuestions: apiData.totalQuestions || 90,
      totalMarks: apiData.totalMarks || 300,
      duration: apiData.duration || apiData.examPatternDuration || '3 hours',
      sections: apiData.subjects.map(subject => ({
        subject: subject,
        questions: Math.floor((apiData.totalQuestions || 90) / apiData.subjects.length),
        marks: Math.floor((apiData.totalMarks || 300) / apiData.subjects.length)
      }))
    },
    eligibility: {
      age: apiData.ageLimit || 'No age limit',
      qualification: apiData.qualification || '12th pass with PCM',
      minMarks: apiData.minMarks || '75% for General, 65% for SC/ST'
    },
    fees: {
      general: apiData.generalFees || 1000,
      sc: apiData.scFees || 500
    },
    syllabus: {
      physics: apiData.physicsTopics || ['Mechanics', 'Thermodynamics', 'Electromagnetism', 'Optics', 'Modern Physics'],
      chemistry: apiData.chemistryTopics || ['Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry'],
      mathematics: apiData.mathematicsTopics || ['Algebra', 'Trigonometry', 'Coordinate Geometry', 'Calculus', 'Statistics']
    }
  };
};

function formatDate(dateString: string): string {
  if (!dateString) return 'TBD';
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? 'TBD' : date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Mock data for new features
const relatedExams = [
  { name: 'JEE Main', slug: 'jee-main' },
  { name: 'NEET UG', slug: 'neet-ug' },
  { name: 'BITSAT', slug: 'bitsat' },
  { name: 'VITEEE', slug: 'viteee' },
];

export default async function ExamDetailPage({ params }: { params: Promise<{ examSlug: string }> }) {
  const { examSlug } = await params;
  
  if (!examSlug || typeof examSlug !== 'string') {
    notFound();
  }

  let examData: ExamData | null = null;
  let error: string | null = null;

  try {
    const apiExamData = await fetchExamDetail(examSlug);
    examData = transformExamData(apiExamData);
  } catch (err: any) {
    if (err.message.includes('Exam not found')) {
      notFound();
    }
    error = `Failed to load exam details for ${examSlug}. Please try again later.`;
  }

  if (error || !examData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <HelpCircle className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Exam Details</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity shadow-md"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-8 mb-8 shadow-xl">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                    {examData.name}
                  </h1>
                  <p className="text-blue-100 text-lg">
                    {examData.fullName}
                  </p>
                </div>
              </div>
              <p className="text-blue-100 text-lg leading-relaxed max-w-2xl">
                {examData.description}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={`/entrance-exams/${examSlug}/syllabus`}
                className="bg-white text-blue-600 px-6 py-3 rounded-xl font-medium hover:bg-blue-50 transition-colors shadow-md flex items-center gap-2"
              >
                <BookOpen className="w-5 h-5" />
                View Syllabus
              </Link>
              <Link
                href={`/entrance-exams/${examSlug}/mock-test`}
                className="bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-400 transition-colors shadow-md flex items-center gap-2"
              >
                <Target className="w-5 h-5" />
                Take Mock Test
              </Link>
              <Link
                href={`/entrance-exams/${examSlug}/previous-papers`}
                className="bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-400 transition-colors shadow-md flex items-center gap-2"
              >
                <FileText className="w-5 h-5" />
                Previous Papers
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Info */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <ClipboardCheck className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Quick Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Exam Date</p>
                      <p className="text-gray-600">{formatDate(examData.examDate)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Duration</p>
                      <p className="text-gray-600">{examData.duration}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Mode</p>
                      <p className="text-gray-600">{examData.mode}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Conducted By</p>
                      <p className="text-gray-600">{examData.conductedBy}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Students Appear</p>
                      <p className="text-gray-600">{examData.studentsAppear}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <BarChart className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Difficulty</p>
                      <p className="text-gray-600">{examData.difficulty}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Exam Pattern */}
            {examData.examPattern && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Exam Pattern</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {examData.examPattern.totalQuestions}
                    </div>
                    <div className="text-gray-600">Total Questions</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {examData.examPattern.totalMarks}
                    </div>
                    <div className="text-gray-600">Total Marks</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-xl">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {examData.examPattern.duration}
                    </div>
                    <div className="text-gray-600">Duration</div>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-900">Subject</th>
                        <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-900">Questions</th>
                        <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-900">Marks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {examData.examPattern.sections.map((section, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border border-gray-200 px-4 py-3 text-gray-900">{section.subject}</td>
                          <td className="border border-gray-200 px-4 py-3 text-gray-600">{section.questions}</td>
                          <td className="border border-gray-200 px-4 py-3 text-gray-600">{section.marks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Eligibility */}
            {examData.eligibility && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Eligibility Criteria</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-900 mb-1">Age Limit</p>
                      <p className="text-gray-600">{examData.eligibility.age}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-900 mb-1">Educational Qualification</p>
                      <p className="text-gray-600">{examData.eligibility.qualification}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-900 mb-1">Minimum Marks</p>
                      <p className="text-gray-600">{examData.eligibility.minMarks}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Application Fees */}
            {examData.fees && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <IndianRupee className="w-5 h-5 text-yellow-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Application Fees</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center p-6 bg-blue-50 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      General/OBC
                    </div>
                    <div className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-1">
                      <IndianRupee className="w-6 h-6" />
                      {examData.fees.general}
                    </div>
                  </div>
                  <div className="text-center p-6 bg-green-50 rounded-xl">
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      SC/ST
                    </div>
                    <div className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-1">
                      <IndianRupee className="w-6 h-6" />
                      {examData.fees.sc}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Syllabus Overview */}
            {examData.syllabus && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Syllabus Overview</h2>
                </div>
                
                <div className="space-y-6">
                  {examData.syllabus.physics && examData.syllabus.physics.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        </div>
                        Physics
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {examData.syllabus.physics.map((topic, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {examData.syllabus.chemistry && examData.syllabus.chemistry.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        </div>
                        Chemistry
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {examData.syllabus.chemistry.map((topic, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {examData.syllabus.mathematics && examData.syllabus.mathematics.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                          <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                        </div>
                        Mathematics
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {examData.syllabus.mathematics.map((topic, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Link
                    href={`/entrance-exams/${examSlug}/syllabus`}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity shadow-md"
                  >
                    <BookOpen className="w-5 h-5" />
                    View Detailed Syllabus
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Important Dates */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Important Dates</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Application Deadline</p>
                    <p className="text-gray-600">{formatDate(examData.applicationDeadline || '')}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Exam Date</p>
                    <p className="text-gray-600">{formatDate(examData.examDate)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center">
                <BarChart className="w-5 h-5 text-purple-600 mr-2" />
                Quick Actions
              </h3>
              <div className="space-y-4">
                <Link
                  href={`/entrance-exams/${examSlug}/mock-tests`}
                  prefetch={false}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center shadow-md"
                  aria-label={`Take mock test for ${examData.name}`}
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Take Mock Test
                </Link>
                <Link
                  href={`/entrance-exams/${examSlug}/study-material`}
                  prefetch={false}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white px-4 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center shadow-md"
                  aria-label={`View study material for ${examData.name}`}
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Study Material
                </Link>
                <Link
                  href={`/entrance-exams/${examSlug}/counseling`}
                  prefetch={false}
                  className="w-full bg-gradient-to-r from-purple-600 to-violet-700 text-white px-4 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center shadow-md"
                  aria-label={`View counseling info for ${examData.name}`}
                >
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Counseling Info
                </Link>
              </div>
            </div>
          </div>
        </div>

       
        {/* Related Exams */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Related Entrance Exams</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedExams.map((exam, index) => (
              <Link 
                href={`/entrance-exams/${exam.slug}`} 
                key={index}
                className="group"
                prefetch={false}
              >
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 group-hover:border-indigo-300 group-hover:shadow-xl transition-all h-full">
                  <h3 className="font-bold text-lg text-gray-800 group-hover:text-indigo-700 transition-colors mb-2">{exam.name}</h3>
                  <div className="flex items-center text-gray-600 group-hover:text-indigo-600 transition-colors">
                    <span className="text-sm">View details</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}