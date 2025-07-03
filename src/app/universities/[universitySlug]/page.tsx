import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin, BookOpen, Award, Globe, ArrowLeft, Play } from 'lucide-react'
import { universities, University } from '@/data/universities'

export async function generateMetadata({ 
  params 
}: {
  params: Promise<{ universitySlug: string }>
}): Promise<Metadata> {
  const { universitySlug } = await params
  const university = universities.find((uni) => uni.slug === universitySlug)

  if (!university) {
    return {
      title: 'University Not Found',
      description: 'The requested university could not be found.',
    }
  }

  return {
    title: `${university.name} - Admission Details`,
    description: university.description,
    keywords: [university.name, ...university.examsAccepted, 'university', 'admissions'],
    openGraph: {
      title: `${university.name} - Admission Details`,
      description: university.description,
      url: `/universities/${university.slug}`,
      type: 'website',
    },
  }
}

export default async function UniversityPage({ 
  params 
}: {
  params: Promise<{ universitySlug: string }>
}) {
  const { universitySlug } = await params
  const university = universities.find((uni) => uni.slug === universitySlug)

  if (!university) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/universities"
            aria-label="Navigate back to universities list"
            className="inline-flex items-center text-white hover:text-green-200 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Universities
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{university.name}</h1>
          <p className="text-xl text-green-100 max-w-3xl">{university.description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* University Details */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">University Details</h2>
              <div className="space-y-4 text-gray-600">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-3 text-green-600" />
                  <span><strong>Location:</strong> {university.location}</span>
                </div>
                <div className="flex items-center">
                  <Award className="w-5 h-5 mr-3 text-green-600" />
                  <span><strong>Ranking:</strong> {university.ranking}</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-3 text-green-600" />
                  <span><strong>Exams Accepted:</strong> {university.examsAccepted.join(', ')}</span>
                </div>
                <div className="flex items-center">
                  <Award className="w-5 h-5 mr-3 text-green-600" />
                  <span><strong>Established:</strong> {university.established}</span>
                </div>
                <div className="flex items-center">
                  <Globe className="w-5 h-5 mr-3 text-green-600" />
                  <Link
                    href={university.website}
                    aria-label={`Visit ${university.name} website`}
                    className="text-green-600 hover:text-green-700"
                  >
                    Visit Website
                  </Link>
                </div>
                <div className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-3 text-green-600" />
                  <Link
                    href={university.admissionLink}
                    aria-label={`View ${university.name} admission details`}
                    className="text-green-600 hover:text-green-700"
                  >
                    Admission Details
                  </Link>
                </div>
              </div>
            </div>

            {/* Programs Offered */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Programs Offered</h2>
              <div className="flex flex-wrap gap-2">
                {university.programs.map((program) => (
                  <span
                    key={program}
                    className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold"
                  >
                    {program}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-8">
            <Link
              href="/mock-tests"
              aria-label="Navigate to mock tests for exam preparation"
              className="flex items-center justify-center w-full md:w-auto bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Play className="w-5 h-5 mr-2" />
              Prepare with Mock Tests
            </Link>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">About {university.name}</h2>
          <p className="text-gray-600">
            {university.name} is a leading institution in {university.location}, established in {university.established}. 
            It is ranked #{university.ranking} in India and offers programs such as {university.programs.join(', ')}. 
            Admission is through {university.examsAccepted.join(', ')} exams. Prepare for these exams with our mock tests to secure your spot.
          </p>
        </div>
      </div>
    </div>
  )
}