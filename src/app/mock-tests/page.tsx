import { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, Users, Clock, TrendingUp, Filter, Target, Award, Play } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mock Tests - Practice & Prepare for Entrance Exams',
  description: 'Practice with comprehensive mock tests for JEE, NEET, CUET, BITSAT and other entrance exams. Get detailed analytics and improve your scores.',
  keywords: ['mock tests', 'practice tests', 'JEE mock test', 'NEET mock test', 'online test', 'exam preparation'],
}

// Mock data - replace with real data from your database/API
const mockTests = [
  {
    id: 'jee-main-mock-1',
    name: 'JEE Main Mock Test 1',
    examType: 'JEE Main',
    description: 'Full-length mock test covering all topics with detailed solutions',
    duration: '180 minutes',
    questions: 90,
    totalMarks: 300,
    difficulty: 'High',
    attempts: '45K+',
    rating: 4.8,
    topics: ['Physics', 'Chemistry', 'Mathematics'],
    type: 'Full Length',
    price: 'Free',
    featured: true,
    testDate: '2024-01-20',
    language: ['English', 'Hindi'],
  },
  {
    id: 'neet-mock-1',
    name: 'NEET Mock Test 1',
    examType: 'NEET',
    description: 'Complete NEET pattern test with NCERT-based questions',
    duration: '200 minutes',
    questions: 180,
    totalMarks: 720,
    difficulty: 'High',
    attempts: '52K+',
    rating: 4.9,
    topics: ['Physics', 'Chemistry', 'Biology'],
    type: 'Full Length',
    price: 'Free',
    featured: true,
    testDate: '2024-01-25',
    language: ['English', 'Hindi'],
  },
  {
    id: 'cuet-mock-1',
    name: 'CUET Mock Test 1',
    examType: 'CUET',
    description: 'Domain-specific mock test for CUET preparation',
    duration: '135 minutes',
    questions: 60,
    totalMarks: 240,
    difficulty: 'Medium',
    attempts: '28K+',
    rating: 4.7,
    topics: ['General Test', 'Domain Subject'],
    type: 'Full Length',
    price: 'Free',
    featured: true,
    testDate: '2024-01-22',
    language: ['English', 'Hindi'],
  },
  {
    id: 'jee-advanced-mock-1',
    name: 'JEE Advanced Mock Test 1',
    examType: 'JEE Advanced',
    description: 'High-difficulty questions for JEE Advanced preparation',
    duration: '180 minutes',
    questions: 54,
    totalMarks: 306,
    difficulty: 'Very High',
    attempts: '22K+',
    rating: 4.6,
    topics: ['Physics', 'Chemistry', 'Mathematics'],
    type: 'Full Length',
    price: '₹99',
    featured: false,
    testDate: '2024-01-30',
    language: ['English'],
  },
  {
    id: 'bitsat-mock-1',
    name: 'BITSAT Mock Test 1',
    examType: 'BITSAT',
    description: 'Computer-based test simulation for BITSAT',
    duration: '180 minutes',
    questions: 150,
    totalMarks: 450,
    difficulty: 'High',
    attempts: '18K+',
    rating: 4.5,
    topics: ['Physics', 'Chemistry', 'Mathematics', 'English', 'Logical Reasoning'],
    type: 'Full Length',
    price: '₹49',
    featured: false,
    testDate: '2024-02-01',
    language: ['English'],
  },
  {
    id: 'neet-biology-sectional',
    name: 'NEET Biology Sectional Test',
    examType: 'NEET',
    description: 'Biology-focused sectional test for NEET aspirants',
    duration: '90 minutes',
    questions: 90,
    totalMarks: 360,
    difficulty: 'Medium',
    attempts: '35K+',
    rating: 4.7,
    topics: ['Botany', 'Zoology'],
    type: 'Sectional',
    price: 'Free',
    featured: false,
    testDate: '2024-01-28',
    language: ['English', 'Hindi'],
  },
]

