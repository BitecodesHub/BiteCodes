// src/app/entrance-exams/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, Users, Clock, TrendingUp, Filter } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Entrance Exams - Complete List & Details',
  description: 'Comprehensive information about all major entrance exams in India including JEE, NEET, CUET, BITSAT and more. Get exam dates, syllabus, and preparation tips.',
  keywords: ['entrance exams', 'JEE', 'NEET', 'CUET', 'BITSAT', 'exam dates', 'syllabus', 'preparation'],
}

// Mock data - replace with real data from your database/API
const entranceExams = [
  {
    id: 'jee-main',
    name: 'JEE Main',
    fullName: 'Joint Entrance Examination Main',
    description: 'Gateway to NITs, IIITs, and other engineering colleges',
    studentsAppear: '12L+',
    difficulty: 'High',
    examDate: '2024-01-24',
    applicationDeadline: '2024-01-15',
    conductedBy: 'NTA',
    mode: 'Online',
    subjects: ['Physics', 'Chemistry', 'Mathematics'],
    featured: true,
  },
  {
    id: 'neet',
    name: 'NEET',
    fullName: 'National Eligibility cum Entrance Test',
    description: 'Medical entrance exam for MBBS, BDS, and other medical courses',
    studentsAppear: '18L+',
    difficulty: 'High',
    examDate: '2024-05-05',
    applicationDeadline: '2024-04-15',
    conductedBy: 'NTA',
    mode: 'Offline',
    subjects: ['Physics', 'Chemistry', 'Biology'],
    featured: true,
  },
  // Add more exams...
]

export default function EntranceExamsPage() {
  const featuredExams = entranceExams.filter(exam => exam.featured)
  const otherExams = entranceExams.filter(exam => !exam.featured)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Entrance Exams 2024
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Complete information about all major entrance exams in India. Get exam dates, 
              syllabus, eligibility criteria, and preparation strategies.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Exams */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Most Popular Exams</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredExams.map((exam) => (
              <Link key={exam.id} href={`/entrance-exams/${exam.id}`} className="group">
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 hover:border-blue-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600">
                      {exam.name}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      exam.difficulty === 'High' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {exam.difficulty}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 text-sm">{exam.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-500">
                      <Users className="w-4 h-4 mr-2" />
                      {exam.studentsAppear} students appear
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      Exam Date: {new Date(exam.examDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-gray-500">
                      <BookOpen className="w-4 h-4 mr-2" />
                      {exam.subjects.join(', ')}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">By {exam.conductedBy}</span>
                      <span className="text-sm font-semibold text-blue-600">
                        View Details →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* All Exams */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">All Entrance Exams</h2>
            <button className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherExams.map((exam) => (
              <Link key={exam.id} href={`/entrance-exams/${exam.id}`} className="group">
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 hover:border-blue-300">
                  {/* Similar structure as featured exams */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600">
                      {exam.name}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      exam.difficulty === 'High' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {exam.difficulty}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 text-sm">{exam.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-500">
                      <Users className="w-4 h-4 mr-2" />
                      {exam.studentsAppear} students appear
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      Exam Date: {new Date(exam.examDate).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="text-sm font-semibold text-blue-600">
                      View Details →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}