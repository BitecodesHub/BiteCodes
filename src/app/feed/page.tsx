// ============================================================================
// ENHANCED FEED PAGE - /app/feed/page.tsx
// Added: Infinite scroll, filter by post type, share functionality, follow from feed
// ============================================================================

"use client"

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { useAuth } from '@/app/contexts/AuthContext'
import { 
  MessageCircle, Heart, Share2, Bookmark, Filter, Search, Plus, 
  TrendingUp, Clock, Users, Zap, X, UserPlus, UserCheck, Send
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
  entranceExam: { id: string; name: string; fullName: string } | null
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

const POST_TYPE_FILTERS = [
  { value: 'ALL', label: 'All Posts' },
  { value: 'QUESTION', label: 'Questions' },
  { value: 'DISCUSSION', label: 'Discussions' },
  { value: 'ANNOUNCEMENT', label: 'Announcements' },
  { value: 'DOUBT', label: 'Doubts' },
  { value: 'EXPERIENCE', label: 'Experiences' },
  { value: 'RESOURCE', label: 'Resources' }
]

export default function FeedPage() {
  const { user: authUser, isLoggedIn } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [feedType, setFeedType] = useState<'TRENDING' | 'RECENT' | 'FOLLOWING'>('TRENDING')
  const [postTypeFilter, setPostTypeFilter] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [sharePostId, setSharePostId] = useState<number | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const lastPostRef = useRef<HTMLDivElement | null>(null)
  
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

  useEffect(() => {
    if (isLoggedIn) {
      fetchFeed(0, true)
    }
  }, [feedType, postTypeFilter, isLoggedIn])

  useEffect(() => {
    // Infinite scroll
    if (isLoading || !hasMore) return

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        fetchFeed(page + 1, false)
      }
    })

    if (lastPostRef.current) {
      observerRef.current.observe(lastPostRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [isLoading, hasMore, page])

  const fetchFeed = async (pageNum: number, replace = false) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const params: any = {
        feedType,
        page: pageNum,
        size: 10
      }
      
      if (postTypeFilter !== 'ALL') {
        params.postType = postTypeFilter
      }

      const response = await axios.get(`${API_BASE_URL}/api/posts/feed`, { params })

      if (response.status === 200) {
        const newPosts = response.data.posts || []
        setPosts(prev => replace ? newPosts : [...prev, ...newPosts])
        setHasMore(response.data.hasNext)
        setPage(pageNum)
      }
    } catch (err: any) {
      console.error('Error fetching feed:', err)
      setError('Failed to load feed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLike = async (postId: number) => {
    try {
      await axios.post(`${API_BASE_URL}/api/posts/${postId}/react/${authUser?.userid}`, {
        reactionType: 'LIKE',
      })
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isLiked: !post.isLiked,
              likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1
            } 
          : post
      ))
    } catch (err) {
      console.error('Error liking post:', err)
    }
  }

  const handleBookmark = async (postId: number) => {
    try {
      await axios.post(`${API_BASE_URL}/api/posts/${postId}/bookmark/${authUser?.userid}`, {})
      setPosts(prev => prev.map(post => 
        post.id === postId ? { ...post, isBookmarked: !post.isBookmarked } : post
      ))
    } catch (err) {
      console.error('Error bookmarking post:', err)
    }
  }

  const handleFollow = async (authorId: number) => {
    try {
      await axios.post(`${API_BASE_URL}/api/users/${authUser?.userid}/follow/${authorId}`)
      setPosts(prev => prev.map(post => 
        post.author.id === authorId 
          ? { ...post, author: { ...post.author, isFollowing: !post.author.isFollowing } }
          : post
      ))
    } catch (err) {
      console.error('Error following user:', err)
    }
  }

  const handleShare = (postId: number) => {
    setSharePostId(postId)
  }

  const copyToClipboard = (postId: number) => {
    const url = `${window.location.origin}/posts/${postId}`
    navigator.clipboard.writeText(url)
    alert('Link copied to clipboard!')
    setSharePostId(null)
  }

  const shareToSocial = (platform: string, postId: number) => {
    const url = `${window.location.origin}/posts/${postId}`
    const post = posts.find(p => p.id === postId)
    const text = post?.title || 'Check out this post'
    
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
    }
    
    window.open(urls[platform], '_blank', 'width=600,height=400')
    setSharePostId(null)
  }

  const filteredPosts = posts.filter(post => {
    if (searchQuery) {
      return post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Join the Community</h2>
          <p className="text-gray-600 mb-6">Sign in to see posts from other students and educators</p>
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
      <div className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Feed</h1>
              <p className="text-gray-600">Latest posts from the community</p>
            </div>
            <Link href="/create-post" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              <Plus className="w-5 h-5 mr-2" />
              New Post
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-black"
              placeholder="Search posts, tags, topics..."
            />
          </div>

          {/* Feed Type Tabs */}
          <div className="flex space-x-1 border-b">
            <button
              onClick={() => setFeedType('TRENDING')}
              className={`flex items-center px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                feedType === 'TRENDING' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Trending
            </button>
            <button
              onClick={() => setFeedType('RECENT')}
              className={`flex items-center px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                feedType === 'RECENT' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Clock className="w-4 h-4 mr-2" />
              Recent
            </button>
            <button
              onClick={() => setFeedType('FOLLOWING')}
              className={`flex items-center px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                feedType === 'FOLLOWING' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="w-4 h-4 mr-2" />
              Following
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="ml-auto flex items-center px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>

          {/* Filters Dropdown */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <h3 className="font-semibold text-gray-900 mb-3">Filter by Type</h3>
              <div className="flex flex-wrap gap-2">
                {POST_TYPE_FILTERS.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setPostTypeFilter(filter.value)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      postTypeFilter === filter.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && posts.length === 0 ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border p-6 animate-pulse">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
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
            <button onClick={() => fetchFeed(0, true)} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Try Again
            </button>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
            <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? 'Try different search terms' : 'Be the first to share your thoughts!'}
            </p>
            <Link href="/create-post" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="w-5 h-5 mr-2" />
              Create Post
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post, index) => (
              <div 
                key={post.id} 
                ref={index === filteredPosts.length - 1 ? lastPostRef : null}
                className="bg-white rounded-2xl shadow-sm border hover:shadow-md transition-shadow"
              >
                {/* Post Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3 flex-1">
                      <Link href={`/users/${post.author.id}`}>
                        <img
                          src={post.author.profileurl || 'https://webcrumbs.cloud/placeholder'}
                          alt={post.author.name}
                          className="w-10 h-10 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-blue-500"
                        />
                      </Link>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Link href={`/users/${post.author.id}`}>
                            <h3 className="font-semibold text-gray-900 hover:text-blue-600">{post.author.name}</h3>
                          </Link>
                          {post.isTrending && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Trending
                            </span>
                          )}
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {post.postType}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          @{post.author.username} · {formatTime(post.createdAt)}
                        </p>
                      </div>
                      {authUser?.userid !== post.author.id && (
                        <button
                          onClick={() => handleFollow(post.author.id)}
                          className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            post.author.isFollowing
                              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {post.author.isFollowing ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                          <span>{post.author.isFollowing ? 'Following' : 'Follow'}</span>
                        </button>
                      )}
                    </div>
                    {post.entranceExam && (
                      <Link href={`/entrance-exams/${post.entranceExam.id}`}>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer">
                          {post.entranceExam.name}
                        </span>
                      </Link>
                    )}
                  </div>

                  {/* Post Content */}
                  <Link href={`/posts/${post.id}`}>
                    <div className="cursor-pointer">
                      <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-gray-700 leading-relaxed line-clamp-3">
                        {post.contentPreview || post.content}
                      </p>
                    </div>
                  </Link>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {post.tags.map((tag, index) => (
                        <Link key={index} href={`/search?q=${encodeURIComponent(tag)}`}>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer">
                            #{tag}
                          </span>
                        </Link>
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

                      <Link href={`/posts/${post.id}`} className="flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
                        <MessageCircle className="w-5 h-5" />
                        <span>{post.commentCount}</span>
                      </Link>

                      <button onClick={() => handleShare(post.id)} className="flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-green-600 transition-colors">
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

            {isLoading && posts.length > 0 && (
              <div className="text-center py-4">
                <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Share Modal */}
      {sharePostId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Share Post</h3>
              <button onClick={() => setSharePostId(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => copyToClipboard(sharePostId)}
                className="w-full flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <Send className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">Copy Link</span>
              </button>

              <button
                onClick={() => shareToSocial('twitter', sharePostId)}
                className="w-full flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <div className="w-5 h-5 bg-blue-400 rounded"></div>
                <span className="font-medium text-gray-900">Share on Twitter</span>
              </button>

              <button
                onClick={() => shareToSocial('facebook', sharePostId)}
                className="w-full flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <div className="w-5 h-5 bg-blue-600 rounded"></div>
                <span className="font-medium text-gray-900">Share on Facebook</span>
              </button>

              <button
                onClick={() => shareToSocial('linkedin', sharePostId)}
                className="w-full flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <div className="w-5 h-5 bg-blue-700 rounded"></div>
                <span className="font-medium text-gray-900">Share on LinkedIn</span>
              </button>

              <button
                onClick={() => shareToSocial('whatsapp', sharePostId)}
                className="w-full flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <div className="w-5 h-5 bg-green-500 rounded"></div>
                <span className="font-medium text-gray-900">Share on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}