export default function MockTestsPage() {
  const featuredTests = mockTests.filter(test => test.featured)
  const otherTests = mockTests.filter(test => !test.featured)
  const freeTests = mockTests.filter(test => test.price === 'Free')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Mock Tests 2024
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Practice with comprehensive mock tests for all major entrance exams. 
              Get detailed analytics, performance insights, and improve your scores.
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
                <div className="text-2xl font-bold">{mockTests.length}+</div>
                <div className="text-sm text-green-100">Mock Tests</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
                <div className="text-2xl font-bold">{freeTests.length}</div>
                <div className="text-sm text-green-100">Free Tests</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
                <div className="text-2xl font-bold">2L+</div>
                <div className="text-sm text-green-100">Test Attempts</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Tests */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Featured Mock Tests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTests.map((test) => (
              <Link key={test.id} href={`/mock-tests/${test.id}`} className="group">
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 hover:border-green-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-green-600">
                        {test.name}
                      </h3>
                      {test.price === 'Free' && (
                        <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-semibold">
                          FREE
                        </span>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      test.difficulty === 'Very High' ? 'bg-red-100 text-red-600' :
                      test.difficulty === 'High' ? 'bg-orange-100 text-orange-600' : 
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      {test.difficulty}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-semibold">
                      {test.examType}
                    </span>
                    <span className="ml-2 bg-purple-100 text-purple-600 px-2 py-1 rounded text-xs font-semibold">
                      {test.type}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 text-sm">{test.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-500">
                      <Target className="w-4 h-4 mr-2" />
                      {test.questions} Questions • {test.totalMarks} Marks
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      Duration: {test.duration}
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Users className="w-4 h-4 mr-2" />
                      {test.attempts} attempts
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Award className="w-4 h-4 mr-2" />
                      Rating: {test.rating}/5
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {test.language.join(', ')}
                      </span>
                      <div className="flex items-center space-x-2">
                        {test.price !== 'Free' && (
                          <span className="text-sm font-semibold text-gray-700">
                            {test.price}
                          </span>
                        )}
                        <span className="text-sm font-semibold text-green-600 flex items-center">
                          <Play className="w-4 h-4 mr-1" />
                          Start Test
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* All Tests */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">All Mock Tests</h2>
            <div className="flex space-x-3">
              <button className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
              <button className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50">
                <TrendingUp className="w-4 h-4" />
                <span>Sort</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherTests.map((test) => (
              <Link key={test.id} href={`/mock-tests/${test.id}`} className="group">
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 hover:border-green-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-green-600">
                        {test.name}
                      </h3>
                      {test.price === 'Free' && (
                        <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-semibold">
                          FREE
                        </span>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      test.difficulty === 'Very High' ? 'bg-red-100 text-red-600' :
                      test.difficulty === 'High' ? 'bg-orange-100 text-orange-600' : 
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      {test.difficulty}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-semibold">
                      {test.examType}
                    </span>
                    <span className="ml-2 bg-purple-100 text-purple-600 px-2 py-1 rounded text-xs font-semibold">
                      {test.type}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 text-sm">{test.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-500">
                      <Target className="w-4 h-4 mr-2" />
                      {test.questions} Questions • {test.totalMarks} Marks
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      Duration: {test.duration}
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Users className="w-4 h-4 mr-2" />
                      {test.attempts} attempts
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Award className="w-4 h-4 mr-2" />
                      Rating: {test.rating}/5
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {test.language.join(', ')}
                      </span>
                      <div className="flex items-center space-x-2">
                        {test.price !== 'Free' && (
                          <span className="text-sm font-semibold text-gray-700">
                            {test.price}
                          </span>
                        )}
                        <span className="text-sm font-semibold text-green-600 flex items-center">
                          <Play className="w-4 h-4 mr-1" />
                          Start Test
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Test Categories
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-xl font-bold text-gray-800">
                {mockTests.filter(t => t.type === 'Full Length').length}
              </div>
              <div className="text-sm text-gray-600">Full Length Tests</div>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Target className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-xl font-bold text-gray-800">
                {mockTests.filter(t => t.type === 'Sectional').length}
              </div>
              <div className="text-sm text-gray-600">Sectional Tests</div>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-xl font-bold text-gray-800">
                {freeTests.length}
              </div>
              <div className="text-sm text-gray-600">Free Tests</div>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-xl font-bold text-gray-800">
                {mockTests.filter(t => t.price !== 'Free').length}
              </div>
              <div className="text-sm text-gray-600">Premium Tests</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}