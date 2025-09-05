"use client";

import { useAuth } from "../contexts/AuthContext";
import Link from "next/link";
import { BookOpen, ArrowRight, GraduationCap, Search } from "lucide-react";
import { useState } from "react";

export default function MyCoursesPage() {
  const { user, isLoggedIn } = useAuth();
  const [search, setSearch] = useState("");

  const courses = user?.purchasedCourses || [];

  // Filter courses by search term
  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!isLoggedIn || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-700">
        <GraduationCap className="w-16 h-16 text-blue-600 mb-6" />
        <h2 className="text-2xl font-bold mb-3">You are not logged in</h2>
        <p className="text-black mb-6">
          Please login to access your personalized courses.
        </p>
        <Link
          href="/login"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:bg-blue-700 transition"
        >
          Login to see your courses
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-800">
            My <span className="text-blue-600">Courses</span>
          </h1>
          <p className="text-gray-500 mt-3">
            Track and continue learning from your purchased courses.
          </p>
        </div>

        {/* Search Bar */}
        {courses.length > 0 && (
          <div className="relative max-w-md mx-auto mb-10">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses..."
              className="w-full border border-black rounded-xl pl-10 pr-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 placeholder-gray-500"
            />
            <Search className="w-5 h-5 text-gray-500 absolute left-3 top-3.5" />
          </div>
        )}

        {/* If no courses */}
        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white shadow-lg rounded-2xl p-12 border border-gray-100">
            <BookOpen className="w-20 h-20 text-blue-500 mb-6" />
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              No Courses Purchased
            </h2>
            <p className="text-gray-500 mb-6 text-center max-w-sm">
              You haven’t purchased any courses yet. Explore our universities
              and start your learning journey today!
            </p>
            <Link
              href="/universities"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:bg-blue-700 transition"
            >
              Browse Universities
            </Link>
          </div>
        ) : filteredCourses.length === 0 ? (
          <p className="text-center text-gray-800">
            No courses found for "<span className="font-medium">{search}</span>"
          </p>
        ) : (
          /* Courses Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div
                key={course.slug}
                className="group bg-white p-6 border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {course.name}
                  </h2>
                </div>
                <p className="text-gray-600 mb-6">
                  <span className="font-medium text-gray-800">Price:</span> ₹{course.price}
                </p>
                <Link
                  href={`/entrance-exams/${course.slug}`}
                  className="inline-flex items-center justify-center bg-blue-600 text-white px-5 py-2 rounded-xl font-medium shadow-md hover:bg-blue-700 transition group-hover:scale-105"
                >
                  Start Learning
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}