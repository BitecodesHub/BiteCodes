'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { BookOpen,Eye, FileText, Download, Filter, Search, Award, Star, Clock, Bookmark, Grid, List, SortAsc, ChevronDown, ChevronUp } from 'lucide-react';

interface Material {
  materialName: string;
  category: 'PRACTICE_PAPER' | 'TOPIC_PDF';
  pdfUrl: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  lastUpdated?: string;
  rating?: number;
  downloadCount?: number;
  bookmarked?: boolean;
  pages?: number;
  questions?: number;
}

interface SyllabusTopic {
  title: string;
  weightage: number;
  totalMarks: number;
  materials?: Material[];
  description?: string;
  priority?: 'High' | 'Medium' | 'Low';
  completedPercentage?: number;
}

interface StudyMaterialClientProps {
  syllabusTopics: SyllabusTopic[];
}

// Card components
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 ${className}`}>
      {children}
    </div>
  );
}

function CardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

// Badge component
function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger' }) {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  const variantClasses = {
    default: 'bg-blue-100 text-blue-800',
    secondary: 'bg-green-100 text-green-800',
    success: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800'
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </span>
  );
}

// Progress bar component
function ProgressBar({ percentage, className = '' }: { percentage: number; className?: string }) {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div 
        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

// Rating component
function Rating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        />
      ))}
      <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function StudyMaterialClient({ syllabusTopics }: StudyMaterialClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'PRACTICE_PAPER' | 'TOPIC_PDF'>('ALL');
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'downloads' | 'difficulty' | 'recent'>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [expandedTopic, setExpandedTopic] = useState<number | null>(0);
  const [difficultyFilter, setDifficultyFilter] = useState<'ALL' | 'Easy' | 'Medium' | 'Hard'>('ALL');
  const [bookmarkedMaterials, setBookmarkedMaterials] = useState<Set<string>>(new Set());
  const [topicsData, setTopicsData] = useState<SyllabusTopic[]>(syllabusTopics);

  // Load saved state from sessionStorage on component mount
  useEffect(() => {
    const savedState = sessionStorage.getItem('studyMaterialsState');
    if (savedState) {
      const {
        searchTerm: savedSearchTerm,
        filterCategory: savedFilterCategory,
        sortBy: savedSortBy,
        viewMode: savedViewMode,
        expandedTopic: savedExpandedTopic,
        difficultyFilter: savedDifficultyFilter,
        bookmarkedMaterials: savedBookmarks
      } = JSON.parse(savedState);
      
      setSearchTerm(savedSearchTerm || '');
      setFilterCategory(savedFilterCategory || 'ALL');
      setSortBy(savedSortBy || 'name');
      setViewMode(savedViewMode || 'grid');
      setExpandedTopic(savedExpandedTopic !== null ? savedExpandedTopic : 0);
      setDifficultyFilter(savedDifficultyFilter || 'ALL');
      setBookmarkedMaterials(new Set(savedBookmarks || []));
    }
  }, []);

  // Save state to sessionStorage whenever it changes
  useEffect(() => {
    const stateToSave = {
      searchTerm,
      filterCategory,
      sortBy,
      viewMode,
      expandedTopic,
      difficultyFilter,
      bookmarkedMaterials: Array.from(bookmarkedMaterials)
    };
    sessionStorage.setItem('studyMaterialsState', JSON.stringify(stateToSave));
  }, [searchTerm, filterCategory, sortBy, viewMode, expandedTopic, difficultyFilter, bookmarkedMaterials]);

  // Toggle bookmark status
  const toggleBookmark = (materialName: string) => {
    const newBookmarks = new Set(bookmarkedMaterials);
    if (newBookmarks.has(materialName)) {
      newBookmarks.delete(materialName);
    } else {
      newBookmarks.add(materialName);
    }
    setBookmarkedMaterials(newBookmarks);
    
    setTopicsData(prevTopics => 
      prevTopics.map(topic => ({
        ...topic,
        materials: topic.materials?.map(material => 
          material.materialName === materialName 
            ? { ...material, bookmarked: newBookmarks.has(materialName) }
            : material
        )
      }))
    );
  };

  // Calculate total materials and stats
  const totalMaterials = topicsData.reduce((acc, topic) => acc + (topic.materials?.length || 0), 0);
  const practicePapers = topicsData.reduce((acc, topic) => 
    acc + (topic.materials?.filter(m => m.category === 'PRACTICE_PAPER').length || 0), 0
  );
  const topicPDFs = totalMaterials - practicePapers;
  const totalQuestions = topicsData.reduce((acc, topic) => 
    acc + (topic.materials?.reduce((sum, m) => sum + (m.questions || 0), 0) || 0), 0
  );
  const totalPages = topicsData.reduce((acc, topic) => 
    acc + (topic.materials?.reduce((sum, m) => sum + (m.pages || 0), 0) || 0), 0
  );

  // Filter and sort materials
  const filteredTopics = useMemo(() => {
    return topicsData.map(topic => {
      const filteredMaterials = topic.materials?.filter(material => {
        const matchesSearch = material.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          topic.title.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = filterCategory === 'ALL' || material.category === filterCategory;
        const matchesDifficulty = difficultyFilter === 'ALL' || material.difficulty === difficultyFilter;
        
        return matchesSearch && matchesCategory && matchesDifficulty;
      });

      // Sort materials
      const sortedMaterials = filteredMaterials?.sort((a, b) => {
        switch (sortBy) {
          case 'rating':
            return (b.rating || 0) - (a.rating || 0);
          case 'downloads':
            return (b.downloadCount || 0) - (a.downloadCount || 0);
          case 'recent':
            return new Date(b.lastUpdated || '').getTime() - new Date(a.lastUpdated || '').getTime();
          case 'difficulty':
            const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
            return (difficultyOrder[a.difficulty || 'Easy'] || 0) - (difficultyOrder[b.difficulty || 'Easy'] || 0);
          default:
            return a.materialName.localeCompare(b.materialName);
        }
      });

      return {
        ...topic,
        materials: sortedMaterials?.map(material => ({
          ...material,
          bookmarked: bookmarkedMaterials.has(material.materialName)
        }))
      };
    }).filter(topic => topic.materials && topic.materials.length > 0);
  }, [topicsData, searchTerm, filterCategory, difficultyFilter, sortBy, bookmarkedMaterials]);

  const getCategoryIcon = (category: string) => {
    return category === 'PRACTICE_PAPER' ? <FileText className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />;
  };

  const getCategoryLabel = (category: string) => {
    return category === 'PRACTICE_PAPER' ? 'Practice Paper' : 'Topic PDF';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'success';
      case 'Medium': return 'warning';
      case 'Hard': return 'danger';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'danger';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  // Download material handler
  const handleDownload = (materialName: string) => {
    // Update download count in the UI
    setTopicsData(prevTopics => 
      prevTopics.map(topic => ({
        ...topic,
        materials: topic.materials?.map(material => 
          material.materialName === materialName 
            ? { ...material, downloadCount: (material.downloadCount || 0) + 1 }
            : material
        )
      }))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Study Materials Hub
              </h1>
              <p className="text-gray-600 mt-2 text-base sm:text-lg">Your comprehensive exam preparation companion</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <div className="flex items-center bg-blue-50 px-3 py-2 rounded-lg">
                <Award className="w-4 h-4 mr-2 text-blue-600" />
                <span className="font-medium">{topicsData.length} Topics</span>
              </div>
              <div className="flex items-center bg-green-50 px-3 py-2 rounded-lg">
                <FileText className="w-4 h-4 mr-2 text-green-600" />
                <span className="font-medium">{totalMaterials} Materials</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mx-auto mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">{topicPDFs}</h3>
              <p className="text-blue-100">Topic PDFs</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mx-auto mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">{practicePapers}</h3>
              <p className="text-green-100">Practice Papers</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mx-auto mb-4">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">{bookmarkedMaterials.size}</h3>
              <p className="text-purple-100">Bookmarked</p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Search and Filter */}
        <Card className="mb-8 shadow-lg">
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600" />
                <input
                  type="text"
                  placeholder="Search materials, topics, or keywords..."
                  className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base text-gray-900"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-3">
                <div className="relative flex items-center">
                  <Filter className="absolute left-3 w-4 h-4 text-gray-600" />
                  <select
                    className="border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-gray-900"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value as any)}
                  >
                    <option value="ALL">All Materials</option>
                    <option value="TOPIC_PDF">Topic PDFs</option>
                    <option value="PRACTICE_PAPER">Practice Papers</option>
                  </select>
                  <ChevronDown className="absolute right-3 w-4 h-4 text-gray-600" />
                </div>

                <div className="relative flex items-center">
                  <select
                    className="border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-gray-900"
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value as any)}
                  >
                    <option value="ALL">All Difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                  <div className="absolute left-3 flex items-center">
                    <span className="w-2 h-2 rounded-full mr-1 bg-green-500"></span>
                    <span className="w-2 h-2 rounded-full mr-1 bg-yellow-500"></span>
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  </div>
                  <ChevronDown className="absolute right-3 w-4 h-4 text-gray-600" />
                </div>

                <div className="relative flex items-center">
                  <SortAsc className="absolute left-3 w-4 h-4 text-gray-600" />
                  <select
                    className="border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-gray-900"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                  >
                    <option value="name">Sort by Name</option>
                    <option value="rating">Sort by Rating</option>
                    <option value="downloads">Sort by Downloads</option>
                    <option value="recent">Sort by Recent</option>
                    <option value="difficulty">Sort by Difficulty</option>
                  </select>
                  <ChevronDown className="absolute right-3 w-4 h-4 text-gray-600" />
                </div>

                <div className="flex bg-gray-100 rounded-lg p-1 items-center">
                  <button
                    className={`p-2 rounded-md transition-colors flex items-center ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                    onClick={() => setViewMode('grid')}
                    aria-label="Grid view"
                  >
                    <Grid className="w-4 h-4" />
                    <span className="ml-1 text-sm hidden sm:inline">Grid</span>
                  </button>
                  <button
                    className={`p-2 rounded-md transition-colors flex items-center ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                    onClick={() => setViewMode('list')}
                    aria-label="List view"
                  >
                    <List className="w-4 h-4" />
                    <span className="ml-1 text-sm hidden sm:inline">List</span>
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Study Materials */}
        <div className="space-y-6">
          {filteredTopics.map((topic, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="pb-0">
                <div className="flex flex-col md:flex-row items-start justify-between mb-6 gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{topic.title}</h2>
                      <Badge variant={getPriorityColor(topic.priority || 'Medium') as any}>
                        {topic.priority || 'Medium'} Priority
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-4 text-sm sm:text-base">{topic.description}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Award className="w-4 h-4 flex-shrink-0" />
                        <span>Weightage: {topic.weightage}/{topic.totalMarks} marks</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FileText className="w-4 h-4 flex-shrink-0" />
                        <span>{topic.materials?.length || 0} materials</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium">{topic.completedPercentage || 0}% completed</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <ProgressBar percentage={topic.completedPercentage || 0} />
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl sm:text-3xl font-bold text-blue-600">{topic.weightage}</div>
                    <div className="text-sm text-gray-500">marks</div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">Available Materials</h3>
                    <button
                      onClick={() => setExpandedTopic(expandedTopic === i ? null : i)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm sm:text-base"
                    >
                      <span>{expandedTopic === i ? 'Collapse' : 'Expand'}</span>
                      {expandedTopic === i ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {topic.materials && topic.materials.length > 0 ? (
                    <div className={`${expandedTopic === i ? 'max-h-none' : 'max-h-96 overflow-hidden'} transition-all duration-300`}>
                      <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-4`}>
                        {topic.materials.map((material, j) => (
                          <div key={j} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-5 hover:shadow-md transition-all duration-300 border border-gray-200">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex flex-wrap items-center gap-2">
                                {getCategoryIcon(material.category)}
                                <Badge variant={material.category === 'PRACTICE_PAPER' ? 'secondary' : 'default'}>
                                  {getCategoryLabel(material.category)}
                                </Badge>
                                {material.difficulty && (
                                  <Badge variant={getDifficultyColor(material.difficulty) as any}>
                                    {material.difficulty}
                                  </Badge>
                                )}
                              </div>
                              <button 
                                onClick={() => toggleBookmark(material.materialName)}
                                className={`p-1 rounded-full ${material.bookmarked ? 'text-yellow-500' : 'text-gray-400 hover:text-gray-600'}`}
                                aria-label={material.bookmarked ? "Remove bookmark" : "Add bookmark"}
                              >
                                <Star className={`w-4 h-4 ${material.bookmarked ? 'fill-current' : ''}`} />
                              </button>
                            </div>
                            
                            <h4 className="font-semibold text-gray-900 mb-3 line-clamp-2 text-base sm:text-lg">
                              {material.materialName}
                            </h4>
                            
                            <div className="space-y-2 mb-4">
                              {material.rating && <Rating rating={material.rating} />}
                              
                              <div className="flex flex-wrap items-center justify-between text-sm text-gray-600 gap-2">
                                {material.pages && (
                                  <div className="flex items-center gap-1">
                                    <span>{material.pages} pages</span>
                                  </div>
                                )}
                                {material.questions && (
                                  <div className="flex items-center gap-1">
                                    <span>{material.questions} questions</span>
                                  </div>
                                )}
                              </div>
                              
                              {material.lastUpdated && (
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                  <Clock className="w-4 h-4" />
                                  <span>Updated {new Date(material.lastUpdated).toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <a
                                href={material.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View PDF
                              </a>
                              <button 
                                onClick={() => handleDownload(material.materialName)}
                                className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                                aria-label="Download"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">No materials available</h4>
                      <p>Materials for this topic will be added soon</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTopics.length === 0 && (
          <Card className="shadow-lg">
            <CardContent className="text-center py-16">
              <Search className="w-16 h-16 mx-auto mb-6 text-gray-300" />
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">No materials found</h3>
              <p className="text-gray-500 text-base sm:text-lg mb-6">Try adjusting your search or filter criteria</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setFilterCategory('ALL');
                  setDifficultyFilter('ALL');
                }}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                Clear All Filters
              </button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}