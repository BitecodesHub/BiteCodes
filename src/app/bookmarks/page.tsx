// ============================================================================
// ENHANCED BOOKMARKS PAGE - /app/bookmarks/page.tsx
// Added: Sort options, filter by exam/tags, bulk actions, export bookmarks
// ============================================================================

"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'
import { Bookmark, Heart, MessageCircle, Eye, Search, Filter, Download, Trash2, X } from 'lucide-react'

interface Post {
  id: number
  author: {
    id: number
    username: string
    name: string
    profileurl: string
  }
  title: string
  contentPreview: string
  postType: string
  entranceExam: { id: string; name: string } | null
  tags: string[]
  thumbnailUrl: string | null
  viewCount: number
  likeCount: number
  commentCount: number
  isTrending: boolean
  createdAt: string
  isLiked: boolean
}

export default function BookmarksPage() {
  const { user: currentUser, isLoggedIn } = useAuth()
  const [bookmarks, setBookmarks] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent')
  const [selectedExam, setSelectedExam] = useState<string>('all')
  const [selectedBookmarks, setSelectedBookmarks] = useState<number[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

  useEffect(() => {
    if (isLoggedIn) {
      fetchBookmarks(0, true)
    }
  }, [isLoggedIn, sortBy, selectedExam])

  const fetchBookmarks = async (pageNumber: number, replace = false) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await axios.get(
        `${API_BASE_URL}/api/posts/bookmarks/${currentUser?.userid}?page=${pageNumber}&size=10&sort=${sortBy}`,
        {}
      )

      let newPosts = response.data.content || []
      
      if (selectedExam !== 'all') {
        newPosts = newPosts.filter((post: Post) => post.entranceExam?.id === selectedExam)
      }

      setBookmarks(prev => replace ? newPosts : [...prev, ...newPosts])
      setHasMore(!response.data.last)
      setPage(pageNumber)
    } catch (err: any) {
      console.error('Error fetching bookmarks:', err)
      setError('Failed to load bookmarks. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveBookmark = async (postId: number) => {
    try {
      await axios.post(`${API_BASE_URL}/api/posts/${postId}/bookmark/${currentUser?.userid}`, {})
      setBookmarks(prev => prev.filter(post => post.id !== postId))
      setSelectedBookmarks(prev => prev.filter(id => id !== postId))
    } catch (err) {
      console.error('Error removing bookmark:', err)
    }
  }

  const handleBulkRemove = async () => {
    if (selectedBookmarks.length === 0) return
    
    try {
      await Promise.all(
        selectedBookmarks.map(postId =>
          axios.post(`${API_BASE_URL}/api/posts/${postId}/bookmark/${currentUser?.userid}`, {})
        )
      )
      setBookmarks(prev => prev.filter(post => !selectedBookmarks.includes(post.id)))
      setSelectedBookmarks([])
    } catch (err) {
      console.error('Error removing bookmarks:', err)
    }
  }

  const handleExport = () => {
    const data = bookmarks.map(post => ({
      title: post.title,
      author: post.author.name,
      url: `${window.location.origin}/posts/${post.id}`,
      tags: post.tags.join(', '),
      createdAt: post.createdAt
    }))
    
    const csv = [
      ['Title', 'Author', 'URL', 'Tags', 'Created At'],
      ...data.map(row => [row.title, row.author, row.url, row.tags, row.createdAt])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'bookmarks.csv'
    a.click()
  }

  const toggleBookmarkSelection = (postId: number) => {
    setSelectedBookmarks(prev =>
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    )
  }

  const uniqueExams = Array.from(new Set(bookmarks.map(post => post.entranceExam?.id).filter(Boolean)))

  const filteredBookmarks = bookmarks.filter(post => {
    if (searchQuery) {
      return post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             post.contentPreview.toLowerCase().includes(searchQuery.toLowerCase()) ||
             post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    }
    return true
  })

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    if (diffInHours < 1) return `${Math.floor(diffInHours * 60)}m ago`
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to view your bookmarks</p>
          <Link href="/login" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Bookmark className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Bookmarks</h1>
                <p className="text-gray-600">Your saved posts and resources ({bookmarks.length})</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {selectedBookmarks.length > 0 && (
                <button
                  onClick={handleBulkRemove}
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove ({selectedBookmarks.length})
                </button>
              )}
              <button
                onClick={handleExport}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-black"
                placeholder="Search bookmarks..."
              />
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'recent' | 'popular')}
                className="px-4 py-2 border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-black"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>

            {showFilters && (
              <div className="p-4 bg-gray-50 rounded-lg border">
                <h3 className="font-semibold text-gray-900 mb-3">Filter by Exam</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedExam('all')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedExam === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    All Exams
                  </button>
                  {uniqueExams.map((examId) => (
                    <button
                      key={examId}
                      onClick={() => setSelectedExam(examId as string)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedExam === examId ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {examId}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && bookmarks.length === 0 ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button onClick={() => fetchBookmarks(0, true)} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Try Again
            </button>
          </div>
        ) : filteredBookmarks.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
            <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No bookmarks found' : 'No bookmarks yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? 'Try different search terms' : 'Save interesting posts to find them later'}
            </p>
            <Link href="/feed" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Search className="w-5 h-5 mr-2" />
              Explore Posts
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookmarks.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedBookmarks.includes(post.id)}
                        onChange={() => toggleBookmarkSelection(post.id)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <Link href={`/users/${post.author.id}`}>
                        <img
                          src={post.author.profileurl || 'https://webcrumbs.cloud/placeholder'}
                          alt={post.author.name}
                          className="w-10 h-10 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-blue-500"
                        />
                      </Link>
                      <div>
                        <Link href={`/users/${post.author.id}`}>
                          <h3 className="font-semibold text-gray-900 hover:text-blue-600">{post.author.name}</h3>
                        </Link>
                        <p className="text-sm text-gray-500">
                          @{post.author.username} · {formatTime(post.createdAt)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveBookmark(post.id)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="Remove bookmark"
                    >
                      <Bookmark className="w-5 h-5 fill-current" />
                    </button>
                  </div>

                  <Link href={`/posts/${post.id}`}>
                    <div className="cursor-pointer mb-4">
                      <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-gray-700 leading-relaxed line-clamp-2">
                        {post.contentPreview}
                      </p>
                    </div>
                  </Link>

                  {post.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, index) => (
                        <Link key={index} href={`/search?q=${encodeURIComponent(tag)}`}>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer">
                            #{tag}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{post.viewCount}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className={`w-4 h-4 ${post.isLiked ? 'text-red-600 fill-current' : ''}`} />
                        <span>{post.likeCount}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.commentCount}</span>
                      </div>
                    </div>

                    {post.entranceExam && (
                      <Link href={`/entrance-exams/${post.entranceExam.id}`}>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer">
                          {post.entranceExam.name}
                        </span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {hasMore && !isLoading && (
              <div className="text-center pt-4">
                <button
                  onClick={() => fetchBookmarks(page + 1)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Load More
                </button>
              </div>
            )}

            {isLoading && bookmarks.length > 0 && (
              <p className="text-center text-gray-500 pt-4">Loading more...</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}