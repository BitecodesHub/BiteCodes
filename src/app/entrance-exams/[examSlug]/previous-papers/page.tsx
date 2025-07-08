import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PreviousPapersClient from './PreviousPapersClient'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface PreviousPaper {
  id: number
  examSlug: string
  year: number
  pdfUrl: string
  difficulty: string
  notes: string
  totalQuestions?: number
  duration?: string
  maxMarks?: number
}

interface Props {
  params: Promise<{ examSlug: string }> | { examSlug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params)
  const { examSlug } = resolvedParams

  return {
    title: `${examSlug.toUpperCase()} Previous Year Papers - Download & Practice`,
    description: `Download and practice with previous year question papers for ${examSlug.toUpperCase()}. Access PDF viewer, difficulty analysis, and exam insights.`,
    keywords: [examSlug, 'previous papers', 'question papers', 'pdf', 'practice', 'entrance exam'],
  }
}

async function getPreviousPapers(slug: string): Promise<PreviousPaper[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
  const timestamp = Date.now()
  const url = `${apiUrl}/api/previous-papers/${slug}?t=${timestamp}`
  
  try {
    const res = await fetch(url, { 
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    })

    if (!res.ok) {
      if (res.status === 404) {
        return []
      }
      throw new Error(`Failed to fetch previous papers: HTTP ${res.status}`)
    }

    return await res.json()
  } catch (error) {
    console.error('Error fetching previous papers:', error)
    return []
  }
}

export default async function PreviousPapersPage({ params }: Props) {
  const resolvedParams = await Promise.resolve(params)
  const { examSlug } = resolvedParams

  if (!examSlug || typeof examSlug !== 'string') {
    notFound()
  }

  const papers = await getPreviousPapers(examSlug)

  return (
    <PreviousPapersClient
      examSlug={examSlug}
      papers={papers}
    />
  )
}