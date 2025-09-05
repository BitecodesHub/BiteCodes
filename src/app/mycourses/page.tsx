"use client";

import { useAuth } from "../contexts/AuthContext";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";

export default function MyCoursesPage() {
  const { user, isLoggedIn } = useAuth();

  console.log("👤 User from context:", user); // ✅ debug

  if (!isLoggedIn || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-700">
        <h2 className="text-2xl font-bold mb-4">You are not logged in</h2>
        <Link
          href="/login"
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
        >
          Login to see your courses
        </Link>
      </div>
    );
  }

  const courses = user.purchasedCourses || [];
  console.log("📚 Purchased Courses:", courses); // ✅ debug

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Courses</h1>

        {courses.length === 0 ? (
          <p className="text-gray-600">
            You haven’t purchased any courses yet. Explore{" "}
            <Link href="/universities" className="text-green-600 font-medium hover:underline">
              Universities
            </Link>{" "}
            to get started.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.slug}
                className="p-6 border rounded-xl shadow-sm hover:shadow-md transition bg-gray-50"
              >
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="w-6 h-6 text-green-600" />
                  <h2 className="text-lg font-semibold text-gray-800">{course.name}</h2>
                </div>
                <p className="text-gray-500 mb-4">Price: ₹{course.price}</p>
                <Link
                  href={`/entrance-exams/${course.slug}`}
                  className="flex items-center text-green-600 hover:text-green-800 font-medium"
                >
                  Start Learning <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
