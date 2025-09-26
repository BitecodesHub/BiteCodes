"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/app/contexts/AuthContext' // Import useAuth
import { 
  User, 
  Loader2, 
  Save, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Calendar, 
  Shield, 
  Info,
  Edit3,
  CheckCircle,
  AlertCircle,
  Camera,
  Upload
} from 'lucide-react'

interface UserData {
  id: number
  username: string
  name: string
  profileurl: string
  phonenum: string
  state: string
  password: string
  email: string
  role: string
  enabled: boolean
  otp: string
  otpExpiry: string
  bio: string
  timezone: string
  availability: string
  createdAt: string
}

export default function ProfilePage() {
  const { user: authUser, isLoggedIn, loading: authLoading } = useAuth() // Use AuthContext
  const [user, setUser] = useState<UserData | null>(null)
  const [formData, setFormData] = useState({ 
    name: '', 
    username: '', 
    email: '', 
    phonenum: '', 
    state: '', 
    bio: '', 
    timezone: '', 
    availability: '' 
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

  // Debug logging
  useEffect(() => {
    console.log("🔍 Profile Page State:", {
      authUser,
      isLoggedIn,
      authLoading,
      hasAuthUser: !!authUser,
      authUserId: authUser?.userid
    })
  }, [authUser, isLoggedIn, authLoading])

  // Form validation
  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required'
    }
    
    if (!formData.username.trim()) {
      errors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters'
    }
    
    if (formData.phonenum && !/^\d{10,15}$/.test(formData.phonenum.replace(/\s/g, ''))) {
      errors.phonenum = 'Phone number must be 10-15 digits'
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      // Wait for auth to load
      if (authLoading) {
        console.log("⏳ Waiting for auth to load...")
        return
      }

      // Check if user is logged in via AuthContext
      if (!isLoggedIn || !authUser) {
        console.log("❌ Not logged in or no auth user")
        setError('Please log in to view your profile')
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        console.log("🚀 Fetching user data for ID:", authUser.userid)

        const response = await axios.get(`${API_BASE_URL}/api/auth/user/${authUser.userid}`)

        if (response.status === 200 && response.data) {
          console.log("✅ User data fetched:", response.data)
          setUser(response.data)
          setFormData({
            name: response.data.name || '',
            username: response.data.username || '',
            email: response.data.email || '',
            phonenum: response.data.phonenum || '',
            state: response.data.state || '',
            bio: response.data.bio || '',
            timezone: response.data.timezone || '',
            availability: response.data.availability || ''
          })
        } else {
          setError('Failed to fetch user data')
        }
      } catch (err: any) {
        console.error('❌ Error fetching user data:', err)
        if (err.response?.status === 401) {
          setError('Session expired. Please log in again.')
        } else if (err.request) {
          setError('Network error. Please check your connection.')
        } else {
          setError('Failed to fetch user data. Please try again.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [authUser, isLoggedIn, authLoading, API_BASE_URL])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }
    
    try {
      if (!authUser || !user) {
        setError('Please log in to update your profile')
        return
      }

      setIsUpdating(true)
      console.log("🔄 Updating user profile...")

      const response = await axios.put(`${API_BASE_URL}/api/auth/update/${user.id}`, formData)

      if (response.status === 200) {
        const updatedUser = { ...user, ...formData }
        setUser(updatedUser)
        toast.success('Profile updated successfully!')
        console.log("✅ Profile updated successfully")
      } else {
        toast.error('Failed to update profile')
      }
    } catch (err: any) {
      console.error('❌ Error updating profile:', err)
      if (err.response?.status === 401) {
        toast.error('Session expired. Please log in again.')
      } else if (err.request) {
        toast.error('Network error. Please check your connection.')
      } else {
        toast.error('Failed to update profile. Please try again.')
      }
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, GIF, or WebP)')
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      toast.error('Image size must be less than 5MB')
      return
    }

    try {
      setIsUploadingPhoto(true)
      
      const formData = new FormData()
      formData.append('thumbnailUrl', file)

      const uploadResponse = await axios.post(`${API_BASE_URL}/upload/profilephoto`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })

      if (uploadResponse.data && typeof uploadResponse.data === 'string') {
        const imageUrl = uploadResponse.data
        
        if (!authUser || !user) {
          toast.error('Please log in to update your profile photo')
          return
        }

        const updateResponse = await axios.put(`${API_BASE_URL}/api/auth/update/${user.id}`, 
          { ...formData, profileurl: imageUrl }
        )

        if (updateResponse.status === 200) {
          const updatedUser = { ...user, profileurl: imageUrl }
          setUser(updatedUser)
          toast.success('Profile photo updated successfully!')
        } else {
          toast.error('Failed to update profile photo')
        }
      } else {
        toast.error('Failed to upload image')
      }
    } catch (err: any) {
      console.error('Error uploading photo:', err)
      if (err.response?.status === 401) {
        toast.error('Session expired. Please log in again.')
      } else {
        toast.error('Failed to upload profile photo. Please try again.')
      }
    } finally {
      setIsUploadingPhoto(false)
      // Clear the input
      if (e.target) {
        e.target.value = ''
      }
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Invalid date'
    }
  }

  // Loading state - wait for auth context to load
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading authentication...</p>
        </div>
      </div>
    )
  }

  // Loading user data
  if (isLoading && !user && !error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    )
  }

  // Let ProtectedRoutes handle authentication - don't show error here
  // Just show loading if we don't have user data yet
  if (!user && !error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  // Error state (but not auth errors - let ProtectedRoutes handle those)
  if (error && !error.includes('log in')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Profile</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Don't render anything if no user data - let ProtectedRoutes handle it
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Profile Settings</h1>
              <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
            </div>
            <div className="hidden sm:flex items-center space-x-3">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                user.enabled 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {user.enabled ? 'Active' : 'Inactive'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Profile Overview - Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <img
                    src={user.profileurl || 'https://webcrumbs.cloud/placeholder'}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 mx-auto"
                  />
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
                  
                  {/* Photo Upload Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded-full cursor-pointer">
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      {isUploadingPhoto ? (
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                      ) : (
                        <Camera className="w-6 h-6 text-white" />
                      )}
                    </label>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      disabled={isUploadingPhoto}
                    />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mt-4">{user.name}</h3>
                <p className="text-gray-500">@{user.username}</p>
                <div className="flex items-center justify-center mt-2">
                  <Shield className="w-4 h-4 text-blue-500 mr-1" />
                  <span className="text-sm text-blue-600 capitalize font-medium">{user.role}</span>
                </div>
                
                {/* Upload Photo Button (Alternative) */}
                <div className="mt-4">
                  <label
                    htmlFor="photo-upload-alt"
                    className="inline-flex items-center px-3 py-2 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    {isUploadingPhoto ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Change Photo
                      </>
                    )}
                  </label>
                  <input
                    id="photo-upload-alt"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    disabled={isUploadingPhoto}
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm break-all">{user.email}</span>
                </div>
                {user.phonenum && (
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{user.phonenum}</span>
                  </div>
                )}
                {user.state && (
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{user.state}</span>
                  </div>
                )}
                {user.timezone && (
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{user.timezone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Account Details */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">User ID</label>
                  <p className="text-gray-900 font-mono text-sm">{user.id}</p>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Member Since</label>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-700 text-sm">{formatDate(user.createdAt)}</span>
                  </div>
                </div>

                {user.availability && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Availability</label>
                    <p className="text-gray-700 text-sm">{user.availability}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Bio Section */}
            {user.bio && (
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Info className="w-5 h-5 mr-2" />
                  About
                </h3>
                <p className="text-gray-700 leading-relaxed">{user.bio}</p>
              </div>
            )}

            {/* Edit Profile Form */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Edit3 className="w-5 h-5 mr-2" />
                  Edit Profile
                </h3>
              </div>

              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Full Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border ${validationErrors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'} shadow-sm focus:ring-2 focus:ring-opacity-50 px-4 py-3 text-black transition-colors`}
                      placeholder="Enter your full name"
                      required
                    />
                    {validationErrors.name && (
                      <p className="text-red-600 text-sm mt-1">{validationErrors.name}</p>
                    )}
                  </div>

                  {/* Username */}
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                      Username *
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border ${validationErrors.username ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'} shadow-sm focus:ring-2 focus:ring-opacity-50 px-4 py-3 text-black transition-colors`}
                      placeholder="Choose a username"
                      required
                    />
                    {validationErrors.username && (
                      <p className="text-red-600 text-sm mt-1">{validationErrors.username}</p>
                    )}
                  </div>

                  {/* Email (Read-only) */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled
                        className="w-full rounded-lg border border-gray-200 shadow-sm px-4 py-3 bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                      <CheckCircle className="absolute right-3 top-3 w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Email address cannot be changed</p>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label htmlFor="phonenum" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phonenum"
                      name="phonenum"
                      value={formData.phonenum}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border ${validationErrors.phonenum ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'} shadow-sm focus:ring-2 focus:ring-opacity-50 px-4 py-3 text-black transition-colors`}
                      placeholder="Enter your phone number"
                    />
                    {validationErrors.phonenum && (
                      <p className="text-red-600 text-sm mt-1">{validationErrors.phonenum}</p>
                    )}
                  </div>

                  {/* State */}
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                      State/Province
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 px-4 py-3 text-black transition-colors"
                      placeholder="Enter your state or province"
                    />
                  </div>

                  {/* Timezone */}
                  <div>
                    <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <input
                      type="text"
                      id="timezone"
                      name="timezone"
                      value={formData.timezone}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 px-4 py-3 text-black transition-colors"
                      placeholder="e.g., Asia/Kolkata, America/New_York"
                    />
                  </div>

                </div>

                {/* Availability */}
                <div>
                  <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <input
                    type="text"
                    id="availability"
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 px-4 py-3 text-black transition-colors"
                    placeholder="e.g., Monday-Friday 9:00 AM - 5:00 PM"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 px-4 py-3 text-black transition-colors resize-none"
                    placeholder="Tell us about yourself, your interests, and what you do..."
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.bio.length}/500 characters</p>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}