'use client'

import React, { useState, useEffect } from 'react'
import { 
  FileText, 
  Download, 
  Eye, 
  Calendar, 
  TrendingUp, 
  BookOpen, 
  X, 
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize,
  ExternalLink,
  Clock,
  Award,
  Target,
  Search,
  Filter,
  Grid,
  List,
  AlertCircle,
  CheckCircle,
  Users,
  Star,
  Copy,
  Share2,
  Printer,
  RefreshCw,
  Minimize
} from 'lucide-react'

interface PreviousPaper {
  id: string
  examSlug: string
  year: number
  pdfUrl: string
  difficulty: string
  notes: string
  attemptedBy?: number
  topScore?: number
  totalQuestions?: number
  duration?: string
  maxMarks?: number
  tags?: string[]
  fileSize?: string
  uploadDate?: string
}

interface Props {
  examSlug: string
  papers: PreviousPaper[]
}

function getDifficultyColor(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'from-emerald-400 to-green-500'
    case 'medium':
      return 'from-amber-400 to-orange-500'
    case 'hard':
      return 'from-red-400 to-pink-500'
    default:
      return 'from-blue-400 to-indigo-500'
  }
}

function getDifficultyIcon(difficulty: string) {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return <CheckCircle className="w-4 h-4" />
    case 'medium':
      return <Target className="w-4 h-4" />
    case 'hard':
      return <Award className="w-4 h-4" />
    default:
      return <BookOpen className="w-4 h-4" />
  }
}

// Enhanced PDF Viewer Component
function PDFViewer({ pdfUrl, onClose, paperTitle }: { pdfUrl: string; onClose: () => void; paperTitle: string }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [pdfError, setPdfError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadAttempts, setLoadAttempts] = useState(0)
  const [viewMode, setViewMode] = useState<'embed' | 'google' | 'download'>('embed')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'f' || e.key === 'F') handleFullscreen()
      if (e.key === '+' || e.key === '=') handleZoomIn()
      if (e.key === '-') handleZoomOut()
      if (e.key === 'r' || e.key === 'R') handleRotate()
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5))
  const handleRotate = () => setRotation(prev => (prev + 90) % 360)
  const handleFullscreen = () => setIsFullscreen(!isFullscreen)
  const handleRefresh = () => {
    setIsLoading(true)
    setPdfError(false)
    setLoadAttempts(prev => prev + 1)
  }

  const handlePdfLoad = () => {
    setIsLoading(false)
    setPdfError(false)
  }

  const handlePdfError = () => {
    setIsLoading(false)
    setPdfError(true)
  }

  const getPdfViewerUrl = (url: string) => {
    try {
      // Multiple fallback strategies
      if (url.includes('drive.google.com')) {
        const fileId = url.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1]
        if (fileId) {
          if (viewMode === 'google') {
            return `https://drive.google.com/file/d/${fileId}/preview`
          }
          return `https://drive.google.com/file/d/${fileId}/view`
        }
      }
      
      // Try to use PDF.js viewer for better compatibility
      if (viewMode === 'embed') {
        return `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(url)}`
      }
      
      return url
    } catch (error) {
      console.error('Error processing PDF URL:', error)
      return url
    }
  }

  const viewerUrl = getPdfViewerUrl(pdfUrl)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(pdfUrl)
    // You could add a toast notification here
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: paperTitle,
        url: pdfUrl
      })
    } else {
      handleCopyLink()
    }
  }

  const handlePrint = () => {
    window.open(pdfUrl, '_blank')
  }

  return (
    <div className={`fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col ${isFullscreen ? 'p-0' : 'p-2 md:p-4'}`}>
      {/* Enhanced Header */}
      <div className="bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
              title="Close (Esc)"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            </button>
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800 truncate max-w-xs md:max-w-none">
                {paperTitle}
              </h3>
            </div>
          </div>
          
          {/* Enhanced Controls */}
          <div className="flex items-center space-x-1">
            {/* View Mode Selector */}
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as any)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="embed">PDF.js Viewer</option>
              <option value="google">Google Viewer</option>
              <option value="download">Download Only</option>
            </select>

            <div className="w-px h-6 bg-gray-300 mx-2" />

            {/* Zoom Controls */}
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-600 px-2 min-w-[3rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Zoom In (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-2" />

            {/* Additional Controls */}
            <button
              onClick={handleRotate}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Rotate (R)"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleFullscreen}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Toggle Fullscreen (F)"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
            <button
              onClick={handleRefresh}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-2" />

            {/* Action Buttons */}
            <button
              onClick={handleShare}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrint}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Print"
            >
              <Printer className="w-4 h-4" />
            </button>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Open in New Tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href={pdfUrl}
              download
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4 inline mr-2" />
              Download
            </a>
          </div>
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 overflow-hidden relative bg-gray-100">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm z-10">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Loading PDF...</h3>
              <p className="text-gray-600">Please wait while we load the document</p>
            </div>
          </div>
        )}

        {pdfError ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 border border-red-200">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                PDF Viewer Error
              </h3>
              <p className="text-gray-600 mb-6">
                Unable to display the PDF in the browser. This might be due to browser restrictions or the PDF format.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={handleRefresh}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </button>
                
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open
                  </a>
                  <a
                    href={pdfUrl}
                    download
                    className="flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : viewMode === 'download' ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Download PDF
              </h3>
              <p className="text-gray-600 mb-6">
                Click the button below to download the PDF file to your device.
              </p>
              <a
                href={pdfUrl}
                download
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Download className="w-5 h-5 mr-2" />
                Download PDF
              </a>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <iframe
              key={`${viewerUrl}-${loadAttempts}`}
              src={viewerUrl}
              className="w-full h-full border-0 bg-white"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transformOrigin: 'center center',
                maxWidth: '100%',
                maxHeight: '100%'
              }}
              title={paperTitle}
              onLoad={handlePdfLoad}
              onError={handlePdfError}
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          </div>
        )}
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="absolute bottom-4 left-4 bg-black/80 text-white px-3 py-2 rounded-lg text-xs opacity-70 hover:opacity-100 transition-opacity">
        <div className="space-y-1">
          <div>ESC: Close | F: Fullscreen | +/-: Zoom</div>
          <div>R: Rotate | Click & drag to pan</div>
        </div>
      </div>
    </div>
  )
}

