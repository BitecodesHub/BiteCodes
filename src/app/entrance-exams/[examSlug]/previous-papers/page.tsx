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

interface PageProps {
  params: Promise<{ examSlug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { examSlug } = await params
  
  return {
    title: `${examSlug.toUpperCase()} Previous Year Papers - Download & Practice`,
    description: `Download and practice with previous year question papers for ${examSlug.toUpperCase()}. Access PDF viewer, difficulty analysis, and exam insights.`,
    keywords: [examSlug, 'previous papers', 'question papers', 'pdf', 'practice', 'entrance exam'],
    openGraph: {
      title: `${examSlug.toUpperCase()} Previous Year Papers`,
      description: `Download and practice with previous year question papers for ${examSlug.toUpperCase()}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${examSlug.toUpperCase()} Previous Year Papers`,
      description: `Download and practice with previous year question papers for ${examSlug.toUpperCase()}`,
    },
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
      },
    })
    
    if (!res.ok) {
      if (res.status === 404) {
        return []
      }
      throw new Error(`Failed to fetch previous papers: HTTP ${res.status}`)
    }
    
    const data = await res.json()
    
    // Validate the response data structure
    if (!Array.isArray(data)) {
      console.error('Expected array but got:', typeof data)
      return []
    }
    
    return data.filter((paper: any) => 
      paper && 
      typeof paper.id === 'number' && 
      typeof paper.examSlug === 'string' && 
      typeof paper.year === 'number' && 
      typeof paper.pdfUrl === 'string' && 
      typeof paper.difficulty === 'string' && 
      typeof paper.notes === 'string'
    )
  } catch (error) {
    console.error('Error fetching previous papers:', error)
    return []
  }
}

export default async function PreviousPapersPage({ params }: PageProps) {
  const { examSlug } = await params
  
  // Validate examSlug
  if (!examSlug || typeof examSlug !== 'string' || examSlug.trim() === '') {
    notFound()
  }
  
  // Sanitize examSlug (remove any potentially harmful characters)
  const sanitizedExamSlug = examSlug.toLowerCase().replace(/[^a-z0-9-]/g, '')
  
  if (sanitizedExamSlug !== examSlug.toLowerCase()) {
    notFound()
  }
  
  try {
    const papers = await getPreviousPapers(examSlug)
    
    return (
      <PreviousPapersClient
        examSlug={examSlug}
        papers={papers}
      />
    )
  } catch (error) {
    console.error('Error in PreviousPapersPage:', error)
    // Return empty papers array on error instead of crashing
    return (
      <PreviousPapersClient
        examSlug={examSlug}
        papers={[]}
      />
    )
  }
}