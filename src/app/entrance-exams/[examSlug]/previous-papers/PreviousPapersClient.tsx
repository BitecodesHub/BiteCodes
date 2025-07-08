'use client'

import Link from 'next/link'
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
  Target
} from 'lucide-react'

import { useState } from 'react'

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
  examSlug: string
  papers: PreviousPaper[]
}

function getDifficultyColor(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'from-green-500 to-emerald-600'
    case 'medium':
      return 'from-yellow-500 to-orange-600'
    case 'hard':
      return 'from-red-500 to-pink-600'
    default:
      return 'from-blue-500 to-indigo-600'
  }
}

function getDifficultyIcon(difficulty: string) {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return <TrendingUp className="w-4 h-4" />
    case 'medium':
      return <Target className="w-4 h-4" />
    case 'hard':
      return <Award className="w-4 h-4" />
    default:
      return <BookOpen className="w-4 h-4" />
  }
}

// PDF Viewer Component
function PDFViewer({ pdfUrl, onClose, paperTitle }: { pdfUrl: string; onClose: () => void; paperTitle: string }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5))
  const handleRotate = () => setRotation(prev => (prev + 90) % 360)
  const handleFullscreen = () => setIsFullscreen(!isFullscreen)

  return (
    <div className={`fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col ${isFullscreen ? 'p-0' : 'p-4'}`}>
      {/* Header */}
      <div className="flex items-center justify-between bg-white px-6 py-4 shadow-lg">
        <div className="flex items-center space-x-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-bold text-gray-800">{paperTitle}</h3>
        </div>
        
        {/* Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="text-sm text-gray-600 px-2">{Math.round(zoom * 100)}%</span>
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={handleRotate}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Rotate"
          >
            <RotateCw className="w-5 h-5" />
          </button>
          <button
            onClick={handleFullscreen}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Toggle Fullscreen"
          >
            <Maximize className="w-5 h-5" />
          </button>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Open in New Tab"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 overflow-hidden">
        <iframe
          src={pdfUrl}
          className="w-full h-full border-0"
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            transformOrigin: 'center center'
          }}
          title={paperTitle}
        />
      </div>
    </div>
  )
}

// Paper Card Component
function PaperCard({ paper, index, examSlug }: { paper: PreviousPaper; index: number; examSlug: string }) {
  const [showPDF, setShowPDF] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const difficultyColor = getDifficultyColor(paper.difficulty)
  const difficultyIcon = getDifficultyIcon(paper.difficulty)

  return (
    <>
      <div
        className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden group transform hover:-translate-y-2 ${isHovered ? 'scale-105' : ''}`}
        style={{
          animationDelay: `${index * 100}ms`,
          animation: 'fadeInUp 0.6s ease-out forwards'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${difficultyColor} p-6 text-white relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span className="text-2xl font-bold">{paper.year}</span>
              </div>
              <div className={`bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-2`}>
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
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Paper Details */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {paper.totalQuestions && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Questions</p>
                  <p className="font-semibold text-gray-800">{paper.totalQuestions}</p>
                </div>
              </div>
            )}
            {paper.duration && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="font-semibold text-gray-800">{paper.duration}</p>
                </div>
              </div>
            )}
            {paper.maxMarks && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Award className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Max Marks</p>
                  <p className="font-semibold text-gray-800">{paper.maxMarks}</p>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          {paper.notes && (
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <h4 className="font-semibold text-gray-700 mb-2 text-sm">Notes:</h4>
              <p className="text-gray-600 text-sm">{paper.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={() => setShowPDF(true)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center space-x-2 shadow-md"
            >
              <Eye className="w-4 h-4" />
              <span>View PDF</span>
            </button>
            <a
              href={paper.pdfUrl}
              download
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-700 text-white px-4 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center space-x-2 shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </a>
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

export default function PreviousPapersClient({ examSlug, papers }: Props) {
  if (!papers || papers.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
              <Link
                href={`/entrance-exams/${examSlug}`}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg inline-flex items-center"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Back to Exam Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="mb-6">
              <Link
                href={`/entrance-exams/${examSlug}`}
                className="inline-flex items-center text-blue-100 hover:text-white transition-colors text-lg font-medium"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back to {examSlug.toUpperCase()}
              </Link>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              {examSlug.toUpperCase()} Previous Papers
            </h1>
            <p className="text-xl text-blue-100 mb-6 opacity-90">
              Access previous year question papers and practice materials
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{papers.length}</div>
                  <div className="text-blue-100 text-sm">Papers Available</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {Math.min(...papers.map(p => p.year))} - {Math.max(...papers.map(p => p.year))}
                  </div>
                  <div className="text-blue-100 text-sm">Year Range</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">PDF</div>
                  <div className="text-blue-100 text-sm">Format</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Papers Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {papers.map((paper, index) => (
            <PaperCard key={paper.id} paper={paper} index={index} examSlug={examSlug} />
          ))}
        </div>
      </div>
    </div>
  )
}