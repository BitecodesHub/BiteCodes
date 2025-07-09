import React from 'react'

interface SyllabusSection {
  id: number
  sectionName: string
  marks: number
  numberOfQuestions: number
  topicsCovered: string
}

interface Syllabus {
  id: number
  courseName: string
  totalMarks: number
  totalQuestions: number
  marksPerQuestion: number
  syllabusLink: string
  negativeMarking: number
  generalInstructions: string
  sections: SyllabusSection[]
}

export default function SyllabusClient({ syllabus }: { syllabus: Syllabus }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full text-sm font-semibold mb-4">
            EXAM SYLLABUS
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            {syllabus.courseName.toUpperCase()}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive syllabus breakdown with detailed section analysis
          </p>
        </div>

        {/* Exam Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Marks</h3>
            <p className="text-3xl font-bold text-gray-900">{syllabus.totalMarks}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Questions</h3>
            <p className="text-3xl font-bold text-gray-900">{syllabus.totalQuestions}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Marks Per Question</h3>
            <p className="text-3xl font-bold text-gray-900">{syllabus.marksPerQuestion}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Negative Marking</h3>
            <p className="text-3xl font-bold text-gray-900">-{syllabus.negativeMarking}</p>
          </div>
        </div>

        {/* Instructions Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            General Instructions
          </h2>
          <p className="text-blue-100 text-lg leading-relaxed">{syllabus.generalInstructions}</p>
          {syllabus.syllabusLink && (
            <a 
              href={syllabus.syllabusLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center mt-4 bg-white bg-opacity-20 hover:bg-opacity-30 transition-all px-6 py-3 rounded-full text-white font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Official Syllabus
            </a>
          )}
        </div>

        {/* Sections */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Exam Sections</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {syllabus.sections.map((section, index) => (
              <div key={section.id} className="group">
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3 ${
                          index === 0 ? 'bg-blue-500' : 
                          index === 1 ? 'bg-green-500' : 
                          index === 2 ? 'bg-purple-500' : 'bg-orange-500'
                        }`}>
                          {index + 1}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{section.sectionName}</h3>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl">
                      <span className="text-sm font-medium text-gray-600">Questions</span>
                      <span className="text-lg font-bold text-gray-900">{section.numberOfQuestions}</span>
                    </div>
                    
                    <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl">
                      <span className="text-sm font-medium text-gray-600">Total Marks</span>
                      <span className="text-lg font-bold text-gray-900">{section.marks}</span>
                    </div>

                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Topics Covered</h4>
                      <div className="flex flex-wrap gap-2">
                        {section.topicsCovered.split(', ').map((topic, topicIndex) => (
                          <span 
                            key={topicIndex}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              index === 0 ? 'bg-blue-100 text-blue-800' : 
                              index === 1 ? 'bg-green-100 text-green-800' : 
                              index === 2 ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
                            }`}
                          >
                            {topic.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Weightage</span>
                      <span className="font-semibold text-gray-900">
                        {((section.marks / syllabus.totalMarks) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          index === 0 ? 'bg-blue-500' : 
                          index === 1 ? 'bg-green-500' : 
                          index === 2 ? 'bg-purple-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${(section.marks / syllabus.totalMarks) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Quick Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {syllabus.sections.length}
              </div>
              <div className="text-sm text-gray-600">Total Sections</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {syllabus.totalQuestions / syllabus.sections.length}
              </div>
              <div className="text-sm text-gray-600">Questions per Section</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {((syllabus.totalMarks / syllabus.totalQuestions) * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600">Success Rate Needed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}