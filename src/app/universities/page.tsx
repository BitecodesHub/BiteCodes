"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BookOpen, MapPin, Award, Play, Loader2, CheckCircle, ShoppingCart, Users, Calendar } from "lucide-react"
import axios from "axios"

interface University {
  slug: string
  name: string
  description: string
  location: string
  ranking: number
  established: number
  examsAccepted: string[]
  courses: { slug: string; name: string }[]
  allCoursesPrice: number
  purchased?: boolean
}

interface UserData {
  id?: number
  userid?: number
  username: string
  name: string
  email: string
}

export default function UniversitiesPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [universities, setUniversities] = useState<University[]>([])
  const [loading, setLoading] = useState(true)
  const [purchaseLoading, setPurchaseLoading] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const token = localStorage.getItem("token")
        const storedUser = localStorage.getItem("user")

        if (!token || !storedUser) {
          setError("Please log in to view universities")
          setLoading(false)
          return
        }

        const parsedUser: UserData = JSON.parse(storedUser)
        setUser(parsedUser)

        const userId = parsedUser.id || parsedUser.userid
        if (!userId) {
          setError("User ID missing, please re-login")
          setLoading(false)
          return
        }

        // Load universities first for faster initial render
        const universitiesResponse = await axios.get(
          `${API_BASE_URL}/api/universities`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        
        // Set universities immediately with loading state for purchase status
        const universitiesWithLoading = universitiesResponse.data.map((uni: University) => ({
          ...uni,
          purchased: undefined
        }))
        setUniversities(universitiesWithLoading)
        setLoading(false)

        // Then load purchase status in background
        try {
          const purchaseResponse = await axios.get(
            `${API_BASE_URL}/api/universities/withPurchase/${userId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          )
          setUniversities(purchaseResponse.data)
        } catch (purchaseErr) {
          console.warn("Could not load purchase status:", purchaseErr)
        }

        setError(null)
      } catch (err: any) {
        console.error("Error fetching universities:", err)
        setError("Failed to fetch universities")
        setLoading(false)
      }
    }

    fetchData()
  }, [API_BASE_URL])

  const handlePurchaseClick = async (universitySlug: string) => {
    setPurchaseLoading(prev => new Set(prev).add(universitySlug))
    
    setTimeout(() => {
      setPurchaseLoading(prev => {
        const newSet = new Set(prev)
        newSet.delete(universitySlug)
        return newSet
      })
      
      setUniversities(prev => 
        prev.map(uni => 
          uni.slug === universitySlug 
            ? { ...uni, purchased: true }
            : uni
        )
      )
    }, 1500)
  }

  // Get ranking configuration for professional colors
  function getRankingConfig(ranking: number) {
    if (ranking <= 10) return {
      bg: "bg-gradient-to-r from-amber-50 to-amber-100",
      text: "text-amber-700",
      border: "border-amber-200"
    }
    if (ranking <= 50) return {
      bg: "bg-gradient-to-r from-blue-50 to-blue-100",
      text: "text-blue-700",
      border: "border-blue-200"
    }
    return {
      bg: "bg-gradient-to-r from-slate-50 to-slate-100",
      text: "text-slate-700",
      border: "border-slate-200"
    }
  }

  const PurchaseButton = ({ university }: { university: University }) => {
    const isLoading = purchaseLoading.has(university.slug)
    const isPurchased = university.purchased === true
    const isCheckingStatus = university.purchased === undefined

    if (isCheckingStatus) {
      return (
        <div className="flex items-center justify-center px-4 py-2 bg-slate-100 rounded-xl">
          <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
          <span className="ml-2 text-sm text-slate-500 font-medium">Checking...</span>
        </div>
      )
    }

    if (isPurchased) {
      return (
        <div className="flex items-center px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl shadow-sm transform hover:scale-105 transition-transform duration-300">
          <CheckCircle className="w-4 h-4 mr-2" />
          <span className="text-sm font-semibold">Purchased</span>
        </div>
      )
    }

    return (
      <button
        onClick={() => handlePurchaseClick(university.slug)}
        disabled={isLoading}
        className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-sm transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            <span className="text-sm font-semibold">Processing...</span>
          </>
        ) : (
          <>
            <ShoppingCart className="w-4 h-4 mr-2" />
            <span className="text-sm font-semibold">Buy Now</span>
          </>
        )}
      </button>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading universities...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto shadow-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h3 className="text-red-800 font-bold text-lg mb-3 text-center">Oops! Something went wrong</h3>
          <p className="text-red-600 text-sm text-center">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-800 via-purple-800 to-slate-800 text-white py-20 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400 opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-slate-400 opacity-10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Top Universities <span className="text-purple-400">2025</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed font-light">
              Explore prestigious institutions and prepare with our comprehensive mock tests.{' '}
              <span className="text-purple-400 font-semibold">Get access to exclusive study materials.</span>
            </p>
            
            <div className="mt-8 flex justify-center space-x-4">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl px-6 py-3 border border-white border-opacity-20 hover:bg-opacity-25 transition-all duration-300">
                <div className="text-2xl font-bold text-white">{universities.length}</div>
                <div className="text-sm text-blue-100 font-medium">Universities</div>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl px-6 py-3 border border-white border-opacity-20 hover:bg-opacity-25 transition-all duration-300">
                <div className="text-2xl font-bold text-white">{universities.filter(u => u.purchased).length}</div>
                <div className="text-sm text-blue-100 font-medium">Purchased</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Universities Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Featured Universities
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Discover top-ranked institutions and boost your preparation with our resources
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {universities.map((university) => {
            const rankingConfig = getRankingConfig(university.ranking)
            
            return (
              <div
                key={university.slug}
                className="group relative overflow-hidden"
              >
                <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 p-6 border border-slate-200 border-opacity-50 hover:border-blue-300 hover:border-opacity-50 transform hover:-translate-y-1 hover:scale-102">
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-700 transition-colors leading-tight flex-1 pr-3">
                        {university.name}
                      </h3>
                      <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap ${rankingConfig.bg} ${rankingConfig.text} ${rankingConfig.border} border shadow-sm transform group-hover:scale-105 transition-transform duration-300`}>
                        Rank {university.ranking}
                      </span>
                    </div>
                    
                    <p className="text-slate-600 group-hover:text-slate-700 mb-4 text-sm leading-relaxed transition-colors">
                      {university.description.length > 80 
                        ? `${university.description.substring(0, 80)}...` 
                        : university.description}
                    </p>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center text-slate-500 group-hover:text-slate-600 transition-colors">
                        <div className="p-1 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg mr-2">
                          <MapPin className="w-3 h-3 text-white" />
                        </div>
                        <span className="font-medium">{university.location}</span>
                      </div>
                      
                      <div className="flex items-center text-slate-500 group-hover:text-slate-600 transition-colors">
                        <div className="p-1 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg mr-2">
                          <BookOpen className="w-3 h-3 text-white" />
                        </div>
                        <span className="font-medium">
                          Exams: {university.examsAccepted.slice(0, 2).join(', ')}
                          {university.examsAccepted.length > 2 && ` +${university.examsAccepted.length - 2}`}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-slate-500 group-hover:text-slate-600 transition-colors">
                        <div className="p-1 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg mr-2">
                          <Award className="w-3 h-3 text-white" />
                        </div>
                        <span className="font-medium">Established: {university.established}</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <Link
                          href={`/universities/${university.slug}`}
                          className="text-sm font-semibold text-blue-600 flex items-center group-hover:text-blue-700 transition-colors"
                        >
                          <Play className="w-4 h-4 mr-1" />
                          View Details
                        </Link>

                        <PurchaseButton university={university} />
                      </div>
                    </div>
                  </div>

                  {/* Animated border */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 to-slate-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-sm"></div>
                </div>
              </div>
            )
          })}
        </div>

        {universities.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No universities found</h3>
            <p className="text-slate-600">Check back later for updates.</p>
          </div>
        )}
      </div>
    </div>
  )
}