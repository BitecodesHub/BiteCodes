"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { useAuth } from '@/app/contexts/AuthContext'
import { 
  MessageCircle, 
  Heart, 
  Share2, 
  Bookmark,
  Filter,
  Search,
  Plus,
  TrendingUp,
  Clock,
  Users,
  Zap
} from 'lucide-react'

interface Post {
  id: number
  author: {
    id: number
    username: string
    name: string
    profileurl: string
    bio: string
    isFollowing: boolean
  }
  title: string
  content: string
  contentPreview: string
  postType: 'QUESTION' | 'DISCUSSION' | 'ANNOUNCEMENT' | 'DOUBT' | 'EXPERIENCE' | 'RESOURCE'
  entranceExam: {
    id: string
    name: string
    fullName: string
  } | null
  university: any | null
  tags: string[]
  thumbnailUrl: string | null
  viewCount: number
  likeCount: number
  commentCount: number
  isTrending: boolean
  createdAt: string
  isLiked: boolean
  isBookmarked: boolean
}

interface FeedResponse {
  posts: Post[]
  currentPage: number
  totalPages: number
  totalElements: number
  hasNext: boolean
}

export default function FeedPage() {
  const { user, isLoggedIn ,user:authUser,user:currentUser } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [feedType, setFeedType] = useState<'TRENDING' | 'RECENT' | 'FOLLOWING'>('TRENDING')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
  useEffect(() => {
    const fetchFeed = async () => {
      if (!isLoggedIn) return

      try {
        setIsLoading(true)
        setError(null)
        const response = await axios.get(`${API_BASE_URL}/api/posts/feed`, {
          params: {
            feedType,
            page: 0,
            size: 20
          },
        })

        if (response.status === 200) {
          setPosts(response.data.posts || [])
        }
      } catch (err: any) {
        console.error('Error fetching feed:', err)
        setError('Failed to load feed. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeed()
  }, [feedType, isLoggedIn, API_BASE_URL])
 
  
  const handleLike = async (postId: number) => {
  try {
    await axios.post(`${API_BASE_URL}/api/posts/${postId}/react/${authUser?.userid}`, {
      reactionType: 'LIKE',
    });

    // Optimistically update UI
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1
          } 
        : post
    ));
  } catch (err) {
    console.error('Error liking post:', err);
  }
}


  const handleBookmark = async (postId: number) => {
    try {
      await axios.post(`${API_BASE_URL}/api/posts/${postId}/bookmark/${currentUser?.userid}`, 
        {},
        {
        }
      )
      
      // Optimistically update UI
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, isBookmarked: !post.isBookmarked } 
          : post
      ))
    } catch (err) {
      console.error('Error bookmarking post:', err)
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Join the Community</h2>
          <p className="text-gray-600 mb-6">Sign in to see posts from other students and educators</p>
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
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Feed</h1>
              <p className="text-gray-600">Latest posts from the community</p>
            </div>
            <Link
              href="/create-post"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Post
            </Link>
          </div>

          {/* Feed Type Tabs */}
          <div className="flex space-x-1 mt-6 border-b">
            <button
              onClick={() => setFeedType('TRENDING')}
              className={`flex items-center px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                feedType === 'TRENDING'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Trending
            </button>
            <button
              onClick={() => setFeedType('RECENT')}
              className={`flex items-center px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                feedType === 'RECENT'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Clock className="w-4 h-4 mr-2" />
              Recent
            </button>
            <button
              onClick={() => setFeedType('FOLLOWING')}
              className={`flex items-center px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                feedType === 'FOLLOWING'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="w-4 h-4 mr-2" />
              Following
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          // Loading Skeleton
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border p-6 animate-pulse">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
            <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600 mb-6">Be the first to share your thoughts or questions!</p>
            <Link
              href="/create-post"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create First Post
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
                {/* Post Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={post.author.profileurl || 'https://webcrumbs.cloud/placeholder'}
                        alt={post.author.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                          {post.isTrending && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Trending
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          @{post.author.username} · {formatTime(post.createdAt)}
                        </p>
                      </div>
                    </div>
                    {post.entranceExam && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {post.entranceExam.name}
                      </span>
                    )}
                  </div>

                  {/* Post Content */}
                  <Link href={`/posts/${post.id}`}>
                    <div className="mt-4 cursor-pointer">
                      <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        {post.contentPreview || post.content}
                      </p>
                    </div>
                  </Link>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
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
                </div>

                {/* Post Actions */}
                <div className="px-6 py-4 border-t bg-gray-50 rounded-b-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                          post.isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                        <span>{post.likeCount}</span>
                      </button>

                      <Link
                        href={`/posts/${post.id}`}
                        className="flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span>{post.commentCount}</span>
                      </Link>

                      <button className="flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-green-600 transition-colors">
                        <Share2 className="w-5 h-5" />
                        <span>Share</span>
                      </button>
                    </div>

                    <button
                      onClick={() => handleBookmark(post.id)}
                      className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                        post.isBookmarked ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
                      }`}
                    >
                      <Bookmark className={`w-5 h-5 ${post.isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}