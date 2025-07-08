import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, Clock, Users, BookOpen, FileText, Target, Award, IndianRupee, GraduationCap, Bell, MessageSquare, BarChart, ClipboardCheck, HelpCircle } from 'lucide-react'

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Props {
  params: Promise<{ examSlug: string }> | { examSlug: string };
}

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const { examSlug } = resolvedParams;

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


export default async function ExamDetailPage({ params }: Props) {
  const resolvedParams = await Promise.resolve(params);
  const { examSlug } = resolvedParams;

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md bg-white rounded-2xl shadow-xl p-8">
          <div className="text-red-600 text-xl mb-6 font-medium">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity shadow-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              {examData.name}
            </h1>
            <p className="text-xl text-blue-100 mb-6 opacity-90">
              {examData.fullName}
            </p>
            <p className="text-lg text-blue-100 mb-8 max-w-3xl opacity-90">
              {examData.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={`/entrance-exams/${examSlug}/syllabus`}
                prefetch={false}
                className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg flex items-center"
                aria-label={`View syllabus for ${examData.name}`}
              >
                <BookOpen className="w-5 h-5 mr-2" />
                View Syllabus
              </Link>
              <Link
                href={`/mock-tests/${examSlug}`}
                prefetch={false}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg flex items-center"
                aria-label={`Take mock test for ${examData.name}`}
              >
                <FileText className="w-5 h-5 mr-2" />
                Take Mock Test
              </Link>
              <Link
                href={`/entrance-exams/${examSlug}/previous-papers`}
                prefetch={false}
                className="border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors flex items-center"
                aria-label={`View previous papers for ${examData.name}`}
              >
                <ClipboardCheck className="w-5 h-5 mr-2" />
                Previous Papers
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Info */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <BarChart className="w-6 h-6 text-blue-600 mr-2" />
                Quick Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Exam Date</p>
                    <p className="font-bold text-gray-900">{formatDate(examData.examDate)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Duration</p>
                    <p className="font-bold text-gray-900">{examData.duration}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-xl">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Mode</p>
                    <p className="font-bold text-gray-900">{examData.mode}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-xl">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Conducted By</p>
                    <p className="font-bold text-gray-900">{examData.conductedBy}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-red-50 rounded-xl">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Students Appear</p>
                    <p className="font-bold text-gray-900">{examData.studentsAppear}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-xl">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Difficulty</p>
                    <p className="font-bold text-gray-900">{examData.difficulty}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Exam Pattern */}
            {examData.examPattern && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <ClipboardCheck className="w-6 h-6 text-indigo-600 mr-2" />
                  Exam Pattern
                </h2>
                <div className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                      <p className="text-2xl font-bold text-blue-600">{examData.examPattern.totalQuestions}</p>
                      <p className="text-sm text-gray-700 font-medium">Total Questions</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                      <p className="text-2xl font-bold text-green-600">{examData.examPattern.totalMarks}</p>
                      <p className="text-sm text-gray-700 font-medium">Total Marks</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-100">
                      <p className="text-2xl font-bold text-purple-600">{examData.examPattern.duration}</p>
                      <p className="text-sm text-gray-700 font-medium">Duration</p>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                        <th className="px-4 py-3 text-left text-sm font-semibold">Subject</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Questions</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Marks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {examData.examPattern.sections.map((section, index) => (
                        <tr 
                          key={index} 
                          className={`border-t border-gray-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                        >
                          <td className="px-4 py-3 font-medium text-gray-900">{section.subject}</td>
                          <td className="px-4 py-3 text-gray-800">{section.questions}</td>
                          <td className="px-4 py-3 text-gray-800">{section.marks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Eligibility */}
            {examData.eligibility && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <GraduationCap className="w-6 h-6 text-amber-600 mr-2" />
                  Eligibility Criteria
                </h2>
                <div className="space-y-6">
                  <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-100">
                    <h3 className="font-semibold text-gray-700 mb-2">Age Limit</h3>
                    <p className="text-gray-800 font-medium">{examData.eligibility.age}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <h3 className="font-semibold text-gray-700 mb-2">Educational Qualification</h3>
                    <p className="text-gray-800 font-medium">{examData.eligibility.qualification}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <h3 className="font-semibold text-gray-700 mb-2">Minimum Marks</h3>
                    <p className="text-gray-800 font-medium">{examData.eligibility.minMarks}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Application Fees */}
            {examData.fees && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <IndianRupee className="w-6 h-6 text-green-600 mr-2" />
                  Application Fees
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">General/OBC</span>
                      <span className="flex items-center font-bold text-green-700">
                        <IndianRupee className="w-5 h-5 mr-1" />
                        {examData.fees.general}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">SC/ST</span>
                      <span className="flex items-center font-bold text-blue-700">
                        <IndianRupee className="w-5 h-5 mr-1" />
                        {examData.fees.sc}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Syllabus Overview */}
            {examData.syllabus && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <BookOpen className="w-6 h-6 text-purple-600 mr-2" />
                  Syllabus Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {examData.syllabus.physics && examData.syllabus.physics.length > 0 && (
                    <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                      <h3 className="font-semibold text-blue-700 mb-3 text-lg">Physics</h3>
                      <ul className="space-y-3">
                        {examData.syllabus.physics.map((topic, index) => (
                          <li 
                            key={index} 
                            className="text-gray-800 flex items-start"
                          >
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {examData.syllabus.chemistry && examData.syllabus.chemistry.length > 0 && (
                    <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                      <h3 className="font-semibold text-green-700 mb-3 text-lg">Chemistry</h3>
                      <ul className="space-y-3">
                        {examData.syllabus.chemistry.map((topic, index) => (
                          <li 
                            key={index} 
                            className="text-gray-800 flex items-start"
                          >
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {examData.syllabus.mathematics && examData.syllabus.mathematics.length > 0 && (
                    <div className="p-5 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-100">
                      <h3 className="font-semibold text-purple-700 mb-3 text-lg">Mathematics</h3>
                      <ul className="space-y-3">
                        {examData.syllabus.mathematics.map((topic, index) => (
                          <li 
                            key={index} 
                            className="text-gray-800 flex items-start"
                          >
                            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <Link
                    href={`/entrance-exams/${examSlug}/syllabus`}
                    prefetch={false}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-lg"
                    aria-label={`View detailed syllabus for ${examData.name}`}
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    View Detailed Syllabus
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Important Dates */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center">
                <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                Important Dates
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm font-medium text-gray-700">Application Deadline</p>
                  <p className="text-lg font-bold text-gray-900">{formatDate(examData.applicationDeadline || '')}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl">
                  <p className="text-sm font-medium text-gray-700">Exam Date</p>
                  <p className="text-lg font-bold text-gray-900">{formatDate(examData.examDate)}</p>
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