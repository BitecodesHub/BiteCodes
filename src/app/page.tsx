// src/app/page.tsx
export const metadata = {
  title: 'Bitecodes Academy | Entrance Exams, Universities, Preparation Guides & Mock Tests',
  description:
    'Bitecodes Academy is your ultimate platform for entrance exam preparation. Access top university details, expert preparation guides, previous year papers, and AI-powered free mock tests. Unlock your academic success today!',
  keywords:
    'Bitecodes Academy, entrance exams, JEE, NEET, CUET, university info, mock tests, preparation guides, previous year papers, online tests, NFSU, DAIICT, competitive exams, career preparation',
  authors: [{ name: 'Bitecodes Team', url: 'https://bitecodes.com' }],
  creator: 'Bitecodes Academy',
  metadataBase: new URL('https://bitecodes.com'),
  openGraph: {
    title: 'Bitecodes Academy | Free Mock Tests & Entrance Exam Preparation',
    description:
      'Join thousands of students using Bitecodes Academy to prepare for JEE, NEET, CUET and more. Get university-wise info, expert-curated materials, and full-length mock tests.',
    url: 'https://bitecodes.com',
    siteName: 'Bitecodes Academy',
    images: [
      {
        url: 'https://bitecodes.com/og-image.jpg', // Replace with your OpenGraph image URL
        width: 1200,
        height: 630,
        alt: 'Bitecodes Academy - Your Gateway to Success',
      },
    ],
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@bitecodes', // Replace with your official Twitter handle
    creator: '@bitecodes',
    title: 'Bitecodes Academy | Entrance Exam Hub',
    description:
      'Free mock tests, university data, and preparation material for exams like JEE, NEET, and CUET. Start your journey to success today with Bitecodes Academy!',
    images: ['https://bitecodes.com/og-image.jpg'], // Same as OpenGraph image
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};


import Link from 'next/link';
import { ChevronRight, BookOpen, University, FileText, Target, Users, Award, TrendingUp } from 'lucide-react';

export default function Home() {
  const featuredExams = [
    { name: 'JEE Main/Advanced', students: '12L+', difficulty: 'High', href: '/entrance-exams/jee' },
    { name: 'NEET', students: '18L+', difficulty: 'High', href: '/entrance-exams/neet' },
    { name: 'CUET', students: '14L+', difficulty: 'Medium', href: '/entrance-exams/cuet' },
    { name: 'BITSAT', students: '3L+', difficulty: 'High', href: '/entrance-exams/bitsat' },
  ];

  const topUniversities = [
    { name: 'IIT Delhi', ranking: '#1', seats: '1,138', href: '/universities/iit-delhi' },
    { name: 'IIT Bombay', ranking: '#2', seats: '1,223', href: '/universities/iit-bombay' },
    { name: 'AIIMS Delhi', ranking: '#1 Medical', seats: '125', href: '/universities/aiims-delhi' },
    { name: 'DU', ranking: '#3', seats: '70,000+', href: '/universities/delhi-university' },
  ];

  const stats = [
    { number: '50,000+', label: 'Students Helped', icon: Users },
    { number: '100+', label: 'Entrance Exams', icon: BookOpen },
    { number: '500+', label: 'Universities', icon: University },
    { number: '95%', label: 'Success Rate', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-sm font-medium text-blue-800 mb-8 animate-pulse">
              <Award className="w-4 h-4 mr-2" />
              🎉 India's #1 Entrance Exam Platform
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-8 leading-tight">
              Your Gateway to
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                Academic Success
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Master entrance exams with comprehensive preparation resources, detailed university insights, 
              and AI-powered mock tests. Your journey to top universities starts here.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link 
                href="/mock-tests" 
                className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center"
              >
                Start Free Mock Test
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                href="/entrance-exams" 
                className="group bg-white text-gray-800 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center border-2 border-gray-200"
              >
                Explore Exams
                <BookOpen className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Navigation Cards */}
      <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Everything You Need to <span className="text-blue-600">Succeed</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive resources designed to help you excel in your entrance exams and secure admission to your dream university.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Entrance Exams Card */}
          <Link href="/entrance-exams" className="group">
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-blue-100 hover:border-blue-300 transform hover:-translate-y-2 h-full">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors">
                Entrance Exams
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Comprehensive details about JEE, NEET, CUET, and 100+ other entrance exams with dates, patterns, and strategies.
              </p>
              <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
                Explore Exams
                <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Universities Card */}
          <Link href="/universities" className="group">
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-purple-100 hover:border-purple-300 transform hover:-translate-y-2 h-full">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <University className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-purple-600 transition-colors">
                Universities
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Detailed information about top universities, seat matrix, cutoffs, fees, and admission processes.
              </p>
              <div className="flex items-center text-purple-600 font-semibold group-hover:text-purple-700">
                View Universities
                <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Preparation Docs Card */}
          <Link href="/docs" className="group">
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-green-100 hover:border-green-300 transform hover:-translate-y-2 h-full">
              <div className="bg-gradient-to-r from-green-500 to-teal-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-green-600 transition-colors">
                Preparation Docs
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Expert-curated study materials, syllabus, time management tips, and preparation strategies.
              </p>
              <div className="flex items-center text-green-600 font-semibold group-hover:text-green-700">
                Access Docs
                <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Mock Tests Card */}
          <Link href="/mock-tests" className="group">
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-orange-100 hover:border-orange-300 transform hover:-translate-y-2 h-full">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-orange-600 transition-colors">
                Mock Tests
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                AI-powered mock tests with instant scoring, detailed analysis, and personalized improvement suggestions.
              </p>
              <div className="flex items-center text-orange-600 font-semibold group-hover:text-orange-700">
                Start Testing
                <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Featured Exams Section */}
      <div className="py-20 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Most Popular <span className="text-blue-600">Entrance Exams</span>
            </h2>
            <p className="text-xl text-gray-600">
              Get detailed information about India's most competitive entrance examinations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredExams.map((exam, index) => (
              <Link key={index} href={exam.href} className="group">
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-300 transform hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {exam.name}
                    </h3>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      exam.difficulty === 'High' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {exam.difficulty}
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      {exam.students} students appear
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      High competition
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Top Universities Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Top <span className="text-purple-600">Universities</span>
            </h2>
            <p className="text-xl text-gray-600">
              Explore admission details for India's premier educational institutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topUniversities.map((uni, index) => (
              <Link key={index} href={uni.href} className="group">
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-300 transform hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                      {uni.name}
                    </h3>
                    <div className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-semibold">
                      {uni.ranking}
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <University className="w-4 h-4 mr-2" />
                      {uni.seats} seats available
                    </div>
                    <div className="flex items-center">
                      <Award className="w-4 h-4 mr-2" />
                      Premier institution
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students who have achieved their academic dreams with Bitecodes Academy
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/mock-tests" 
              className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Take Free Mock Test
            </Link>
            <Link 
              href="/entrance-exams" 
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              Explore All Exams
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}