// Enhanced Paper Card Component
function PaperCard({ paper, index, examSlug }: { paper: PreviousPaper; index: number; examSlug: string }) {
  const [showPDF, setShowPDF] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const difficultyColor = getDifficultyColor(paper.difficulty)
  const difficultyIcon = getDifficultyIcon(paper.difficulty)

  return (
    <>
      <div
        className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden group transform hover:-translate-y-1 ${isHovered ? 'shadow-2xl' : ''}`}
        style={{
          animationDelay: `${index * 100}ms`,
          animation: 'fadeInUp 0.6s ease-out forwards'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Enhanced Header */}
        <div className={`bg-gradient-to-r ${difficultyColor} p-6 text-white relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transform group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12 transform group-hover:scale-110 transition-transform duration-500" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="text-3xl font-bold tracking-tight">{paper.year}</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-2">
                {difficultyIcon}
                <span className="text-sm font-medium capitalize">{paper.difficulty}</span>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">
              {examSlug.toUpperCase()} {paper.year}
            </h3>
            <p className="text-white/90 text-sm">
              Previous Year Question Paper
            </p>
            {paper.fileSize && (
              <div className="mt-2 text-xs text-white/70">
                File size: {paper.fileSize}
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Content */}
        <div className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {paper.totalQuestions && (
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Questions</p>
                  <p className="font-bold text-gray-800">{paper.totalQuestions}</p>
                </div>
              </div>
            )}
            {paper.duration && (
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Duration</p>
                  <p className="font-bold text-gray-800">{paper.duration}</p>
                </div>
              </div>
            )}
            {paper.maxMarks && (
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-xl">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Max Marks</p>
                  <p className="font-bold text-gray-800">{paper.maxMarks}</p>
                </div>
              </div>
            )}
            {paper.attemptedBy && (
              <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-xl">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Attempted</p>
                  <p className="font-bold text-gray-800">{paper.attemptedBy}</p>
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          {paper.tags && paper.tags.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {paper.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {paper.notes && (
            <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-2 text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 text-blue-600" />
                Notes:
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">{paper.notes}</p>
            </div>
          )}

          {/* Top Score Badge */}
          {paper.topScore && (
            <div className="mb-6 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-600" />
                <span className="font-semibold text-yellow-800">Top Score: {paper.topScore}</span>
              </div>
            </div>
          )}

          {/* Enhanced Actions */}
          <div className="space-y-3">
            <button
              onClick={() => setShowPDF(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Eye className="w-5 h-5" />
              <span>View PDF</span>
            </button>
            <div className="grid grid-cols-2 gap-3">
              <a
                href={paper.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-4 py-2 rounded-xl font-medium hover:from-green-700 hover:to-emerald-800 transition-all duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open</span>
              </a>
              <a
                href={paper.pdfUrl}
                download
                className="bg-gradient-to-r from-purple-600 to-pink-700 text-white px-4 py-2 rounded-xl font-medium hover:from-purple-700 hover:to-pink-800 transition-all duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {showPDF && (
        <PDFViewer
          pdfUrl={paper.pdfUrl}
          onClose={() => setShowPDF(false)}
          paperTitle={`${examSlug.toUpperCase()} ${paper.year} Question Paper`}
        />
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  )
}

// Enhanced Main Component
export default function PreviousPapersClient({ examSlug, papers = [] }: Props) {
  const [searchTerm, setSearchTerm] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const [sortBy, setSortBy] = useState('year-desc')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Add some sample data if papers is empty for demo
  const samplePapers: PreviousPaper[] = papers.length > 0 ? papers : [
    {
      id: '1',
      examSlug: examSlug,
      year: 2023,
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      difficulty: 'medium',
      notes: 'Important topics: Data Structures, Algorithms, Database Management',
      attemptedBy: 1250,
      topScore: 95,
      totalQuestions: 100,
      duration: '3 hours',
      maxMarks: 100,
      tags: ['Data Structures', 'Algorithms', 'DBMS'],
      fileSize: '2.4 MB'
    },
    {
      id: '2',
      examSlug: examSlug,
      year: 2022,
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      difficulty: 'hard',
      notes: 'Focus on advanced topics and problem-solving',
      attemptedBy: 980,
      topScore: 88,
      totalQuestions: 90,
      duration: '3 hours',
      maxMarks: 90,
      tags: ['Advanced Programming', 'System Design'],
      fileSize: '3.1 MB'
    },
    {
      id: '3',
      examSlug: examSlug,
      year: 2021,
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      difficulty: 'easy',
      notes: 'Good for beginners, covers basic concepts',
      attemptedBy: 1500,
      topScore: 98,
      totalQuestions: 80,
      duration: '2.5 hours',
      maxMarks: 80,
      tags: ['Basics', 'Fundamentals'],
      fileSize: '1.8 MB'
    }
  ]

  const filteredPapers = samplePapers
    .filter(paper => 
      paper.year.toString().includes(searchTerm) ||
      paper.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (paper.tags && paper.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    )
    .filter(paper => 
      difficultyFilter === 'all' || paper.difficulty === difficultyFilter
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'year-desc':
          return b.year - a.year
        case 'year-asc':
          return a.year - b.year
        case 'difficulty':
          const difficultyOrder = { easy: 1, medium: 2, hard: 3 }
          return difficultyOrder[a.difficulty as keyof typeof difficultyOrder] - difficultyOrder[b.difficulty as keyof typeof difficultyOrder]
        case 'attempted':
          return (b.attemptedBy || 0) - (a.attemptedBy || 0)
        default:
          return b.year - a.year
      }
    })

  if (samplePapers.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                {examSlug.toUpperCase()} Previous Papers
              </h1>
              <p className="text-xl text-blue-100 mb-6 opacity-90">
                Access previous year question papers and practice materials
              </p>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-12 border border-gray-100">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <FileText className="w-12 h-12 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                No Previous Papers Found
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                We're still gathering previous year papers for {examSlug.toUpperCase()}. 
                Check back soon for updated content.
              </p>
              <button className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg inline-flex items-center">
                <ChevronLeft className="w-5 h-5 mr-2" />
                Back to Exam Details
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 via-indigo-600/20 to-purple-700/20"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl">
            <div className="mb-6">
              <button className="inline-flex items-center text-blue-100 hover:text-white transition-colors text-lg font-medium">
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back to {examSlug.toUpperCase()}
              </button>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              {examSlug.toUpperCase()} Previous Papers
            </h1>
            <p className="text-xl text-blue-100 mb-6 opacity-90">
              Access previous year question papers and practice materials
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{filteredPapers.length}</div>
                  <div className="text-blue-100 text-sm">Papers Available</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">
                    {filteredPapers.length > 0 ? Math.min(...filteredPapers.map(p => p.year)) : 0} - {filteredPapers.length > 0 ? Math.max(...filteredPapers.map(p => p.year)) : 0}
                  </div>
                  <div className="text-blue-100 text-sm">Year Range</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">PDF</div>
                  <div className="text-blue-100 text-sm">Format</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">
                    {filteredPapers.reduce((sum, p) => sum + (p.attemptedBy || 0), 0)}
                  </div>
                  <div className="text-blue-100 text-sm">Total Attempts</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search papers by year, notes, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="year-desc">Year (Newest First)</option>
                <option value="year-asc">Year (Oldest First)</option>
                <option value="difficulty">Difficulty</option>
                <option value="attempted">Most Attempted</option>
              </select>

              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Info */}
        {searchTerm && (
          <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-blue-800">
              Found {filteredPapers.length} paper{filteredPapers.length !== 1 ? 's' : ''} matching "{searchTerm}"
            </p>
          </div>
        )}

        {/* Papers Grid/List */}
        {filteredPapers.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Papers Found</h3>
            <p className="text-gray-600">Try adjusting your search terms or filters</p>
          </div>
        ) : (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' 
              : 'space-y-6'
          }`}>
            {filteredPapers.map((paper, index) => (
              <PaperCard key={paper.id} paper={paper} index={index} examSlug={examSlug} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}