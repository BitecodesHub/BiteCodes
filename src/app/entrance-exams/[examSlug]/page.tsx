// src/app/entrance-exams/[examSlug]/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, Users, BookOpen, FileText, Target, Award, IndianRupee, GraduationCap } from 'lucide-react'

interface Props {
  params: {
    examSlug: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // In a real app, you'd fetch the exam data here
  const examSlug = params.examSlug
  
  return {
    title: `${examSlug.toUpperCase()} - Complete Information & Preparation Guide`,
    description: `Comprehensive guide for ${examSlug.toUpperCase()} entrance exam including syllabus, exam pattern, important dates, and preparation strategies.`,
    keywords: [examSlug, 'entrance exam', 'syllabus', 'exam pattern', 'preparation', 'eligibility'],
  }
}

export default function ExamDetailPage({ params }: Props) {
  const { examSlug } = params
  
  // Mock data - replace with actual data fetching
  const examData = {
    name: 'JEE Main',
    fullName: 'Joint Entrance Examination Main',
    description: 'JEE Main is a national-level entrance examination for admission to undergraduate engineering programs at NITs, IIITs, and other centrally funded technical institutions.',
    conductedBy: 'National Testing Agency (NTA)',
    frequency: 'Twice a year',
    mode: 'Computer Based Test (CBT)',
    duration: '3 hours',
    examDates: {
      session1: '2024-01-24 to 2024-02-01',
      session2: '2024-04-04 to 2024-04-15',
    },
    applicationDates: {
      session1: '2024-01-01 to 2024-01-15',
      session2: '2024-03-01 to 2024-03-20',
    },
    eligibility: {
      age: 'No age limit',
      qualification: '12th pass with PCM',
      minMarks: '75% (65% for SC/ST)',
    },
    examPattern: {
      totalQuestions: 90,
      totalMarks: 300,
      duration: '3 hours',
      sections: [
        { subject: 'Physics', questions: 30, marks: 100 },
        { subject: 'Chemistry', questions: 30, marks: 100 },
        { subject: 'Mathematics', questions: 30, marks: 100 },
      ],
    },
    fees: {
      general: 650,
      obc: 650,
      sc: 325,
      st: 325,
    },
    syllabus: {
      physics: ['Mechanics', 'Thermodynamics', 'Waves & Optics', 'Electricity & Magnetism', 'Modern Physics'],
      chemistry: ['Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry'],
      mathematics: ['Algebra', 'Coordinate Geometry', 'Calculus', 'Trigonometry', 'Statistics & Probability']
    },
    preparationTips: [
      'Start with NCERT books for strong fundamentals',
      'Practice previous year question papers regularly',
      'Take mock tests to improve speed and accuracy',
      'Focus on weak areas and revise regularly',
      'Stay updated with exam pattern changes'
    ]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {examData.name}
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              {examData.fullName}
            </p>
            <p className="text-lg text-blue-100 mb-8">
              {examData.description}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link 
                href={`/entrance-exams/${examSlug}/syllabus`}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                View Syllabus
              </Link>
              <Link 
                href={`/mock-tests/${examSlug}`}
                className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
              >
                Take Mock Test
              </Link>
              <Link 
                href={`/entrance-exams/${examSlug}/previous-papers`}
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
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
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Exam Date</p>
                    <p className="font-semibold">{examData.examDates.session1}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-semibold">{examData.duration}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Mode</p>
                    <p className="font-semibold">{examData.mode}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Conducted By</p>
                    <p className="font-semibold">{examData.conductedBy}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Exam Pattern */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Exam Pattern</h2>
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{examData.examPattern.totalQuestions}</p>
                    <p className="text-sm text-gray-600">Total Questions</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{examData.examPattern.totalMarks}</p>
                    <p className="text-sm text-gray-600">Total Marks</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{examData.examPattern.duration}</p>
                    <p className="text-sm text-gray-600">Duration</p>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Subject</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Questions</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {examData.examPattern.sections.map((section, index) => (
                      <tr key={index} className="border-t border-gray-200">
                        <td className="px-4 py-3 font-medium">{section.subject}</td>
                        <td className="px-4 py-3">{section.questions}</td>
                        <td className="px-4 py-3">{section.marks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Eligibility */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Eligibility Criteria</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Age Limit</h3>
                  <p className="text-gray-600">{examData.eligibility.age}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Educational Qualification</h3>
                  <p className="text-gray-600">{examData.eligibility.qualification}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Minimum Marks</h3>
                  <p className="text-gray-600">{examData.eligibility.minMarks}</p>
                </div>
              </div>
            </div>

            {/* Application Fees */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Application Fees</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">General/OBC</span>
                  <span className="flex items-center font-bold text-green-600">
                    <IndianRupee className="w-4 h-4 mr-1" />
                    {examData.fees.general}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">SC/ST</span>
                  <span className="flex items-center font-bold text-green-600">
                    <IndianRupee className="w-4 h-4 mr-1" />
                    {examData.fees.sc}
                  </span>
                </div>
              </div>
            </div>

            {/* Syllabus Overview */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Syllabus Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold text-blue-600 mb-3">Physics</h3>
                  <ul className="space-y-2">
                    {examData.syllabus.physics.map((topic, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-green-600 mb-3">Chemistry</h3>
                  <ul className="space-y-2">
                    {examData.syllabus.chemistry.map((topic, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-purple-600 mb-3">Mathematics</h3>
                  <ul className="space-y-2">
                    {examData.syllabus.mathematics.map((topic, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t">
                <Link 
                  href={`/entrance-exams/${examSlug}/syllabus`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  View Detailed Syllabus
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Important Dates */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Important Dates</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Application (Session 1)</p>
                    <p className="text-xs text-gray-600">{examData.applicationDates.session1}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Exam (Session 1)</p>
                    <p className="text-xs text-gray-600">{examData.examDates.session1}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium">Exam (Session 2)</p>
                    <p className="text-xs text-gray-600">{examData.examDates.session2}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Preparation Tips */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Preparation Tips</h3>
              <div className="space-y-3">
                {examData.preparationTips.map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Target className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-600">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link 
                  href={`/entrance-exams/${examSlug}/mock-tests`}
                  className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Take Mock Test
                </Link>
                <Link 
                  href={`/entrance-exams/${examSlug}/study-material`}
                  className="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Study Material
                </Link>
                <Link 
                  href={`/entrance-exams/${examSlug}/counseling`}
                  className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center"
                >
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Counseling Info
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}