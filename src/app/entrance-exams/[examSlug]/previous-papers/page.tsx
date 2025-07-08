import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PreviousPapersClient from './PreviousPapersClient'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface PreviousPaper {
  id: string // Changed from number to string (UUID)
  examSlug: string
  year: number
  pdfUrl: string
  difficulty: string
  notes: string
  attemptedBy?: number // Added missing field
  topScore?: number // Added missing field
  totalQuestions?: number // Keep for future use
  duration?: string // Keep for future use
  maxMarks?: number // Keep for future use
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
  
  console.log('Fetching from URL:', url) // Debug logging
  
  try {
    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
    
    console.log('Response status:', res.status) // Debug logging
    
    if (!res.ok) {
      if (res.status === 404) {
        console.log('No papers found for slug:', slug)
        return []
      }
      throw new Error(`Failed to fetch previous papers: HTTP ${res.status}`)
    }
    
    const data = await res.json()
    console.log('Raw API response:', data) // Debug logging
    
    // Validate the response data structure
    if (!Array.isArray(data)) {
      console.error('Expected array but got:', typeof data)
      return []
    }
    
    const validatedPapers = data.filter((paper: any) => {
      // Updated validation to match backend structure
      const isValid = paper &&
        (typeof paper.id === 'string' || typeof paper.id === 'number') && // Accept both string and number
        typeof paper.examSlug === 'string' &&
        typeof paper.year === 'number' &&
        typeof paper.pdfUrl === 'string' &&
        typeof paper.difficulty === 'string' &&
        typeof paper.notes === 'string'
      
      if (!isValid) {
        console.warn('Invalid paper data:', paper)
      }
      
      return isValid
    }).map((paper: any) => ({
      ...paper,
      id: String(paper.id), // Convert ID to string for consistency
      // Ensure difficulty is properly formatted
      difficulty: paper.difficulty.toLowerCase(),
      // Ensure numeric fields are properly typed
      attemptedBy: paper.attemptedBy || undefined,
      topScore: paper.topScore || undefined,
      totalQuestions: paper.totalQuestions || undefined,
      maxMarks: paper.maxMarks || undefined
    }))
    
    console.log('Validated papers:', validatedPapers) // Debug logging
    return validatedPapers
    
  } catch (error) {
    console.error('Error fetching previous papers:', error)
    return []
  }
}

export default async function PreviousPapersPage({ params }: PageProps) {
  const { examSlug } = await params
  
  console.log('Page called with examSlug:', examSlug) // Debug logging
  
  // Validate examSlug
  if (!examSlug || typeof examSlug !== 'string' || examSlug.trim() === '') {
    console.error('Invalid examSlug:', examSlug)
    notFound()
  }
  
  // Sanitize examSlug (remove any potentially harmful characters)
  const sanitizedExamSlug = examSlug.toLowerCase().replace(/[^a-z0-9-]/g, '')
  if (sanitizedExamSlug !== examSlug.toLowerCase()) {
    console.error('examSlug contains invalid characters:', examSlug)
    notFound()
  }
  
  try {
    const papers = await getPreviousPapers(examSlug)
    console.log('Final papers to render:', papers.length) // Debug logging
    
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