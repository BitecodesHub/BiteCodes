import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import SyllabusClient from './SyllabusClient'

export const dynamic = 'force-dynamic'

interface SyllabusSection {
  id: number
  sectionName: string
  marks: number
  numberOfQuestions: number
  topicsCovered: string
}

interface Syllabus {
  id: number
  courseName: string
  totalMarks: number
  totalQuestions: number
  marksPerQuestion: number
  syllabusLink: string
  negativeMarking: number
  generalInstructions: string
  sections: SyllabusSection[]
}

interface PageProps {
  params: Promise<{ examSlug?: string }>
}

// ----------- Metadata Generator ------------
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { examSlug } = await params

  if (!examSlug) {
    return {
      title: 'Exam Syllabus - Complete Structure & Topics',
      description: 'Browse detailed entrance exam syllabus for competitive exams. Understand marking schemes, question formats, and topic coverage.',
    }
  }

  const formatted = examSlug.toUpperCase()
  const capitalized = examSlug.charAt(0).toUpperCase() + examSlug.slice(1)

  const title = `${formatted} Syllabus - Section-wise Marks, Topics & Pattern`
  const description = `Explore the full syllabus for ${capitalized} exam including topic-wise sections, marking scheme, number of questions, and key instructions.`

  return {
    title,
    description,
    keywords: [
      `${capitalized} syllabus`,
      `${capitalized} exam pattern`,
      `${capitalized} marks distribution`,
      `${capitalized} question pattern`,
      'entrance exam syllabus',
      'exam structure',
    ],
    openGraph: {
      title,
      description,
      url: `/syllabus/${examSlug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

// ----------- Fetch Data from API ------------
async function getSyllabus(slug: string): Promise<Syllabus | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/syllabus/${slug}`,
      {
        cache: 'no-store',
      }
    )
    if (!res.ok) return null
    return res.json()
  } catch (err) {
    console.error('Error fetching syllabus:', err)
    return null
  }
}

// ----------- Page Component ------------
export default async function SyllabusPage({ params }: PageProps) {
  const { examSlug } = await params

  if (!examSlug) return notFound()

  const syllabus = await getSyllabus(examSlug)

  if (!syllabus) return notFound()

  return <SyllabusClient syllabus={syllabus} />
}
