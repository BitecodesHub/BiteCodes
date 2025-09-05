"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BookOpen, MapPin, Award, Play, Loader2 } from "lucide-react"
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

        const response = await axios.get(
          `${API_BASE_URL}/api/universities/withPurchase/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )

        setUniversities(response.data)
        setError(null)
      } catch (err: any) {
        console.error("Error fetching universities:", err)
        setError("Failed to fetch universities")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [API_BASE_URL])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-medium">
        {error}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-800 via-blue-800 to-slate-800 text-white py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Top Universities <span className="text-blue-400">2025</span>
        </h1>
        <p className="text-lg text-slate-300">
          Explore prestigious institutions and prepare with our mock tests.
        </p>
      </div>

      {/* Universities Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {universities.map((university) => (
          <div
            key={university.slug}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition border"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-slate-800">{university.name}</h3>
              <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-100 text-blue-700">
                Rank {university.ranking}
              </span>
            </div>

            {/* Description */}
            <p className="text-slate-600 text-sm mb-3">{university.description}</p>

            {/* Details */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-slate-500">
                <MapPin className="w-4 h-4 mr-2" />
                {university.location}
              </div>
              <div className="flex items-center text-slate-500">
                <BookOpen className="w-4 h-4 mr-2 text-blue-600" />
                Exams:{" "}
                <span className="ml-1 text-blue-600 font-medium">
                  {university.examsAccepted.join(", ")}
                </span>
              </div>
              <div className="flex items-center text-slate-500">
                <Award className="w-4 h-4 mr-2 text-emerald-600" />
                Established: {university.established}
              </div>
            </div>

            {/* Footer without Buy Button */}
            <div className="mt-4 pt-4 border-t flex justify-between items-center">
              <Link
                href={`/universities/${university.slug}`}
                className="text-sm font-semibold text-blue-600 flex items-center hover:text-blue-700"
              >
                <Play className="w-4 h-4 mr-1" /> View Details
              </Link>

              {university.purchased && (
                <span className="text-sm font-bold text-emerald-600">✅ Purchased</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
