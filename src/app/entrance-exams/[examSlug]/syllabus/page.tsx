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

async function getSyllabus(slug: string): Promise<Syllabus | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/syllabus/${slug}`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    return res.json()
  } catch (err) {
    console.error('Error fetching syllabus:', err)
    return null
  }
}

interface PageProps {
  params: Promise<{ examSlug?: string }>
}

export default async function SyllabusPage({ params }: PageProps) {
  const { examSlug } = await params
  
  if (!examSlug) return notFound()
  
  const syllabus = await getSyllabus(examSlug)
  
  if (!syllabus) return notFound()
  
  return <SyllabusClient syllabus={syllabus} />
}