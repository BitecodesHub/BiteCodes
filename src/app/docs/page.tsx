import { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, Target, Clock, Award, Play, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Exam Preparation - Study Resources & Tips',
  description: 'Access study tips, recommended resources, and mock tests to prepare effectively for JEE, NEET, CUET, BITSAT, and other entrance exams.',
  keywords: ['exam preparation', 'study tips', 'JEE preparation', 'NEET preparation', 'mock tests', 'study resources'],
  openGraph: {
    title: 'Exam Preparation - Study Resources & Tips',
    description: 'Access study tips, recommended resources, and mock tests to prepare effectively for JEE, NEET, CUET, BITSAT, and other entrance exams.',
    url: '/preparation',
    type: 'website',
  },
}

// Interfaces for type safety
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

// Sample preparation data - replace with real data from your database/API
const preparationTips: PreparationTip[] = [
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
]

const recommendedResources: RecommendedResource[] = [
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
]

export default function PreparationPage() {
  // Note: Replace static data with API calls if fetching dynamically
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Exam Preparation Hub
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Discover expert study tips, curated resources, and practice tests to excel in JEE, NEET, CUET, BITSAT, and more.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Preparation Tips */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Study Tips for Success</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {preparationTips.map((tip) => (
              <div key={tip.title} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:border-green-300">
                <div className="flex items-center mb-4">
                  <tip.icon className="w-8 h-8 text-green-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-800">{tip.title}</h3>
                </div>
                <p className="text-gray-600 text-sm">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Resources */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Recommended Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedResources.map((resource) => (
              <div key={resource.name} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:border-green-300">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{resource.name}</h3>
                <p className="text-gray-600 mb-4 text-sm">{resource.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {resource.examTypes.map((exam) => (
                    <span
                      key={exam}
                      className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-semibold"
                    >
                      {exam}
                    </span>
                  ))}
                </div>
                <Link
                  href={resource.link}
                  aria-label={`Access ${resource.name} resource`}
                  className="text-sm font-semibold text-green-600 flex items-center hover:text-green-700"
                >
                  <BookOpen className="w-4 h-4 mr-1" />
                  Get Resource
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Test Your Preparation?</h2>
          <p className="text-lg text-green-100 mb-6">
            Take our mock tests to evaluate your readiness and get detailed performance analytics.
          </p>
          <Link
            href="/mock-tests"
            aria-label="Navigate to mock tests page"
            className="inline-flex items-center bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Mock Tests
          </Link>
        </div>
      </div>
    </div>
  )
}