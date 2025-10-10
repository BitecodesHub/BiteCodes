"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import { useAuth } from '@/app/contexts/AuthContext'
import { 
  MapPin, 
  Calendar, 
  Users, 
  BookOpen, 
  MessageCircle,
  Heart,
  Eye,
  Mail,
  UserPlus,
  UserCheck,
  Settings
} from 'lucide-react'

interface UserProfile {
  id: number
  username: string
  name: string
  profileurl: string
  bio: string
  state: string
  createdAt: string
  followersCount: number
  followingCount: number
  postsCount: number
  isFollowing: boolean
  isOwnProfile: boolean
}

interface Post {
  id: number
  title: string
  contentPreview: string
  postType: string
  viewCount: number
  likeCount: number
  commentCount: number
  createdAt: string
  isLiked: boolean
}

export default function UserProfilePage() {
  const params = useParams()
  const { user: currentUser, isLoggedIn } = useAuth()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [userPosts, setUserPosts] = useState<Post[]>([])
  const [activeTab, setActiveTab] = useState<'posts' | 'about'>('posts')
  const [isLoading, setIsLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

  const userId = params.id

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isLoggedIn) return

      try {
        setIsLoading(true)
        setError(null)

        const profileResponse = await axios.get(`${API_BASE_URL}/api/users/${userId}/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })

        const postsResponse = await axios.get(`${API_BASE_URL}/api/posts/feed`, {
          params: {
            feedType: 'RECENT',
            page: 0,
            size: 20
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })

        setUserProfile(profileResponse.data)
        setIsFollowing(profileResponse.data.isFollowing)
        setUserPosts(postsResponse.data.posts || [])
      } catch (err: any) {
        console.error('Error fetching user profile:', err)
        setError('Failed to load user profile. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [userId, isLoggedIn, API_BASE_URL])

  const handleFollow = async () => {
    if (!userProfile) return

    try {
      if (isFollowing) {
        await axios.delete(`${API_BASE_URL}/api/users/${userId}/unfollow`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
      } else {
        await axios.post(`${API_BASE_URL}/api/users/${userId}/follow`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
      }
      setIsFollowing(!isFollowing)
      setUserProfile(prev => prev ? {
        ...prev,
        followersCount: isFollowing ? prev.followersCount - 1 : prev.followersCount + 1
      } : null)
    } catch (err) {
      console.error('Error following user:', err)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
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
          <p className="text-gray-600 mb-6">Please sign in to view profiles</p>
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm border p-8 max-w-md w-full text-center">
          <div className="animate-pulse">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The user profile does not exist.'}</p>
          <Link
            href="/feed"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
          >
            Back to Feed
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
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-6">
              <img
                src={userProfile.profileurl || 'https://webcrumbs.cloud/placeholder'}
                alt={userProfile.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{userProfile.name}</h1>
                <p className="text-gray-600">@{userProfile.username}</p>
                {userProfile.bio && (
                  <p className="text-gray-700 mt-2 max-w-md">{userProfile.bio}</p>
                )}
                
                <div className="flex items-center space-x-6 mt-4">
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {formatDate(userProfile.createdAt)}</span>
                  </div>
                  {userProfile.state && (
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{userProfile.state}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {userProfile.isOwnProfile ? (
                <Link
                  href="/profile"
                  className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </Link>
              ) : (
                <button
                  onClick={handleFollow}
                  className={`inline-flex items-center px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors font-medium ${
                    isFollowing
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500'
                      : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="w-4 h-4 mr-2" />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Follow
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-8 mt-6">
            <Link 
              href={`/users/${userId}/followers`}
              className="text-center hover:text-blue-600 transition-colors cursor-pointer"
            >
              <div className="text-2xl font-bold text-gray-900">{userProfile.followersCount}</div>
              <div className="text-sm text-gray-600">Followers</div>
            </Link>
            <Link
              href={`/users/${userId}/following`}
              className="text-center hover:text-blue-600 transition-colors cursor-pointer"
            >
              <div className="text-2xl font-bold text-gray-900">{userProfile.followingCount}</div>
              <div className="text-sm text-gray-600">Following</div>
            </Link>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{userProfile.postsCount}</div>
              <div className="text-sm text-gray-600">Posts</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 border-b mb-6">
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'posts'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'about'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            About
          </button>
        </div>

        {activeTab === 'posts' ? (
          <div className="space-y-6">
            {userPosts.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-600">
                  {userProfile.isOwnProfile 
                    ? "You haven't created any posts yet." 
                    : "This user hasn't created any posts yet."
                  }
                </p>
              </div>
            ) : (
              userPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <Link href={`/posts/${post.id}`}>
                      <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors cursor-pointer">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="text-gray-700 mb-4">{post.contentPreview}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{post.viewCount}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>{post.likeCount}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.commentCount}</span>
                        </div>
                      </div>
                      <span>{formatTime(post.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Bio</h4>
                <p className="text-gray-700">
                  {userProfile.bio || 'No bio provided.'}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Location</h4>
                  <p className="text-gray-700">
                    {userProfile.state || 'Not specified'}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Member Since</h4>
                  <p className="text-gray-700">
                    {formatDate(userProfile.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}