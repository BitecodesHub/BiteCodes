"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useAuth } from '@/app/contexts/AuthContext'
import { 
  ArrowLeft,
  Send,
  Image,
  Tag,
  Globe,
  Users,
  Lock,
  BookOpen,
  School
} from 'lucide-react'

const POST_TYPES = [
  { value: 'QUESTION', label: 'Question', icon: BookOpen },
  { value: 'DISCUSSION', label: 'Discussion', icon: Users },
  { value: 'ANNOUNCEMENT', label: 'Announcement', icon: Send },
  { value: 'DOUBT', label: 'Doubt', icon: BookOpen },
  { value: 'EXPERIENCE', label: 'Experience', icon: School },
  { value: 'RESOURCE', label: 'Resource', icon: BookOpen }
]

const VISIBILITY_OPTIONS = [
  { value: 'PUBLIC', label: 'Public', icon: Globe, description: 'Anyone can see' },
  { value: 'FOLLOWERS', label: 'Followers', icon: Users, description: 'Only your followers' },
  { value: 'PRIVATE', label: 'Private', icon: Lock, description: 'Only you' }
]

export default function CreatePostPage() {
  const router = useRouter()
  const { user, isLoggedIn,user:authUser } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    postType: 'QUESTION',
    entranceExamId: '',
    universitySlug: '',
    tags: [] as string[],
    visibility: 'PUBLIC'
  })

  const [currentTag, setCurrentTag] = useState('')

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to create a post</p>
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

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }))
      setCurrentTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (!formData.title.trim() || !formData.content.trim()) {
    setError('Title and content are required')
    return
  }

  try {
    setIsSubmitting(true)
    setError(null)

    // 👇 Build clean payload
    const payload = {
      ...formData,
      userId: authUser?.userid,   // 👈 add userId here
      entranceExamId: formData.entranceExamId.trim() === '' ? null : formData.entranceExamId,
      universitySlug: formData.universitySlug.trim() === '' ? null : formData.universitySlug,
    }

    const response = await axios.post(`${API_BASE_URL}/api/posts`, payload, {
    })

    if (response.status === 201) {
      router.push(`/posts/${response.data.id}`)
    }
  } catch (err: any) {
    console.error('Error creating post:', err)
    setError(err.response?.data?.message || 'Failed to create post. Please try again.')
  } finally {
    setIsSubmitting(false)
  }
}


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create Post</h1>
              <p className="text-gray-600">Share your thoughts with the community</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Post Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Post Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {POST_TYPES.map((type) => {
                  const IconComponent = type.icon
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, postType: type.value }))}
                      className={`flex items-center space-x-2 p-3 rounded-lg border-2 text-left transition-all ${
                        formData.postType === type.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="font-medium">{type.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 px-4 py-3 text-black transition-colors"
                placeholder="Enter a clear and descriptive title..."
                required
              />
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                id="content"
                rows={8}
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 px-4 py-3 text-black transition-colors resize-none"
                placeholder="Share your thoughts, questions, or experiences..."
                required
              />
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 px-4 py-2 text-black transition-colors"
                  placeholder="Add a tag..."
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
                >
                  <Tag className="w-4 h-4 mr-2" />
                  Add
                </button>
              </div>
            </div>

            {/* Exam & University */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="entranceExamId" className="block text-sm font-medium text-gray-700 mb-2">
                  Related Exam (Optional)
                </label>
                <input
                  type="text"
                  id="entranceExamId"
                  value={formData.entranceExamId}
                  onChange={(e) => setFormData(prev => ({ ...prev, entranceExamId: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 px-4 py-3 text-black transition-colors"
                  placeholder="e.g., jee-main, neet"
                />
              </div>

              <div>
                <label htmlFor="universitySlug" className="block text-sm font-medium text-gray-700 mb-2">
                  Related University (Optional)
                </label>
                <input
                  type="text"
                  id="universitySlug"
                  value={formData.universitySlug}
                  onChange={(e) => setFormData(prev => ({ ...prev, universitySlug: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 px-4 py-3 text-black transition-colors"
                  placeholder="e.g., iit-bombay, du"
                />
              </div>
            </div>

            {/* Visibility */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Visibility
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {VISIBILITY_OPTIONS.map((option) => {
                  const IconComponent = option.icon
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, visibility: option.value }))}
                      className={`flex items-center space-x-3 p-4 rounded-lg border-2 text-left transition-all ${
                        formData.visibility === option.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <IconComponent className="w-5 h-5 flex-shrink-0" />
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-gray-500">{option.description}</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5 mr-2" />
                {isSubmitting ? 'Publishing...' : 'Publish Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}