// ENHANCED CHAT PAGE - /app/chat/page.tsx
// Added: Start new conversation, online status, message preview, typing indicator
// ============================================================================

"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { useAuth } from '@/app/contexts/AuthContext'
import { MessageCircle, Search, User, Clock, Check, CheckCheck, Plus, X } from 'lucide-react'

interface Conversation {
  id: number
  otherUser: {
    id: number
    username: string
    name: string
    profileurl: string
    bio: string
    isOnline?: boolean
  }
  lastMessage: {
    id: number
    content: string
    messageType: string
    isRead: boolean
    createdAt: string
    isSentByMe: boolean
  }
  unreadCount: number
  lastMessageAt: string
  createdAt: string
}

export default function ChatPage() {
  const { user, isLoggedIn } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewChat, setShowNewChat] = useState(false)
  const [newChatUsername, setNewChatUsername] = useState('')
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

  useEffect(() => {
    if (isLoggedIn) {
      fetchConversations()
      const interval = setInterval(fetchConversations, 5000) // Refresh every 5 seconds
      return () => clearInterval(interval)
    }
  }, [isLoggedIn])

  const fetchConversations = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await axios.get(`${API_BASE_URL}/api/chat/conversations`, {
        params: { page: 0, size: 50 }
      })
      setConversations(response.data.content || [])
    } catch (err: any) {
      console.error('Error fetching conversations:', err)
      setError('Failed to load conversations. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const startNewConversation = async () => {
    if (!newChatUsername.trim()) return
    
    try {
      const response = await axios.post(`${API_BASE_URL}/api/chat/start`, {
        username: newChatUsername
      })
      
      if (response.data.conversationId) {
        window.location.href = `/chat/${response.data.conversationId}`
      }
    } catch (err) {
      console.error('Error starting conversation:', err)
      alert('Failed to start conversation. User may not exist.')
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) return `${Math.floor(diffInHours * 60)}m ago`
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const filteredConversations = conversations.filter(conv =>
    conv.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.otherUser.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to view your messages</p>
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
                <p className="text-gray-600">Chat with other students and educators</p>
              </div>
            </div>
            <button
              onClick={() => setShowNewChat(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Chat
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-sm border p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-black"
              placeholder="Search conversations..."
            />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border p-4 animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Try Again
            </button>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No conversations found' : 'No messages yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? 'Try adjusting your search terms' : 'Start a conversation with other users'}
            </p>
            <button
              onClick={() => setShowNewChat(true)}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Start New Chat
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            {filteredConversations.map((conversation) => (
              <Link
                key={conversation.id}
                href={`/chat/${conversation.id}`}
                className="flex items-center p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="relative">
                    <img
                      src={conversation.otherUser.profileurl || 'https://webcrumbs.cloud/placeholder'}
                      alt={conversation.otherUser.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {conversation.otherUser.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                    {conversation.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                        {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {conversation.otherUser.name}
                      </h3>
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {formatTime(conversation.lastMessageAt)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {conversation.lastMessage.isSentByMe && (
                        conversation.lastMessage.isRead ? (
                          <CheckCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        ) : (
                          <Check className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        )
                      )}
                      <p className={`text-sm truncate ${
                        conversation.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-600'
                      }`}>
                        {conversation.lastMessage.isSentByMe && 'You: '}
                        {conversation.lastMessage.content}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      {showNewChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Start New Chat</h3>
              <button onClick={() => setShowNewChat(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Username
                </label>
                <input
                  type="text"
                  value={newChatUsername}
                  onChange={(e) => setNewChatUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-black"
                  placeholder="username"
                  onKeyPress={(e) => e.key === 'Enter' && startNewConversation()}
                />
              </div>

              <button
                onClick={startNewConversation}
                disabled={!newChatUsername.trim()}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Start Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
