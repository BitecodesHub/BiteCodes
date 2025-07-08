import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, BookOpen, Play } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ universitySlug: string; courseSlug: string }>
}): Promise<Metadata> {
  const { universitySlug, courseSlug } = await params
  const response = await fetch(`http://localhost:8080/api/universities/${universitySlug}/${courseSlug}`, {
    cache: 'no-store',
  })
  if (!response.ok) {
    return {
      title: 'Course Not Found',
      description: 'The requested course could not be found.',
    }
  }
  const course = await response.json()

  return {
    title: `${course.name} - Course Details`,
    description: course.description,
    keywords: [course.name, 'course', 'admissions'],
    openGraph: {
      title: `${course.name} - Course Details`,
      description: course.description,
      url: `/universities/${universitySlug}/${courseSlug}`,
      type: 'website',
    },
  }
}

interface Course {
  slug: string
  name: string
  description: string
  examSlug: string
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ universitySlug: string; courseSlug: string }>
}) {
  const { universitySlug, courseSlug } = await params
  const response = await fetch(`http://localhost:8080/api/universities/${universitySlug}/${courseSlug}`, {
    cache: 'no-store',
  })
  if (!response.ok) {
    notFound()
  }
  const course: Course = await response.json()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href={`/universities/${universitySlug}`}
            aria-label="Navigate back to university details"
            className="inline-flex items-center text-white hover:text-green-200 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to University
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.name}</h1>
          <p className="text-xl text-green-100 max-w-3xl">{course.description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Course Details</h2>
          <div className="space-y-4 text-gray-600">
            <p><strong>Name:</strong> {course.name}</p>
            <p><strong>Description:</strong> {course.description}</p>
            <div className="flex items-center">
              <BookOpen className="w-5 h-5 mr-3 text-green-600" />
              <Link
                href={`/entrance-exams/${course.examSlug}`}
                aria-label={`View details for ${course.examSlug} exam`}
                className="text-green-600 hover:text-green-700"
              >
                Entrance Exam: {course.examSlug}
              </Link>
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
      </div>
    </div>
  )
}