"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen, MapPin, Award, Play, Loader2, CheckCircle,
  ShoppingCart, Search, Map, Grid, Filter, X, ChevronDown, ChevronUp,
  Star, Users, Calendar, Eye, Navigation
} from "lucide-react";
import axios from "axios";
import dynamic from "next/dynamic";

const UniversitiesMap = dynamic(() => import("@/components/UniversitiesMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[700px] bg-gradient-to-br from-blue-50 to-slate-100 rounded-2xl flex items-center justify-center shadow-md">
      <div className="text-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-3" />
        <p className="text-slate-600 font-medium">Loading interactive map...</p>
      </div>
    </div>
  ),
});

interface University {
  slug: string;
  name: string;
  description: string;
  location: string;
  mapLocation: string;
  ranking: number;
  established: number;
  website?: string;
  admissionLink?: string;
  examsAccepted: string[];
  courses: {
    slug: string;
    name: string;
    description: string;
    examSlug: string;
    price: number;
  }[];
  allCoursesPrice: number;
  purchased?: boolean;
  students?: number;
  rating?: number;
}

interface UserData {
  id?: number;
  userid?: number;
  username: string;
  name: string;
  email: string;
}

type ViewMode = 'grid' | 'map';
type SortOption = 'ranking' | 'name' | 'established' | 'rating';

const cityCoords: Record<string, string> = {
  'ahmedabad': '23.033863,72.585022',
  'vadodara': '22.310696,73.192635',
  'gandhinagar': '23.237560,72.647781',
  'surat': '21.170240,72.831062',
  'anand': '22.552778,72.951389',
  'rajkot': '22.3038945,70.8021599',
  'junagadh': '21.521940,70.457775',
  'jamnagar': '22.47077,70.057722',
  'bhavnagar': '21.764459,72.151889',
  'porbandar': '21.642138,69.609170',
};


