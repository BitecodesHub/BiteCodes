"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
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
  Settings,
  Bookmark,
  TrendingUp,
  Award,
  Activity,
  Share2,
  MoreVertical,
  Flag,
  Ban,
  Copy,
  Check,
  ExternalLink,
  Filter,
  Clock,
  Zap,
  Bell,
  Search
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
  isBookmarked?: boolean
  tags?: string[]
}

interface UserStats {
  totalViews: number
  totalLikes: number
  totalComments: number
  topPostId?: number
}

export default function UserProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { user: currentUser, isLoggedIn } = useAuth()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [userPosts, setUserPosts] = useState<Post[]>([])
  const [activeTab, setActiveTab] = useState<'posts' | 'about' | 'activity'>('posts')
  const [isLoading, setIsLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copied, setCopied] = useState(false)
  const [postFilter, setPostFilter] = useState<'all' | 'popular' | 'recent'>('all')
  const [userStats, setUserStats] = useState<UserStats>({
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0
  })
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

  const userId = params.id as string // Ensure userId is a string

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isLoggedIn) return

      try {
        setIsLoading(true)
        setError(null)

        const profileResponse = await axios.get<UserProfile>(`${API_BASE_URL}/api/users/${userId}/profile`, {
          withCredentials: true
        })
        
        const postsResponse = await axios.get<{ posts: Post[] }>(`${API_BASE_URL}/api/posts/feed`, {
          params: {
            feedType: 'RECENT',
            page: 0,
            size: 20
          },
          withCredentials: true
        })

        setUserProfile(profileResponse.data)
        setIsFollowing(profileResponse.data.isFollowing)
        const posts = postsResponse.data.posts || []
        setUserPosts(posts)
        
        // Calculate user stats
        const stats = posts.reduce((acc: UserStats, post: Post) => ({
          totalViews: acc.totalViews + post.viewCount,
          totalLikes: acc.totalLikes + post.likeCount,
          totalComments: acc.totalComments + post.commentCount,
          topPostId: acc.topPostId // Not used in current implementation
        }), { totalViews: 0, totalLikes: 0, totalComments: 0 })
        
        setUserStats(stats)
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load user profile. Please try again.'
        console.error('Error fetching user profile:', err)
        setError(errorMessage)
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
          withCredentials: true
        })
      } else {
        await axios.post(`${API_BASE_URL}/api/users/${userId}/follow`, {}, {
          withCredentials: true
        })
      }
      setIsFollowing(!isFollowing)
      setUserProfile(prev => prev ? {
        ...prev,
        followersCount: isFollowing ? prev.followersCount - 1 : prev.followersCount + 1
      } : null)
    } catch (err: unknown) {
      console.error('Error following user:', err)
      setError('Failed to update follow status.')
    }
  }

  const handleStartChat = () => {
    router.push(`/chat?userId=${userId}`)
  }

  const handleLikePost = async (postId: number, isLiked: boolean) => {
    try {
      if (isLiked) {
        await axios.delete(`${API_BASE_URL}/api/posts/${postId}/unlike`, {
          withCredentials: true
        })
      } else {
        await axios.post(`${API_BASE_URL}/api/posts/${postId}/like`, {}, {
          withCredentials: true
        })
      }
      
      setUserPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, isLiked: !isLiked, likeCount: isLiked ? post.likeCount - 1 : post.likeCount + 1 }
          : post
      ))
    } catch (err: unknown) {
      console.error('Error liking post:', err)
      setError('Failed to update post like.')
    }
  }

  const handleBookmarkPost = async (postId: number, isBookmarked: boolean) => {
    try {
      if (isBookmarked) {
        await axios.delete(`${API_BASE_URL}/api/posts/${postId}/unbookmark`, {
          withCredentials: true
        })
      } else {
        await axios.post(`${API_BASE_URL}/api/posts/${postId}/bookmark`, {}, {
          withCredentials: true
        })
      }
      
      setUserPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, isBookmarked: !isBookmarked }
          : post
      ))
    } catch (err: unknown) {
      console.error('Error bookmarking post:', err)
      setError('Failed to update bookmark.')
    }
  }

  const handleShareProfile = () => {
    const profileUrl = `${window.location.origin}/users/${userId}`
    navigator.clipboard.writeText(profileUrl)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
      setShowShareMenu(false)
    }, 2000)
  }

  const handleReportUser = () => {
    setShowMoreMenu(false)
    alert('Report functionality: This would open a report modal or redirect to a report page')
  }

  const handleBlockUser = () => {
    setShowMoreMenu(false)
    if (confirm(`Are you sure you want to block ${userProfile?.name}?`)) {
      alert('Block functionality: This would call the block API endpoint')
    }
  }

  const getFilteredPosts = () => {
    const filtered = [...userPosts]
    
    switch (postFilter) {
      case 'popular':
        return filtered.sort((a, b) => (b.likeCount + b.commentCount) - (a.likeCount + a.commentCount))
      case 'recent':
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      default:
        return filtered
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
    
    if (isNaN(diffInHours)) return 'Invalid date'
    if (diffInHours < 1) return `${Math.floor(diffInHours * 60)}m ago`
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  const getPostTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      QUESTION: 'bg-purple-100 text-purple-700',
      DISCUSSION: 'bg-blue-100 text-blue-700',
      ANNOUNCEMENT: 'bg-red-100 text-red-700',
      DOUBT: 'bg-orange-100 text-orange-700',
      EXPERIENCE: 'bg-green-100 text-green-700',
      RESOURCE: 'bg-teal-100 text-teal-700'
    }
    return colors[type] || 'bg-gray-100 text-gray-700'
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to view profiles</p>
          <Link
            href="/login"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
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
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Back to Feed
          </Link>
        </div>
      </div>
    )
  }

  const filteredPosts = getFilteredPosts()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/feed" className="text-2xl font-bold text-blue-600">
                StudyHub
              </Link>
              <div className="hidden md:flex items-center space-x-1">
                <Link
                  href="/feed"
                  className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Feed
                </Link>
                <Link
                  href="/search"
                  className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Search className="w-5 h-5" />
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Link
                href="/notifications"
                className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Link>
              <Link
                href="/chat"
                className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Messages"
              >
                <MessageCircle className="w-5 h-5" />
              </Link>
              <Link
                href="/bookmarks"
                className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Bookmarks"
              >
                <Bookmark className="w-5 h-5" />
              </Link>
              <Link
                href="/create-post"
                className="hidden md:inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                Create Post
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-start space-x-6">
              <div className="relative">
                <img
                  src={userProfile.profileurl || 'https://webcrumbs.cloud/placeholder'}
                  alt={`${userProfile.name}'s profile picture`}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold text-gray-900">{userProfile.name}</h1>
                  {userProfile.postsCount > 50 && (
                    <Award className="w-5 h-5 text-yellow-500" title="Active Contributor" />
                  )}
                </div>
                <p className="text-gray-600">@{userProfile.username}</p>
                {userProfile.bio && (
                  <p className="text-gray-700 mt-2 max-w-md">{userProfile.bio}</p>
                )}
                
                <div className="flex items-center flex-wrap gap-4 mt-4">
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

            <div className="flex items-center space-x-2 flex-wrap">
              {userProfile.isOwnProfile ? (
                <Link
                  href="/profile"
                  className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </Link>
              ) : (
                <>
                  <button
                    onClick={handleStartChat}
                    className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    aria-label={`Message ${userProfile.name}`}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Message
                  </button>
                  <button
                    onClick={handleFollow}
                    className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors font-medium ${
                      isFollowing
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                    aria-label={isFollowing ? `Unfollow ${userProfile.name}` : `Follow ${userProfile.name}`}
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
                  <div className="relative">
                    <button
                      onClick={() => setShowMoreMenu(!showMoreMenu)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label="More options"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>
                    {showMoreMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                        <button
                          onClick={() => {
                            setShowMoreMenu(false)
                            setShowShareMenu(true)
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                          aria-label="Share profile"
                        >
                          <Share2 className="w-4 h-4" />
                          <span>Share Profile</span>
                        </button>
                        <button
                          onClick={handleReportUser}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                          aria-label={`Report ${userProfile.name}`}
                        >
                          <Flag className="w-4 h-4" />
                          <span>Report User</span>
                        </button>
                        <button
                          onClick={handleBlockUser}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                          aria-label={`Block ${userProfile.name}`}
                        >
                          <Ban className="w-4 h-4" />
                          <span>Block User</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-6 mt-6 pt-6 border-t overflow-x-auto">
            <Link 
              href={`/users/${userId}/followers`}
              className="text-center hover:text-blue-600 transition-colors cursor-pointer flex-shrink-0"
            >
              <div className="text-2xl font-bold text-gray-900">{userProfile.followersCount}</div>
              <div className="text-sm text-gray-600">Followers</div>
            </Link>
            <Link
              href={`/users/${userId}/following`}
              className="text-center hover:text-blue-600 transition-colors cursor-pointer flex-shrink-0"
            >
              <div className="text-2xl font-bold text-gray-900">{userProfile.followingCount}</div>
              <div className="text-sm text-gray-600">Following</div>
            </Link>
            <div className="text-center flex-shrink-0">
              <div className="text-2xl font-bold text-gray-900">{userProfile.postsCount}</div>
              <div className="text-sm text-gray-600">Posts</div>
            </div>
            <div className="text-center flex-shrink-0">
              <div className="text-2xl font-bold text-gray-900">{userStats.totalLikes}</div>
              <div className="text-sm text-gray-600">Likes</div>
            </div>
            <div className="text-center flex-shrink-0">
              <div className="text-2xl font-bold text-gray-900">{userStats.totalViews}</div>
              <div className="text-sm text-gray-600">Views</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 border-b mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'posts'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            aria-label="View posts"
          >
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Posts</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'activity'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            aria-label="View activity"
          >
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>Activity</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'about'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            aria-label="View about"
          >
            About
          </button>
        </div>

        {activeTab === 'posts' ? (
          <div>
            {/* Post Filter */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={postFilter}
                  onChange={(e) => setPostFilter(e.target.value as 'all' | 'popular' | 'recent')}
                  className="text-sm border-none bg-transparent text-gray-700 font-medium focus:outline-none cursor-pointer"
                  aria-label="Filter posts"
                >
                  <option value="all">All Posts</option>
                  <option value="popular">Most Popular</option>
                  <option value="recent">Most Recent</option>
                </select>
              </div>
              <div className="text-sm text-gray-500">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
              </div>
            </div>

            <div className="space-y-6">
              {filteredPosts.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
                  <p className="text-gray-600 mb-4">
                    {userProfile.isOwnProfile 
                      ? "You haven't created any posts yet." 
                      : "This user hasn't created any posts yet."
                    }
                  </p>
                  {userProfile.isOwnProfile && (
                    <Link
                      href="/create-post"
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Create Your First Post
                    </Link>
                  )}
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <div key={post.id} className="bg-white rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3 gap-2">
                        <div className="flex items-center space-x-2 flex-wrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPostTypeColor(post.postType)}`}>
                            {post.postType}
                          </span>
                          {post.tags && post.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">{formatTime(post.createdAt)}</span>
                      </div>
                      
                      <Link href={`/posts/${post.id}`}>
                        <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors cursor-pointer">
                          {post.title}
                        </h2>
                      </Link>
                      <p className="text-gray-700 mb-4 line-clamp-3">{post.contentPreview}</p>
                      
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleLikePost(post.id, post.isLiked)}
                            className={`flex items-center space-x-1 text-sm transition-colors ${
                              post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                            }`}
                            aria-label={post.isLiked ? `Unlike post ${post.title}` : `Like post ${post.title}`}
                          >
                            <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                            <span>{post.likeCount}</span>
                          </button>
                          <Link href={`/posts/${post.id}#comments`} className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-500 transition-colors">
                            <MessageCircle className="w-4 h-4" />
                            <span>{post.commentCount}</span>
                          </Link>
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Eye className="w-4 h-4" />
                            <span>{post.viewCount}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleBookmarkPost(post.id, post.isBookmarked || false)}
                          className={`p-2 rounded-lg transition-colors ${
                            post.isBookmarked ? 'text-blue-500 bg-blue-50' : 'text-gray-500 hover:bg-gray-100'
                          }`}
                          aria-label={post.isBookmarked ? `Remove bookmark from post ${post.title}` : `Bookmark post ${post.title}`}
                        >
                          <Bookmark className={`w-4 h-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : activeTab === 'activity' ? (
          <div className="space-y-6">
            {/* Activity Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Avg. Views per Post</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {userProfile.postsCount > 0 ? Math.round(userStats.totalViews / userProfile.postsCount) : 0}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Engagement Rate</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {userStats.totalViews > 0 
                        ? `${Math.round(((userStats.totalLikes + userStats.totalComments) / userStats.totalViews) * 100)}%`
                        : '0%'
                      }
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Activity className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Engagement</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {userStats.totalLikes + userStats.totalComments}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Zap className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity Timeline */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                {userPosts.slice(0, 5).map(post => (
                  <div key={post.id} className="flex items-start space-x-3 pb-4 border-b last:border-b-0">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <Link href={`/posts/${post.id}`} className="font-medium text-gray-900 hover:text-blue-600">
                        {post.title}
                      </Link>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                        <span>{post.likeCount} likes</span>
                        <span>{post.commentCount} comments</span>
                        <span>{formatTime(post.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {userPosts.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No activity yet</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Bio</h4>
                <p className="text-gray-700">
                  {userProfile.bio || 'No bio provided.'}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div className="pt-4 border-t">
                <h4 className="font-medium text-gray-900 mb-3">Community Stats</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Total Posts</p>
                    <p className="text-2xl font-bold text-gray-900">{userProfile.postsCount}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Total Likes</p>
                    <p className="text-2xl font-bold text-gray-900">{userStats.totalLikes}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Total Views</p>
                    <p className="text-2xl font-bold text-gray-900">{userStats.totalViews}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Total Comments</p>
                    <p className="text-2xl font-bold text-gray-900">{userStats.totalComments}</p>
                  </div>
                </div>
              </div>

              {!userProfile.isOwnProfile && (
                <div className="pt-4 border-t">
                  <h4 className="font-medium text-gray-900 mb-3">Connect</h4>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleStartChat}
                      className="flex-1 flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      aria-label={`Send message to ${userProfile.name}`}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Send Message
                    </button>
                    <button
                      onClick={handleFollow}
                      className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg transition-colors font-medium ${
                        isFollowing
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                      aria-label={isFollowing ? `Unfollow ${userProfile.name}` : `Follow ${userProfile.name}`}
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
                  </div>
                </div>
              )}

              {userProfile.isOwnProfile && (
                <div className="pt-4 border-t">
                  <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/profile"
                      className="flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Link>
                    <Link
                      href="/create-post"
                      className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Create Post
                    </Link>
                    <Link
                      href="/bookmarks"
                      className="flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      <Bookmark className="w-4 h-4 mr-2" />
                      Bookmarks
                    </Link>
                    <Link
                      href="/notifications"
                      className="flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      Notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Share Menu Modal */}
      {showShareMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowShareMenu(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Profile</h3>
            <div className="space-y-3">
              <button
                onClick={handleShareProfile}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label={copied ? 'Link copied' : 'Copy profile link'}
              >
                <div className="flex items-center space-x-3">
                  {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-gray-600" />}
                  <span className="text-gray-700">{copied ? 'Link Copied!' : 'Copy Link'}</span>
                </div>
              </button>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Check out ${userProfile.name}'s profile`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Share on Twitter"
              >
                <div className="flex items-center space-x-3">
                  <ExternalLink className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Share on Twitter</span>
                </div>
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Share on LinkedIn"
              >
                <div className="flex items-center space-x-3">
                  <ExternalLink className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Share on LinkedIn</span>
                </div>
              </a>
            </div>
            <button
              onClick={() => setShowShareMenu(false)}
              className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              aria-label="Close share menu"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-40">
        <div className="flex items-center justify-around py-3 px-4">
          <Link href="/feed" className="flex flex-col items-center text-gray-600 hover:text-blue-600" aria-label="Feed">
            <BookOpen className="w-5 h-5" />
            <span className="text-xs mt-1">Feed</span>
          </Link>
          <Link href="/search" className="flex flex-col items-center text-gray-600 hover:text-blue-600" aria-label="Search">
            <Search className="w-5 h-5" />
            <span className="text-xs mt-1">Search</span>
          </Link>
          <Link href="/create-post" className="flex flex-col items-center text-gray-600 hover:text-blue-600" aria-label="Create post">
            <BookOpen className="w-5 h-5" />
            <span className="text-xs mt-1">Create</span>
          </Link>
          <Link href="/notifications" className="flex flex-col items-center text-gray-600 hover:text-blue-600 relative" aria-label="Notifications">
            <Bell className="w-5 h-5" />
            <span className="text-xs mt-1">Alerts</span>
            <span className="absolute top-0 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-gray-600 hover:text-blue-600" aria-label="Profile">
            <Users className="w-5 h-5" />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </div>

      {/* Add padding at bottom for mobile nav */}
      <div className="md:hidden h-20"></div>
    </div>
  )
}