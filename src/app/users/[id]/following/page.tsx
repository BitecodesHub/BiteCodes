"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import { useAuth } from '../../../contexts/AuthContext'
import { 
  ArrowLeft,
  Users,
  UserMinus,
  MapPin,
  Calendar
} from 'lucide-react'

interface Following {
  id: number
  username: string
  name: string
  profileurl: string
  bio: string
  isFollowing: boolean
}

export default function FollowingPage() {
  const params = useParams()
  const { user: currentUser, isLoggedIn } = useAuth()
  const [following, setFollowing] = useState<Following[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

  const userId = params.id

  useEffect(() => {
    const fetchFollowing = async () => {
      if (!isLoggedIn) return

      try {
        setIsLoading(true)
        setError(null)

        const response = await axios.get(`${API_BASE_URL}/api/users/${userId}/following`, {
         
        })

        setFollowing(response.data.content || [])
      } catch (err: any) {
        console.error('Error fetching following:', err)
        setError('Failed to load following. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFollowing()
  }, [userId, isLoggedIn, API_BASE_URL])

  const handleUnfollow = async (followingId: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/users/${followingId}/unfollow`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      // Update local state
      setFollowing(prev => prev.map(user =>
        user.id === followingId 
          ? { ...user, isFollowing: false }
          : user
      ))
    } catch (err) {
      console.error('Error unfollowing user:', err)
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to view following</p>
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
                <h1 className="text-2xl font-bold text-gray-900">Following</h1>
                <p className="text-gray-600">People this user follows</p>
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
        ) : following.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Not following anyone</h3>
            <p className="text-gray-600">This user isn't following anyone yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {following.map((user) => (
              <div key={user.id} className="bg-white rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Link href={`/users/${user.id}`}>
                        <img
                          src={user.profileurl || 'https://webcrumbs.cloud/placeholder'}
                          alt={user.name}
                          className="w-14 h-14 rounded-full object-cover cursor-pointer"
                        />
                      </Link>
                      <div>
                        <Link href={`/users/${user.id}`}>
                          <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
                            {user.name}
                          </h3>
                        </Link>
                        <p className="text-gray-600">@{user.username}</p>
                        {user.bio && (
                          <p className="text-gray-700 text-sm mt-1 line-clamp-2">
                            {user.bio}
                          </p>
                        )}
                      </div>
                    </div>

                    {user.id !== currentUser?.userid && user.isFollowing && (
                      <button
                        onClick={() => handleUnfollow(user.id)}
                        className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors font-medium"
                      >
                        <UserMinus className="w-4 h-4 mr-2" />
                        Unfollow
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