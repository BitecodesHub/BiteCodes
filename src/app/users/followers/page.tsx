"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import { useAuth } from '@/app/contexts/AuthContext'
import { 
  ArrowLeft,
  Users,
  UserPlus,
  UserCheck,
  MapPin,
  Calendar
} from 'lucide-react'

interface Follower {
  id: number
  username: string
  name: string
  profileurl: string
  bio: string
  isFollowing: boolean
}

export default function FollowersPage() {
  const params = useParams()
  const { user: currentUser, isLoggedIn } = useAuth()
  const [followers, setFollowers] = useState<Follower[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

  const userId = params.id

  useEffect(() => {
    const fetchFollowers = async () => {
      if (!isLoggedIn) return

      try {
        setIsLoading(true)
        setError(null)

        const response = await axios.get(`${API_BASE_URL}/api/users/${userId}/followers`, {
          
        })

        setFollowers(response.data.content || [])
      } catch (err: any) {
        console.error('Error fetching followers:', err)
        setError('Failed to load followers. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFollowers()
  }, [userId, isLoggedIn, API_BASE_URL])

  const handleFollow = async (followerId: number, currentFollowing: boolean) => {
    try {
      if (currentFollowing) {
        await axios.delete(`${API_BASE_URL}/api/users/${followerId}/unfollow`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
      } else {
        await axios.post(`${API_BASE_URL}/api/users/${followerId}/follow`, {}, {
         
        })
      }

      // Update local state
      setFollowers(prev => prev.map(follower =>
        follower.id === followerId 
          ? { ...follower, isFollowing: !currentFollowing }
          : follower
      ))
    } catch (err) {
      console.error('Error following user:', err)
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to view followers</p>
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
          <div className="flex items-center space-x-4">
            <Link
              href={`/users/${userId}`}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
            </Link>
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Followers</h1>
                <p className="text-gray-600">People who follow this user</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border p-6 animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="w-20 h-8 bg-gray-200 rounded"></div>
                </div>
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
        ) : followers.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No followers yet</h3>
            <p className="text-gray-600">This user doesn't have any followers</p>
          </div>
        ) : (
          <div className="space-y-4">
            {followers.map((follower) => (
              <div key={follower.id} className="bg-white rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Link href={`/users/${follower.id}`}>
                        <img
                          src={follower.profileurl || 'https://webcrumbs.cloud/placeholder'}
                          alt={follower.name}
                          className="w-14 h-14 rounded-full object-cover cursor-pointer"
                        />
                      </Link>
                      <div>
                        <Link href={`/users/${follower.id}`}>
                          <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
                            {follower.name}
                          </h3>
                        </Link>
                        <p className="text-gray-600">@{follower.username}</p>
                        {follower.bio && (
                          <p className="text-gray-700 text-sm mt-1 line-clamp-2">
                            {follower.bio}
                          </p>
                        )}
                      </div>
                    </div>

                    {follower.id !== currentUser?.userid && (
                      <button
                        onClick={() => handleFollow(follower.id, follower.isFollowing)}
                        className={`inline-flex items-center px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors font-medium ${
                          follower.isFollowing
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500'
                            : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                        }`}
                      >
                        {follower.isFollowing ? (
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}