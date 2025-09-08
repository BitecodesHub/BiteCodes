"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import {
  MapPin,
  BookOpen,
  Award,
  Globe,
  ArrowLeft,
  Play,
  Loader2,
  Navigation,
} from "lucide-react"
import BuyButton from "@/components/BuyButton"
import dynamic from "next/dynamic"

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  ),
})

interface University {
  slug: string
  name: string
  description: string
  location: string
  mapLocation: string // Expecting format "latitude,longitude"
  ranking: number
  established: number
  website: string
  admissionLink: string
  examsAccepted: string[]
  courses: { slug: string; name: string }[]
  allCoursesPrice: number
  purchased?: boolean
}

export default function UniversityPage() {
  const { universitySlug } = useParams<{ universitySlug: string }>()
  const [university, setUniversity] = useState<University | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<number | null>(null)
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!universitySlug) return

    const fetchUniversity = async () => {
      setLoading(true)
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
        const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null
        let userData: { id?: number; userid?: number } | null = null
        
        if (storedUser) {
          userData = JSON.parse(storedUser)
          setUserId(userData?.id || userData?.userid || null)
        }

        const url = userData?.id || userData?.userid
          ? `${apiUrl}/api/universities/${universitySlug}?userId=${userData.id || userData.userid}`
          : `${apiUrl}/api/universities/${universitySlug}`

        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
        const res = await fetch(url, {
          cache: "no-store",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })

        if (!res.ok) {
          const txt = await res.text().catch(() => "Not found")
          setError(txt || "University not found")
          return
        }

        const data = await res.json()
        if (data.allCoursesPrice && typeof data.allCoursesPrice === "string") {
          data.allCoursesPrice = Number(data.allCoursesPrice)
        }
        
        // Parse map location if available
        if (data.mapLocation) {
          const [lat, lng] = data.mapLocation.split(',').map(coord => parseFloat(coord.trim()))
          if (!isNaN(lat) && !isNaN(lng)) {
            setCoordinates([lat, lng])
          }
        }
        
        setUniversity(data)
      } catch (err) {
        console.error("Error fetching university:", err)
        setError("Failed to load university")
      } finally {
        setLoading(false)
      }
    }

    fetchUniversity()
  }, [universitySlug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600">Loading university data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-lg">
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <button
            onClick={() => router.push("/universities")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to list
          </button>
        </div>
      </div>
    )
  }

  if (!university) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">University data unavailable</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/universities"
            className="inline-flex items-center text-white/90 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Universities
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{university.name}</h1>
          <p className="text-xl text-blue-100 max-w-3xl">{university.description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">University Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 mr-3 text-blue-600 mt-0.5" />
                  <div>
                    <strong className="text-gray-800">Location</strong>
                    <p>{university.location}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Award className="w-5 h-5 mr-3 text-blue-600 mt-0.5" />
                  <div>
                    <strong className="text-gray-800">Ranking</strong>
                    <p>#{university.ranking}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <BookOpen className="w-5 h-5 mr-3 text-blue-600 mt-0.5" />
                  <div>
                    <strong className="text-gray-800">Exams Accepted</strong>
                    <p>{university.examsAccepted.join(", ")}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Award className="w-5 h-5 mr-3 text-blue-600 mt-0.5" />
                  <div>
                    <strong className="text-gray-800">Established</strong>
                    <p>{university.established}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Globe className="w-5 h-5 mr-3 text-blue-600 mt-0.5" />
                  <div>
                    <strong className="text-gray-800">Website</strong>
                    <Link 
                      href={university.website} 
                      className="text-blue-600 hover:text-blue-700 block mt-1"
                      target="_blank"
                    >
                      Visit Website
                    </Link>
                  </div>
                </div>
                <div className="flex items-start">
                  <BookOpen className="w-5 h-5 mr-3 text-blue-600 mt-0.5" />
                  <div>
                    <strong className="text-gray-800">Admissions</strong>
                    <Link 
                      href={university.admissionLink} 
                      className="text-blue-600 hover:text-blue-700 block mt-1"
                      target="_blank"
                    >
                      Admission Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Programs */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Programs Offered</h2>
              <div className="flex flex-wrap gap-3">
                {university.courses.map((course) => (
                  <Link
                    key={course.slug}
                    href={`/universities/${university.slug}/${course.slug}`}
                    className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors"
                  >
                    {course.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* About */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">About {university.name}</h2>
              <p className="text-gray-600 leading-relaxed">
                {university.name} is a leading institution in {university.location}, established in {university.established}. 
                It is ranked #{university.ranking} and offers {university.courses.map(c => c.name).join(", ")}. 
                Admission is through {university.examsAccepted.join(", ")}.
              </p>
            </div>
          </div>

          {/* Right Column - Map and Action */}
          <div className="space-y-8">
            {/* Map */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Navigation className="w-6 h-6 mr-2 text-blue-600" />
                Location
              </h2>
              {coordinates ? (
                <div className="h-64 rounded-lg overflow-hidden">
                  <MapComponent coordinates={coordinates} universityName={university.name} />
                </div>
              ) : (
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Map location not available</p>
                </div>
              )}
            </div>

            {/* Action Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Program Access</h2>
              
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">All Courses Package</h3>
                <p className="text-2xl font-bold text-blue-600">
                  ${university.allCoursesPrice || 0}
                </p>
                <p className="text-sm text-gray-600 mt-1">One-time payment, lifetime access</p>
              </div>

              <div className="space-y-4">
                {university.purchased ? (
                  <div className="bg-green-50 text-green-700 p-4 rounded-lg text-center">
                    <span className="font-bold">✅ Purchased</span>
                    <p className="text-sm mt-1">You have full access to all courses</p>
                  </div>
                ) : userId ? (
                  <BuyButton
                    amount={university.allCoursesPrice || 0}
                    userId={userId}
                    universitySlug={university.slug}
                    onPurchase={() => setUniversity({ ...university, purchased: true })}
                  />
                ) : (
                  <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg text-center">
                    <p>Please log in to purchase courses</p>
                  </div>
                )}

                <Link
                  href="/mock-tests"
                  className="flex items-center justify-center w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Play className="w-5 h-5 mr-2" /> 
                  Prepare with Mock Tests
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}