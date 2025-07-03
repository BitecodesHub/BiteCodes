import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Clock, Target, Users, Award, BookOpen, Languages, DollarSign, Play, ArrowLeft } from 'lucide-react'

// Mock data - should match the data in mock-tests/page.tsx
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

interface MockTestPageProps {
  params: {
    'exam-id': string
  }
}

export async function generateMetadata({ params }: MockTestPageProps): Promise<Metadata> {
  const test = mockTests.find((test) => test.id === params['exam-id'])
  
  if (!test) {
    return {
      title: 'Mock Test Not Found',
      description: 'The requested mock test could not be found.',
    }
  }

  return {
    title: `${test.name} - Practice & Prepare`,
    description: test.description,
    keywords: [test.examType, 'mock test', 'practice test', 'exam preparation', ...test.topics],
  }
}

export default function MockTestPage({ params }: MockTestPageProps) {
  const test = mockTests.find((test) => test.id === params['exam-id'])

  if (!test) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/mock-tests" className="inline-flex items-center text-white hover:text-green-200 mb-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Mock Tests
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{test.name}</h1>
          <p className="text-xl text-green-100 max-w-3xl">{test.description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Test Details */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Test Details</h2>
              <div className="space-y-4 text-gray-600">
                <div className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-3 text-green-600" />
                  <span><strong>Exam:</strong> {test.examType}</span>
                </div>
                <div className="flex items-center">
                  <Target className="w-5 h-5 mr-3 text-green-600" />
                  <span><strong>{test.questions}</strong> Questions • <strong>{test.totalMarks}</strong> Marks</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-3 text-green-600" />
                  <span><strong>Duration:</strong> {test.duration}</span>
                </div>
                <div className="flex items-center">
                  <Award className="w-5 h-5 mr-3 text-green-600" />
                  <span><strong>Difficulty:</strong> {test.difficulty}</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-3 text-green-600" />
                  <span><strong>Attempts:</strong> {test.attempts}</span>
                </div>
                <div className="flex items-center">
                  <Award className="w-5 h-5 mr-3 text-green-600" />
                  <span><strong>Rating:</strong> {test.rating}/5</span>
                </div>
                <div className="flex items-center">
                  <Languages className="w-5 h-5 mr-3 text-green-600" />
                  <span><strong>Languages:</strong> {test.language.join(', ')}</span>
                </div>
                {test.price !== 'Free' && (
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-3 text-green-600" />
                    <span><strong>Price:</strong> {test.price}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Topics Covered */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Topics Covered</h2>
              <div className="flex flex-wrap gap-2">
                {test.topics.map((topic) => (
                  <span
                    key={topic}
                    className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-8">
            <button className="flex items-center justify-center w-full md:w-auto bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
              <Play className="w-5 h-5 mr-2" />
              Start Test
            </button>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">About This Test</h2>
          <p className="text-gray-600">
            This <strong>{test.name}</strong> is designed to simulate the actual {test.examType} exam experience. 
            It covers all relevant topics including {test.topics.join(', ')} and provides detailed solutions 
            to help you understand your performance. Take this test to gauge your preparation level and identify 
            areas for improvement.
          </p>
        </div>
      </div>
    </div>
  )
}