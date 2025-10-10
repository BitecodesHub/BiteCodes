"use client"

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { useAuth } from '@/app/contexts/AuthContext'
import { 
  ArrowLeft,
  Send,
  Paperclip,
  MoreHorizontal,
  User,
  Clock
} from 'lucide-react'

interface Message {
  id: number
  conversationId: number
  sender: {
    id: number
    username: string
    name: string
    profileurl: string
    bio: string
  }
  content: string
  messageType: string
  mediaUrl: string | null
  isRead: boolean
  createdAt: string
  readAt: string | null
  isSentByMe: boolean
}

interface Conversation {
  id: number
  otherUser: {
    id: number
    username: string
    name: string
    profileurl: string
    bio: string
  }
}

export default function ChatConversationPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isLoggedIn } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

  const conversationId = params.conversationId

  useEffect(() => {
    const fetchConversationData = async () => {
      if (!isLoggedIn) return

      try {
        setIsLoading(true)
        setError(null)

        // Fetch conversation details
        const conversationsResponse = await axios.get(`${API_BASE_URL}/api/chat/conversations`, {
          
        })

        const currentConversation = conversationsResponse.data.content.find(
          (conv: any) => conv.id.toString() === conversationId
        )

        if (!currentConversation) {
          setError('Conversation not found')
          return
        }

        setConversation(currentConversation)

        // Fetch messages
        const messagesResponse = await axios.get(
          `${API_BASE_URL}/api/chat/conversations/${conversationId}/messages`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        )

        setMessages(messagesResponse.data.content || [])

        // Mark messages as read
        await axios.post(
          `${API_BASE_URL}/api/chat/conversations/${conversationId}/read`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        )
      } catch (err: any) {
        console.error('Error fetching conversation:', err)
        setError('Failed to load conversation. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchConversationData()
  }, [conversationId, isLoggedIn, API_BASE_URL])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !conversation) return

    try {
      setIsSending(true)

      const response = await axios.post(`${API_BASE_URL}/api/chat/messages`, 
        {
          receiverId: conversation.otherUser.id,
          content: newMessage,
          messageType: 'TEXT',
          mediaUrl: null
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      setMessages(prev => [...prev, response.data])
      setNewMessage('')
    } catch (err) {
      console.error('Error sending message:', err)
    } finally {
      setIsSending(false)
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const isNewDay = (currentMsg: Message, previousMsg: Message | null) => {
    if (!previousMsg) return true
    const currentDate = new Date(currentMsg.createdAt).toDateString()
    const previousDate = new Date(previousMsg.createdAt).toDateString()
    return currentDate !== previousDate
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to view messages</p>
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading conversation...</p>
        </div>
      </div>
    )
  }

  if (error || !conversation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Conversation Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The conversation does not exist.'}</p>
          <button
            onClick={() => router.push('/chat')}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Messages
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/chat')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
            </button>
            <img
              src={conversation.otherUser.profileurl || 'https://webcrumbs.cloud/placeholder'}
              alt={conversation.otherUser.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <h1 className="font-semibold text-gray-900">{conversation.otherUser.name}</h1>
              <p className="text-sm text-gray-500">@{conversation.otherUser.username}</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages yet</h3>
              <p className="text-gray-600">Start a conversation with {conversation.otherUser.name}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => {
                const previousMessage = index > 0 ? messages[index - 1] : null
                const showDate = isNewDay(message, previousMessage)

                return (
                  <div key={message.id}>
                    {/* Date separator */}
                    {showDate && (
                      <div className="flex justify-center my-6">
                        <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
                          {formatDate(message.createdAt)}
                        </span>
                      </div>
                    )}

                    {/* Message */}
                    <div className={`flex ${message.isSentByMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.isSentByMe
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-white border border-gray-200 text-gray-900 rounded-bl-none'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <div className={`text-xs mt-1 ${
                          message.isSentByMe ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatTime(message.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <form onSubmit={handleSendMessage} className="flex space-x-4">
            <button
              type="button"
              className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 px-4 py-3 text-black"
              placeholder="Type a message..."
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={isSending || !newMessage.trim()}
              className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}