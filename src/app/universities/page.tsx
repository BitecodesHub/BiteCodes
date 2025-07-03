import { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, MapPin, Award, Play } from 'lucide-react'
import { universities, University } from '@/data/universities'

export const metadata: Metadata = {
  title: 'Universities - Top Institutes for Higher Education',
  description: 'Explore top universities accepting JEE, NEET, CUET, and BITSAT for undergraduate and postgraduate programs.',
  keywords: ['universities', 'JEE', 'NEET', 'CUET', 'BITSAT', 'higher education'],
  openGraph: {
    title: 'Universities - Top Institutes for Higher Education',
    description: 'Explore top universities accepting JEE, NEET, CUET, and BITSAT for undergraduate and postgraduate programs.',
    url: '/universities',
    type: 'website',
  },
}

export default function UniversitiesPage() {
  // Note: Replace static data with API calls if fetching dynamically
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Top Universities 2025
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Discover leading institutes offering programs through JEE, NEET, CUET, and BITSAT. Prepare with our mock tests to secure your admission.
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
                <div className="text-2xl font-bold">{universities.length}</div>
                <div className="text-sm text-green-100">Universities</div>
              </div>
              <div className="bg-white/20backdrop-blur-sm rounded-lg px-6 py-3">
                <div className="text-2xl font-bold">{universities.reduce((acc, uni) => acc + uni.programs.length, 0)}</div>
                <div className="text-sm text-green-100">Programs</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Universities List */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Featured Universities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {universities.map((university: University) => (
              <Link
                key={university.slug}
                href={`/universities/${university.slug}`}
                aria-label={`View details for ${university.name}`}
                className="group"
              >
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 hover:border-green-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-green-600">
                      {university.name}
                    </h3>
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-semibold">
                      Rank {university.ranking}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">{university.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-500">
                      <MapPin className="w-4 h-4 mr-2" />
                      {university.location}
                    </div>
                    <div className="flex items-center text-gray-500">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Exams: {university.examsAccepted.join(', ')}
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Award className="w-4 h-4 mr-2" />
                      Established: {university.established}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-green-600 flex items-center">
                        <Play className="w-4 h-4 mr-1" />
                        View Details
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Prepare for University Admissions</h2>
          <p className="text-lg text-green-100 mb-6">
            Practice with our mock tests to ace the entrance exams for these top universities.
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