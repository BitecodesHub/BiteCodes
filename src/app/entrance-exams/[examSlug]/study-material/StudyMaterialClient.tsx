'use client';

import React, { useState } from 'react';
import { BookOpen, FileText, Download, Filter, Search, Award } from 'lucide-react';

interface Material {
  materialName: string;
  category: 'PRACTICE_PAPER' | 'TOPIC_PDF';
  pdfUrl: string;
}

interface SyllabusTopic {
  title: string;
  weightage: number;
  totalMarks: number;
  materials?: Material[];
}

interface StudyMaterialClientProps {
  syllabusTopics: SyllabusTopic[];
}

// Card components
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 ${className}`}>
      {children}
    </div>
  );
}

function CardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

// Badge component
function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'secondary' }) {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  const variantClasses = {
    default: 'bg-blue-100 text-blue-800',
    secondary: 'bg-green-100 text-green-800'
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </span>
  );
}

export default function StudyMaterialClient({ syllabusTopics }: StudyMaterialClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'PRACTICE_PAPER' | 'TOPIC_PDF'>('ALL');

  // Calculate total materials and stats
  const totalMaterials = syllabusTopics.reduce((acc, topic) => acc + (topic.materials?.length || 0), 0);
  const practicePapers = syllabusTopics.reduce((acc, topic) => 
    acc + (topic.materials?.filter(m => m.category === 'PRACTICE_PAPER').length || 0), 0
  );
  const topicPDFs = totalMaterials - practicePapers;

  // Filter topics based on search and category
  const filteredTopics = syllabusTopics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.materials?.some(material => 
        material.materialName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const hasMatchingCategory = filterCategory === 'ALL' || 
      topic.materials?.some(material => material.category === filterCategory);
    
    return matchesSearch && hasMatchingCategory;
  });

  const getCategoryIcon = (category: string) => {
    return category === 'PRACTICE_PAPER' ? <FileText className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />;
  };

  const getCategoryLabel = (category: string) => {
    return category === 'PRACTICE_PAPER' ? 'Practice Paper' : 'Topic PDF';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Study Materials</h1>
              <p className="text-gray-600 mt-1">Access comprehensive study resources for your exam preparation</p>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Award className="w-4 h-4 mr-1" />
                {syllabusTopics.length} Topics
              </div>
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-1" />
                {totalMaterials} Materials
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{topicPDFs}</h3>
              <p className="text-gray-600">Topic PDFs</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-4">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{practicePapers}</h3>
              <p className="text-gray-600">Practice Papers</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-4">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{syllabusTopics.length}</h3>
              <p className="text-gray-600">Total Topics</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-8">
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search materials..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value as any)}
                >
                  <option value="ALL">All Materials</option>
                  <option value="TOPIC_PDF">Topic PDFs</option>
                  <option value="PRACTICE_PAPER">Practice Papers</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Study Materials */}
        <div className="space-y-8">
          {filteredTopics.map((topic, i) => (
            <Card key={i}>
              <CardContent>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{topic.title}</h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Award className="w-4 h-4 mr-1" />
                        Weightage: {topic.weightage}/{topic.totalMarks} marks
                      </div>
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-1" />
                        {topic.materials?.length || 0} materials
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{topic.weightage}</div>
                    <div className="text-sm text-gray-500">marks</div>
                  </div>
                </div>

                {topic.materials && topic.materials.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {topic.materials
                      .filter(material => 
                        filterCategory === 'ALL' || material.category === filterCategory
                      )
                      .map((material, j) => (
                      <div key={j} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            {getCategoryIcon(material.category)}
                            <Badge variant={material.category === 'PRACTICE_PAPER' ? 'secondary' : 'default'}>
                              {getCategoryLabel(material.category)}
                            </Badge>
                          </div>
                        </div>
                        
                        <h3 className="font-medium text-gray-900 mb-3 line-clamp-2">
                          {material.materialName}
                        </h3>
                        
                        <div className="flex items-center justify-between">
                          <a
                            href={material.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            View PDF
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No materials available for this topic</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTopics.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No materials found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}