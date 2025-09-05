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
} from "lucide-react"
import BuyButton from "@/components/BuyButton"

interface University {
  slug: string
  name: string
  description: string
  location: string
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
  const { universitySlug } = useParams<{ universitySlug: string }>() // ✅ get param here
  const [university, setUniversity] = useState<University | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!universitySlug) return

    const fetchUniversity = async () => {
      setLoading(true)
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

        // read user from localStorage
        const storedUser =
          typeof window !== "undefined" ? localStorage.getItem("user") : null
        let userData: { id?: number; userid?: number } | null = null
        if (storedUser) {
          userData = JSON.parse(storedUser)
          setUserId(userData?.id || userData?.userid || null)
        }

        const url =
          userData?.id || userData?.userid
            ? `${apiUrl}/api/universities/${universitySlug}?userId=${
                userData.id || userData.userid
              }`
            : `${apiUrl}/api/universities/${universitySlug}`

        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("token")
            : null
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <button
            onClick={() => router.push("/universities")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Back to list
          </button>
        </div>
      </div>
    )
  }

  if (!university) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">University data unavailable</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/universities"
            className="inline-flex items-center text-white hover:text-green-200 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Universities
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{university.name}</h1>
          <p className="text-xl text-green-100 max-w-3xl">{university.description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Details */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">University Details</h2>
              <div className="space-y-4 text-gray-600">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-3 text-green-600" />
                  <span><strong>Location:</strong> {university.location}</span>
                </div>
                <div className="flex items-center">
                  <Award className="w-5 h-5 mr-3 text-green-600" />
                  <span><strong>Ranking:</strong> {university.ranking}</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-3 text-green-600" />
                  <span><strong>Exams Accepted:</strong> {university.examsAccepted.join(", ")}</span>
                </div>
                <div className="flex items-center">
                  <Award className="w-5 h-5 mr-3 text-green-600" />
                  <span><strong>Established:</strong> {university.established}</span>
                </div>
                <div className="flex items-center">
                  <Globe className="w-5 h-5 mr-3 text-green-600" />
                  <Link href={university.website} className="text-green-600 hover:text-green-700">Visit Website</Link>
                </div>
                <div className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-3 text-green-600" />
                  <Link href={university.admissionLink} className="text-green-600 hover:text-green-700">Admission Details</Link>
                </div>
              </div>
            </div>

            {/* Programs */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Programs Offered</h2>
              <div className="flex flex-wrap gap-2">
                {university.courses.map((course) => (
                  <Link
                    key={course.slug}
                    href={`/universities/${university.slug}/${course.slug}`}
                    className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold hover:bg-blue-200"
                  >
                    {course.name}
                  </Link>
                ))}
              </div>

              {/* Action / Buy area */}
              <div className="mt-8 flex flex-col items-center gap-4">
                {university.purchased ? (
                  <span className="text-sm font-bold text-emerald-600">✅ Purchased</span>
                ) : userId ? (
                  <BuyButton
                    amount={university.allCoursesPrice || 0}
                    userId={userId}
                    universitySlug={university.slug}
                    onPurchase={() => setUniversity({ ...university, purchased: true })}
                  />
                ) : (
                  <span className="text-sm text-red-600">Please log in to purchase courses</span>
                )}

                <Link
                  href="/mock-tests"
                  className="flex items-center justify-center w-full md:w-auto bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Play className="w-5 h-5 mr-2" /> Prepare with Mock Tests
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">About {university.name}</h2>
          <p className="text-gray-600">
            {university.name} is a leading institution in {university.location}, established in {university.established}. It is ranked #{university.ranking} and offers {university.courses.map(c => c.name).join(", ")}. Admission is through {university.examsAccepted.join(", ")}.
          </p>
        </div>
      </div>
    </div>
  )
}
