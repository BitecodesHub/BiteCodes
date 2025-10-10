"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { useAuth } from '@/app/contexts/AuthContext'
import { 
  Bookmark,
  Heart,
  MessageCircle,
  Eye,
  Search
} from 'lucide-react'

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
  entranceExam: {
    id: string
    name: string
  } | null
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

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

  useEffect(() => {
    if (isLoggedIn) {
      fetchBookmarks(0, true)  // load first page
    }
  }, [isLoggedIn])

  const fetchBookmarks = async (pageNumber: number, replace = false) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await axios.get(
        `${API_BASE_URL}/api/posts/bookmarks/${currentUser?.userid}?page=${pageNumber}&size=10`,
        {
         
        }
      )

      const newPosts = response.data.content || []
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
      await axios.post(
        `${API_BASE_URL}/api/posts/${postId}/bookmark/${currentUser?.userid}`,
        {},
       
      )

      // Remove from local state
      setBookmarks(prev => prev.filter(post => post.id !== postId))
    } catch (err) {
      console.error('Error removing bookmark:', err)
    }
  }

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
          <Link
            href="/login"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
          >
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
          <div className="flex items-center space-x-3">
            <Bookmark className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bookmarks</h1>
              <p className="text-gray-600">Your saved posts and resources</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && bookmarks.length === 0 ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => fetchBookmarks(0, true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
            <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookmarks yet</h3>
            <p className="text-gray-600 mb-6">Save interesting posts to find them later</p>
            <Link
              href="/feed"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Search className="w-5 h-5 mr-2" />
              Explore Posts
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookmarks.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={post.author.profileurl || 'https://webcrumbs.cloud/placeholder'}
                        alt={post.author.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
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
                      <p className="text-gray-700 leading-relaxed">
                        {post.contentPreview}
                      </p>
                    </div>
                  </Link>

                  {post.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700"
                        >
                          #{tag}
                        </span>
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
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {post.entranceExam.name}
                      </span>
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