export default function UniversitiesPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [universities, setUniversities] = useState<University[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [examFilter, setExamFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('ranking');
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedUniversity, setSelectedUniversity] = useState<string | null>(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const [quickViewUniversity, setQuickViewUniversity] = useState<University | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  // Process university data with fallback coordinates
  const processUniversityData = (universitiesData: University[]) => {
    return universitiesData.map((uni) => {
      let cleanedMapLocation = uni.mapLocation ? String(uni.mapLocation).trim().replace(/\s+/g, ' ') : '';
      let isValid = false;
      
      if (cleanedMapLocation && cleanedMapLocation.includes(',')) {
        const coords = cleanedMapLocation.split(',').map(c => parseFloat(c.trim()));
        isValid = coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1]) && coords[0] !== 0 && coords[1] !== 0;
      }

      if (!isValid) {
        const locationParts = uni.location.toLowerCase().split(',');
        const city = locationParts[0].trim();
        cleanedMapLocation = cityCoords[city] || '23.0225,72.5714';
        console.warn(`Assigned fallback for ${uni.name} in ${city}: ${cleanedMapLocation}`);
      }

      // Add random student count and rating if not provided (for demo purposes)
      return { 
        ...uni, 
        mapLocation: cleanedMapLocation, 
        purchased: uni.purchased ?? undefined,
        students: uni.students || Math.floor(Math.random() * 20000) + 1000,
        rating: uni.rating || (4 + Math.random() * 0.9)
      };
    });
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (!token || !storedUser) {
          setError("Please log in to view universities");
          setLoading(false);
          return;
        }

        const parsedUser: UserData = JSON.parse(storedUser);
        setUser(parsedUser);

        const userId = parsedUser.id || parsedUser.userid;
        if (!userId) {
          setError("User ID missing, please re-login");
          setLoading(false);
          return;
        }

        try {
          // Try to fetch data from API
          const response = await axios.get(`${API_BASE_URL}/api/universities`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          
          const universitiesData: University[] = response.data;
          const processedUniversities = processUniversityData(universitiesData);
          
          setUniversities(processedUniversities);
          setFilteredUniversities(processedUniversities);
        } catch (apiError) {
          console.error("API failed, using fallback data", apiError);
        }
        
        setLoading(false);
      } catch (err: any) {
        console.error("Error processing universities:", err);
        setError(err.message || "Failed to load universities. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, [API_BASE_URL]);

  useEffect(() => {
    let result = [...universities];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(uni =>
        uni.name.toLowerCase().includes(query) ||
        uni.location.toLowerCase().includes(query) ||
        uni.description.toLowerCase().includes(query) ||
        uni.examsAccepted.some((exam: string) => exam.toLowerCase().includes(query))
      );
    }

    if (locationFilter) {
      result = result.filter(uni =>
        uni.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (examFilter) {
      result = result.filter(uni =>
        uni.examsAccepted.some(exam => exam.toLowerCase().includes(examFilter.toLowerCase()))
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'ranking') {
        return sortAsc ? a.ranking - b.ranking : b.ranking - a.ranking;
      } else if (sortBy === 'name') {
        return sortAsc
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'established') {
        return sortAsc
          ? a.established - b.established
          : b.established - a.established;
      } else if (sortBy === 'rating') {
        return sortAsc
          ? (a.rating || 0) - (b.rating || 0)
          : (b.rating || 0) - (a.rating || 0);
      }
      return 0;
    });

    setFilteredUniversities(result);
  }, [universities, searchQuery, locationFilter, examFilter, sortBy, sortAsc]);

  const handlePurchaseClick = async (universitySlug: string) => {
    if (!user) return;

    // Mark this university as "loading"
    setPurchaseLoading(prev => new Set([...prev, universitySlug]));
    
    // Simulated delay (like processing payment)
    setTimeout(() => {
      // Remove loading state
      setPurchaseLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(universitySlug);
        return newSet;
      });

      // Update university list → mark as purchased
      setUniversities(prev => 
        prev.map(uni => 
          uni.slug === universitySlug 
            ? { ...uni, purchased: true }
            : uni
        )
      );
      setFilteredUniversities(prev => 
        prev.map(uni => 
          uni.slug === universitySlug 
            ? { ...uni, purchased: true }
            : uni
        )
      );
    }, 1500); // ⏳ 1.5 seconds delay
  };

  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(option);
      setSortAsc(true);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setLocationFilter('');
    setExamFilter('');
    setShowFilters(false);
  };

  const openQuickView = (university: University) => {
    setQuickViewUniversity(university);
    setShowQuickView(true);
  };

  const closeQuickView = () => {
    setShowQuickView(false);
    setTimeout(() => setQuickViewUniversity(null), 300);
  };

  const viewOnMap = (universitySlug: string) => {
    setSelectedUniversity(universitySlug);
    setViewMode('map');
    window.scrollTo({ top: 600, behavior: 'smooth' });
  };

  function getRankingConfig(ranking: number) {
    if (ranking <= 10) return {
      bg: "bg-gradient-to-r from-amber-50 to-amber-100",
      text: "text-amber-700",
      border: "border-amber-200",
      badge: "from-amber-500 to-amber-600",
    };
    if (ranking <= 50) return {
      bg: "bg-gradient-to-r from-blue-50 to-blue-100",
      text: "text-blue-700",
      border: "border-blue-200",
      badge: "from-blue-500 to-blue-600",
    };
    return {
      bg: "bg-gradient-to-r from-slate-50 to-slate-100",
      text: "text-slate-700",
      border: "border-slate-200",
      badge: "from-slate-500 to-slate-600",
    };
  }

  
 

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400 opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-slate-400 opacity-10 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Top Universities <span className="text-blue-400">2025</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed font-light">
              Explore prestigious institutions and prepare with our comprehensive resources.{' '}
              <span className="text-blue-400 font-semibold">Access exclusive study materials.</span>
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl px-6 py-3 border border-white border-opacity-20 hover:bg-opacity-25 transition-all duration-300 transform hover:scale-105">
                <div className="text-2xl font-bold text-white">{universities.length}</div>
                <div className="text-sm text-blue-100 font-medium">Universities</div>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl px-6 py-3 border border-white border-opacity-20 hover:bg-opacity-25 transition-all duration-300 transform hover:scale-105">
                <div className="text-2xl font-bold text-white">{universities.filter(u => u.purchased).length}</div>
                <div className="text-sm text-blue-100 font-medium">Purchased</div>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl px-6 py-3 border border-white border-opacity-20 hover:bg-opacity-25 transition-all duration-300 transform hover:scale-105">
                <div className="text-2xl font-bold text-white">{universities.reduce((acc, uni) => acc + uni.courses.length, 0)}</div>
                <div className="text-sm text-blue-100 font-medium">Courses</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-slate-100">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search universities by name, location, or exam..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors transform hover:scale-105"
              >
                <Filter className="w-5 h-5 mr-2" />
                Filters
                {showFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
              </button>
              <div className="flex bg-slate-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors transform hover:scale-105 ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'hover:bg-slate-200'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors transform hover:scale-105 ${viewMode === 'map' ? 'bg-white shadow-sm text-blue-600' : 'hover:bg-slate-200'}`}
                >
                  <Map className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="Filter by location..."
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Exam</label>
                  <input
                    type="text"
                    placeholder="Filter by exam..."
                    value={examFilter}
                    onChange={(e) => setExamFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Sort By</label>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => handleSort('ranking')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors transform hover:scale-105 ${sortBy === 'ranking' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                    >
                      Ranking {sortBy === 'ranking' && (sortAsc ? '↑' : '↓')}
                    </button>
                    <button
                      onClick={() => handleSort('name')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors transform hover:scale-105 ${sortBy === 'name' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                    >
                      Name {sortBy === 'name' && (sortAsc ? '↑' : '↓')}
                    </button>
                    <button
                      onClick={() => handleSort('established')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors transform hover:scale-105 ${sortBy === 'established' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                    >
                      Year {sortBy === 'established' && (sortAsc ? '↑' : '↓')}
                    </button>
                    <button
                      onClick={() => handleSort('rating')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors transform hover:scale-105 ${sortBy === 'rating' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                    >
                      Rating {sortBy === 'rating' && (sortAsc ? '↑' : '↓')}
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors transform hover:scale-105"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
          <div className="mt-4 flex justify-between items-center flex-wrap gap-2">
            <p className="text-sm text-slate-600">
              Showing <span className="font-semibold">{filteredUniversities.length}</span> of <span className="font-semibold">{universities.length}</span> universities
            </p>
            {(searchQuery || locationFilter || examFilter) && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-slate-600">Active filters:</span>
                {searchQuery && (
                  <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                    Search: {searchQuery}
                    <button
                      onClick={() => setSearchQuery('')}
                      className="ml-1 text-blue-500 hover:text-blue-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {locationFilter && (
                  <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                    Location: {locationFilter}
                    <button
                      onClick={() => setLocationFilter('')}
                      className="ml-1 text-blue-500 hover:text-blue-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {examFilter && (
                  <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                    Exam: {examFilter}
                    <button
                      onClick={() => setExamFilter('')}
                      className="ml-1 text-blue-500 hover:text-blue-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* University Listing */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUniversities.map((university) => {
              const rankingConfig = getRankingConfig(university.ranking);
              const coords = university.mapLocation.split(',').map(c => parseFloat(c.trim()));
              const hasValidLocation = coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1]) && coords[0] !== 0 && coords[1] !== 0;

              return (
                <div key={university.slug} className="group relative overflow-hidden">
                  <div className={`bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 p-6 border ${hasValidLocation ? 'border-slate-200 border-opacity-50 hover:border-blue-300 hover:border-opacity-50' : 'border-red-200'} transform hover:-translate-y-1 hover:scale-102 h-full flex flex-col`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                    <div className="relative z-10 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-xl font-bold text-slate-800 group-hover:text-blue-700 transition-colors leading-tight flex-1 pr-3 ${!hasValidLocation ? 'text-red-600' : ''}`}>
                          {university.name} {!hasValidLocation && <span className="text-sm font-normal">(Location N/A)</span>}
                        </h3>
                        <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap ${rankingConfig.bg} ${rankingConfig.text} ${rankingConfig.border} border shadow-sm transform group-hover:scale-105 transition-transform duration-300`}>
                          #{university.ranking}
                        </span>
                      </div>
                      <p className="text-slate-600 group-hover:text-slate-700 mb-4 text-sm leading-relaxed transition-colors flex-1">
                        {university.description.length > 100
                          ? `${university.description.substring(0, 100)}...`
                          : university.description}
                      </p>
                      <div className="space-y-3 text-sm mb-4">
                        <div className={`flex items-center ${hasValidLocation ? 'text-slate-500 group-hover:text-slate-600 transition-colors' : 'text-red-500'}`}>
                          <div className={`p-1 ${hasValidLocation ? 'bg-gradient-to-r from-slate-600 to-slate-700' : 'bg-red-500'} rounded-lg mr-2`}>
                            <MapPin className="w-3 h-3 text-white" />
                          </div>
                          <span className="font-medium">{university.location}</span>
                        </div>
                        <div className="flex items-center text-slate-500 group-hover:text-slate-600 transition-colors">
                          <div className="p-1 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg mr-2">
                            <BookOpen className="w-3 h-3 text-white" />
                          </div>
                          <span className="font-medium">
                            {university.examsAccepted.length > 0
                              ? `Exams: ${university.examsAccepted.slice(0, 2).join(', ')}${university.examsAccepted.length > 2 ? ` +${university.examsAccepted.length - 2}` : ''}`
                              : 'Direct Admission'}
                          </span>
                        </div>
                        <div className="flex items-center text-slate-500 group-hover:text-slate-600 transition-colors">
                          <div className="p-1 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg mr-2">
                            <Award className="w-3 h-3 text-white" />
                          </div>
                          <span className="font-medium">Est. {university.established}</span>
                        </div>
                        <div className="flex items-center text-slate-500 group-hover:text-slate-600 transition-colors">
                          <div className="p-1 bg-gradient-to-r from-amber-600 to-amber-700 rounded-lg mr-2">
                            <Star className="w-3 h-3 text-white" />
                          </div>
                          <span className="font-medium">{university.rating?.toFixed(1)} Rating</span>
                        </div>
                        {university.courses.length > 0 && (
                          <div className="flex items-center text-slate-500 group-hover:text-slate-600 transition-colors">
                            <div className="p-1 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg mr-2">
                              <BookOpen className="w-3 h-3 text-white" />
                            </div>
                            <span className="font-medium">{university.courses.length} courses available</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-auto pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-2">
                            <Link
                              href={`/universities/${university.slug}`}
                              className="text-sm font-semibold text-blue-600 flex items-center group-hover:text-blue-700 transition-colors transform hover:translate-x-1"
                            >
                              <Play className="w-4 h-4 mr-1" />
                              Details
                            </Link>
                            <button
                              onClick={() => openQuickView(university)}
                              className="text-sm font-semibold text-slate-600 flex items-center group-hover:text-slate-700 transition-colors transform hover:translate-x-1"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Quick View
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => viewOnMap(university.slug)}
                          className="mt-3 w-full flex items-center justify-center text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors py-2 rounded-lg bg-slate-50 hover:bg-blue-50"
                        >
                          <Navigation className="w-4 h-4 mr-1" />
                          See on Map
                        </button>
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 to-slate-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-sm"></div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Interactive University Map</h2>
                  <p className="text-slate-600">
                    Explore {filteredUniversities.length} universities on the map. Click markers for details or use the search to navigate.
                    {filteredUniversities.some(u => u.mapLocation.split(',').map(c => parseFloat(c.trim())).some(isNaN) || parseFloat(u.mapLocation.split(',')[0]) === 0) && <span className="text-red-500 ml-1">⚠️ Some locations approximated</span>}
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-500">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-amber-500 rounded-full mr-1"></div>
                    <span>Top 10</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                    <span>Top 50</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-slate-500 rounded-full mr-1"></div>
                    <span>Others</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[700px] relative">
              <UniversitiesMap universities={filteredUniversities} />
              <div className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-md p-4 max-w-xs">
                <h3 className="font-bold text-slate-800 mb-2">Map Guide</h3>
                <p className="text-sm text-slate-600 mb-2">Click on any marker to see university details</p>
                <p className="text-sm text-slate-600">Use the search box to find specific universities</p>
                <button 
                  onClick={() => setViewMode('grid')}
                  className="mt-3 w-full text-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  ← Back to List View
                </button>
              </div>
            </div>
          </div>
        )}
        {filteredUniversities.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No universities found</h3>
            <p className="text-slate-600 mb-4">
              {searchQuery || locationFilter || examFilter
                ? "Try adjusting your search or filters"
                : "No universities available at the moment. Please check back later."
              }
            </p>
            {(searchQuery || locationFilter || examFilter) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors transform hover:scale-105"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {showQuickView && quickViewUniversity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="p-6 border-b border-slate-200 sticky top-0 bg-white z-10">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-slate-800">University Quick View</h3>
                <button onClick={closeQuickView} className="text-slate-400 hover:text-slate-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-2/3">
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-2xl font-bold text-slate-800">{quickViewUniversity.name}</h2>
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${getRankingConfig(quickViewUniversity.ranking).bg} ${getRankingConfig(quickViewUniversity.ranking).text}`}>
                      #{quickViewUniversity.ranking}
                    </span>
                  </div>
                  <p className="text-slate-600 mb-6">{quickViewUniversity.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center text-slate-600">
                      <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                      <span>{quickViewUniversity.location}</span>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <Award className="w-5 h-5 mr-2 text-emerald-500" />
                      <span>Est. {quickViewUniversity.established}</span>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <Star className="w-5 h-5 mr-2 text-amber-500" />
                      <span>{quickViewUniversity.rating?.toFixed(1)} Rating</span>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <Users className="w-5 h-5 mr-2 text-purple-500" />
                      <span>{quickViewUniversity.students?.toLocaleString()} Students</span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-slate-800 mb-3">Exams Accepted</h4>
                    <div className="flex flex-wrap gap-2">
                      {quickViewUniversity.examsAccepted.map((exam, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          {exam}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {quickViewUniversity.courses.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-slate-800 mb-3">Available Courses</h4>
                      <div className="space-y-2">
                        {quickViewUniversity.courses.slice(0, 3).map((course, index) => (
                          <div key={index} className="p-3 bg-slate-50 rounded-lg">
                            <h5 className="font-medium text-slate-800">{course.name}</h5>
                            <p className="text-sm text-slate-600">{course.description}</p>
                            <p className="text-sm text-slate-700 mt-1">Exam: {course.examSlug}</p>
                          </div>
                        ))}
                        {quickViewUniversity.courses.length > 3 && (
                          <p className="text-sm text-slate-500">+{quickViewUniversity.courses.length - 3} more courses</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="md:w-1/3">
                  <div className="bg-slate-50 rounded-xl p-5 sticky top-24">
                    <h4 className="font-semibold text-slate-800 mb-4">Admission Details</h4>
                    <div className="mb-4">
                      <p className="text-sm text-slate-600 mb-2">Website:</p>
                      <a href={quickViewUniversity.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm block truncate">
                        {quickViewUniversity.website}
                      </a>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm text-slate-600 mb-2">Admission Link:</p>
                      <a href={quickViewUniversity.admissionLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm block truncate">
                        {quickViewUniversity.admissionLink}
                      </a>
                    </div>
                    <button
                      onClick={() => viewOnMap(quickViewUniversity.slug)}
                      className="w-full flex items-center justify-center text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors py-2 rounded-lg bg-slate-100 hover:bg-blue-50 mb-4"
                    >
                      <Navigation className="w-4 h-4 mr-1" />
                      See on Map
                    </button>
                    <div className="flex justify-between items-center mt-6">
                      <Link
                        href={`/universities/${quickViewUniversity.slug}`}
                        className="text-sm font-semibold text-blue-600 flex items-center hover:text-blue-700 transition-colors"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Full Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
        .animate-slide-up { animation: slide-up 0.5s ease-out; }
        .custom-marker { background: none !important; border: none !important; }
        .custom-marker div { margin: 0 !important; }
        .leaflet-popup-content-wrapper {
          border-radius: 12px !important;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
        }
        .leaflet-popup-tip { box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important; }
        @media (max-width: 768px) {
          .grid { grid-template-columns: repeat(1, minmax(0, 1fr)); }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        .transition-all {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 300ms;
        }
        .group:hover .group-hover\:scale-102 { transform: scale(1.02); }
        .group:hover .group-hover\:translate-x-1 { transform: translateX(0.25rem); }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin { animation: spin 1s linear infinite; }
        .h-full { height: 100% !important; }
      `}</style>
    </div>
  );
}
