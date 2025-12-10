"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import { useAuth } from "../../contexts/AuthContext";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Eye,
  TrendingUp,
  CheckCircle
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
  postType: string
  entranceExam: {
    id: string
    name: string
    fullName: string
  } | null
  university: any | null
  tags: string[]
  media: any[]
  viewCount: number
  likeCount: number
  commentCount: number
  shareCount: number
  isPinned: boolean
  isTrending: boolean
  isEdited: boolean
  visibility: string
  createdAt: string
  updatedAt: string
  editedAt: string | null
  isLiked: boolean
  isBookmarked: boolean
  userReaction: string | null
}

interface Comment {
  id: number
  postId: number
  author: {
    id: number
    username: string
    name: string
    profileurl: string
    bio: string
    isFollowing: boolean | null
  }
  parentCommentId: number | null
  content: string
  likeCount: number
  replyCount: number
  isEdited: boolean
  isPinned: boolean
  isBestAnswer: boolean
  createdAt: string
  editedAt: string | null
  isLiked: boolean
  isAuthor: boolean
  replies: Comment[]
}

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter() 
  const { user,user: currentUser, isLoggedIn } = useAuth()
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
  const postId = params.id

  // ✅ Fetch post + comments
  useEffect(() => {
    const fetchPostAndComments = async () => {
      if (!isLoggedIn) return
      try {
        setIsLoading(true)
        setError(null)
        const postResponse = await axios.get(`${API_BASE_URL}/api/posts/${postId}`)
        const commentsResponse = await axios.get(`${API_BASE_URL}/api/comments/post/${postId}`)

        setPost(postResponse.data)
        setComments(commentsResponse.data.content || [])
      } catch (err: any) {
        console.error('Error fetching post:', err)
        setError('Failed to load post. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPostAndComments()
  }, [postId, isLoggedIn, API_BASE_URL])

  // ✅ Like handler
  const handleLike = async () => {
    if (!post) return
    try {
      await axios.post(`${API_BASE_URL}/api/posts/${post.id}/react`, { reactionType: 'LIKE' })
      setPost(prev =>
        prev
          ? {
              ...prev,
              isLiked: !prev.isLiked,
              likeCount: prev.isLiked ? prev.likeCount - 1 : prev.likeCount + 1
            }
          : null
      )
    } catch (err) {
      console.error('Error liking post:', err)
    }
  }

  // ✅ Bookmark handler using path variables
  const handleBookmark = async () => {
    if (!post || !user) return
    try {
      await fetch(`${API_BASE_URL}/api/posts/${post.id}/bookmark/${currentUser?.userid}`, {
        method: 'POST'
      })
      setPost(prev =>
        prev
          ? {
              ...prev,
              isBookmarked: !prev.isBookmarked
            }
          : null
      )
    } catch (err) {
      console.error('Error bookmarking post:', err)
    }
  }

  // ✅ Submit comment handler
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !post || !user) return

    try {
      setIsSubmittingComment(true)
      const response = await axios.post(`${API_BASE_URL}/api/comments/${currentUser?.userid}`, {
        postId: post.id,
        content: newComment,
        parentCommentId: null
      })

      setComments(prev => [response.data, ...prev])
      setNewComment('')
      setPost(prev => (prev ? { ...prev, commentCount: prev.commentCount + 1 } : null))
    } catch (err) {
      console.error('Error submitting comment:', err)
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  // 🧭 Not logged in view
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to view this post</p>
          <button
            onClick={() => router.push('/login')}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <p className="text-gray-500 text-lg">Loading post...</p>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The post you are looking for does not exist.'}</p>
          <button
            onClick={() => router.push('/feed')}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Feed
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Post</h1>
          </div>
        </div>
      </div>

      {/* Post */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border">
          <div className="p-6 border-b flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <img
                src={post.author.profileurl || 'https://webcrumbs.cloud/placeholder'}
                alt={post.author.name}
                className="w-12 h-12 rounded-full object-cover"
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
                  {post.isEdited && ' · Edited'}
                </p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h1>
            {post.tags && post.tags.length > 0 && (
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
            <div className="prose max-w-none text-gray-700 leading-relaxed">
              {post.content.split('\n').map((p, i) => (
                <p key={i} className="mb-4">
                  {p}
                </p>
              ))}
            </div>
          </div>

          {/* Post stats */}
          <div className="px-6 py-4 border-t bg-gray-50 rounded-b-2xl flex justify-between items-center">
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{post.viewCount} views</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>{post.likeCount} likes</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span>{post.commentCount} comments</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                  post.isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                }`}
              >
                <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                <span>Like</span>
              </button>

              <button className="flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-green-600 transition-colors">
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>

              <button
                onClick={handleBookmark}
                className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                  post.isBookmarked ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${post.isBookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Comment form */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add a comment</h3>
          <form onSubmit={handleSubmitComment}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 px-4 py-3 text-black transition-colors resize-none"
              placeholder="Share your thoughts..."
              required
            />
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                disabled={isSubmittingComment || !newComment.trim()}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                {isSubmittingComment ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>
        </div>

        {/* Comments */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Comments ({post.commentCount})
          </h3>

          {comments.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="bg-white rounded-2xl shadow-sm border p-6">
                <div className="flex items-start space-x-3">
                  <img
                    src={comment.author.profileurl || 'https://webcrumbs.cloud/placeholder'}
                    alt={comment.author.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{comment.author.name}</h4>
                      {comment.isBestAnswer && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Best Answer
                        </span>
                      )}
                      <span className="text-sm text-gray-500">{formatTime(comment.createdAt)}</span>
                    </div>
                    <p className="text-gray-700 mb-3">{comment.content}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <button className="flex items-center space-x-1 hover:text-red-600 transition-colors">
                        <Heart className="w-4 h-4" />
                        <span>{comment.likeCount}</span>
                      </button>
                      <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span>Reply</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
