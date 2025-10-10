"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { useAuth } from '@/app/contexts/AuthContext'
import { 
  Bell,
  Heart,
  MessageCircle,
  Users,
  CheckCircle,
  TrendingUp,
  AtSign,
  Eye,
  EyeOff,
  CheckCheck
} from 'lucide-react'

interface Notification {
  id: number
  actor: {
    id: number
    username: string
    name: string
    profileurl: string
    bio: string
  }
  notificationType: 'LIKE' | 'COMMENT' | 'REPLY' | 'FOLLOW' | 'MENTION' | 'POST_FROM_FOLLOWING' | 'BEST_ANSWER'
  postId: number | null
  commentId: number | null
  message: string
  isRead: boolean
  createdAt: string
}

export default function NotificationsPage() {
  const { user, isLoggedIn } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL')
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!isLoggedIn) return

      try {
        setIsLoading(true)
        setError(null)

        const response = await axios.get(`${API_BASE_URL}/api/notifications`, {
          params: {
            page: 0,
            size: 50
          },
          
        })

        setNotifications(response.data.content || [])
      } catch (err: any) {
        console.error('Error fetching notifications:', err)
        setError('Failed to load notifications. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotifications()
  }, [isLoggedIn, API_BASE_URL])

  const markAsRead = async (notificationId: number) => {
    try {
      await axios.post(`${API_BASE_URL}/api/notifications/${notificationId}/mark-read`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      setNotifications(prev => prev.map(notif =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      ))
    } catch (err) {
      console.error('Error marking notification as read:', err)
    }
  }

  const markAllAsRead = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/notifications/mark-read`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })))
    } catch (err) {
      console.error('Error marking all notifications as read:', err)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'LIKE':
        return <Heart className="w-5 h-5 text-red-500" />
      case 'COMMENT':
      case 'REPLY':
        return <MessageCircle className="w-5 h-5 text-blue-500" />
      case 'FOLLOW':
        return <Users className="w-5 h-5 text-green-500" />
      case 'MENTION':
        return <AtSign className="w-5 h-5 text-purple-500" />
      case 'BEST_ANSWER':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'POST_FROM_FOLLOWING':
        return <TrendingUp className="w-5 h-5 text-orange-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case 'LIKE': return 'liked your post'
      case 'COMMENT': return 'commented on your post'
      case 'REPLY': return 'replied to your comment'
      case 'FOLLOW': return 'started following you'
      case 'MENTION': return 'mentioned you'
      case 'BEST_ANSWER': return 'marked your answer as best'
      case 'POST_FROM_FOLLOWING': return 'created a new post'
      default: return type.toLowerCase().replace('_', ' ')
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

  const filteredNotifications = notifications.filter(notif =>
    filter === 'ALL' ? true : !notif.isRead
  )

  const unreadCount = notifications.filter(notif => !notif.isRead).length

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to view notifications</p>
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-600">Stay updated with community activity</p>
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                <CheckCheck className="w-4 h-4 mr-2" />
                Mark all as read
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 border-b mt-6">
            <button
              onClick={() => setFilter('ALL')}
              className={`flex items-center px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                filter === 'ALL'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Eye className="w-4 h-4 mr-2" />
              All
            </button>
            <button
              onClick={() => setFilter('UNREAD')}
              className={`flex items-center px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                filter === 'UNREAD'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <EyeOff className="w-4 h-4 mr-2" />
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border p-4 animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
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
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {filter === 'UNREAD' ? 'No unread notifications' : 'No notifications yet'}
            </h3>
            <p className="text-gray-600">
              {filter === 'UNREAD' 
                ? "You're all caught up!" 
                : "You'll see notifications here when you get likes, comments, or follows."
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-2xl shadow-sm border p-4 hover:shadow-md transition-shadow ${
                  !notification.isRead ? 'border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      src={notification.actor.profileurl || 'https://webcrumbs.cloud/placeholder'}
                      alt={notification.actor.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2 mb-1">
                        {getNotificationIcon(notification.notificationType)}
                        <Link
                          href={`/users/${notification.actor.id}`}
                          className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          {notification.actor.name}
                        </Link>
                        <span className="text-gray-600">
                          {getNotificationTypeLabel(notification.notificationType)}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          {formatTime(notification.createdAt)}
                        </span>
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            title="Mark as read"
                          >
                            <CheckCheck className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-700 mb-2">{notification.message}</p>

                    {(notification.postId || notification.commentId) && (
                      <div className="flex space-x-2">
                        {notification.postId && (
                          <Link
                            href={`/posts/${notification.postId}`}
                            className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                          >
                            View Post
                          </Link>
                        )}
                        {notification.commentId && notification.postId && (
                          <Link
                            href={`/posts/${notification.postId}#comment-${notification.commentId}`}
                            className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            View Comment
                          </Link>
                        )}
                      </div>
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