"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Calendar, ExternalLink, Book, X } from 'lucide-react';

// Fix for default markers in Leaflet (run once)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Types
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
  courses: Array<{
    slug: string;
    name: string;
    description: string;
    examSlug: string;
    price: number;
  }>;
  allCoursesPrice: number;
  purchased?: boolean;
}

interface UniversitiesMapProps {
  universities: University[];
}

// Component to fit map bounds to markers
const FitBounds = ({ validUniversities }: { validUniversities: Array<University & { coords: [number, number] }> }) => {
  const map = useMap();
  useEffect(() => {
    if (validUniversities.length === 0) return;
    const bounds = L.latLngBounds(validUniversities.map(uni => uni.coords));
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
  }, [map, validUniversities]);
  return null;
};

const UniversitiesMap: React.FC<UniversitiesMapProps> = ({ universities = [] }) => {
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Parse coordinates with fallback to Gujarat center
  const parseCoordinates = (mapLocation: string): [number, number] => {
    if (!mapLocation || mapLocation === '0,0') return [23.0225, 72.5714];
    const coords = mapLocation.split(',').map(coord => parseFloat(coord.trim()));
    return coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1]) 
      ? [coords[0], coords[1]] 
      : [23.0225, 72.5714];
  };

  // Memoize valid universities and bounds for map fit
  const validUniversities = useMemo(() => {
    return universities
      .map(uni => ({ ...uni, coords: parseCoordinates(uni.mapLocation) }))
      .filter(uni => uni.coords[0] !== 23.0225 || uni.coords[1] !== 72.5714); // Skip pure fallbacks
  }, [universities]);

  const center = useMemo(() => {
    if (validUniversities.length === 0) return [23.0225, 72.5714];
    const latSum = validUniversities.reduce((sum, uni) => sum + uni.coords[0], 0);
    const lngSum = validUniversities.reduce((sum, uni) => sum + uni.coords[1], 0);
    return [latSum / validUniversities.length, lngSum / validUniversities.length];
  }, [validUniversities]);

  // Get ranking color for custom icon
  const getRankingColor = (ranking: number) => {
    if (ranking <= 10) return '#f59e0b'; // Gold
    if (ranking <= 50) return '#3b82f6'; // Blue
    return '#6b7280'; // Gray
  };

  // Custom icon factory with university name
  const createCustomIcon = (ranking: number, name: string) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="display: flex; flex-direction: column; align-items: center; transform: translateY(-20px);">
          <div style="
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            font-size: 11px;
            font-weight: 500;
            padding: 2px 8px;
            border-radius: 4px;
            margin-bottom: 4px;
            text-align: center;
            max-width: 120px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          ">
            ${name}
          </div>
          <div style="
            background-color: ${getRankingColor(ranking)};
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 3px solid white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 12px;
            color: white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          ">
            ${ranking}
          </div>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 30], // Anchor at bottom of ranking circle
      popupAnchor: [0, -50], // Popup above name label
    });
  };

  useEffect(() => {
    // Simulate loading delay for map init
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleUniversityClick = (university: University) => {
    setSelectedUniversity(university);
  };

  const getRankingConfig = (ranking: number) => {
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
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-600 font-medium">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-96' : 'w-0'} transition-all duration-300 overflow-hidden bg-white border-r border-slate-200 flex flex-col shadow-lg z-10`}>
        <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">Universities ({universities.length})</h3>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
              aria-label="Toggle sidebar"
            >
              <Navigation className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-slate-600 mt-1">Click on any university to locate on map</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {universities.map((university) => {
            const rankingConfig = getRankingConfig(university.ranking);
            const isSelected = selectedUniversity?.slug === university.slug;
            const coords = parseCoordinates(university.mapLocation);
            const hasValidLocation = coords[0] !== 23.0225 || coords[1] !== 72.5714;

            return (
              <div
                key={university.slug}
                onClick={() => handleUniversityClick(university)}
                className={`p-4 border-b border-slate-100 cursor-pointer transition-all duration-200 hover:bg-slate-50 ${isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className={`font-semibold text-slate-800 text-sm leading-tight pr-2 ${!hasValidLocation ? 'text-red-500' : ''}`}>
                    {university.name} {!hasValidLocation && '(Location unavailable)'}
                  </h4>
                  <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${rankingConfig.bg} ${rankingConfig.text} ${rankingConfig.border} border flex-shrink-0`}>
                    #{university.ranking}
                  </span>
                </div>
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex items-center">
                    <MapPin className="w-3 h-3 mr-2 text-slate-400 flex-shrink-0" />
                    <span>{university.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-2 text-slate-400 flex-shrink-0" />
                    <span>Est. {university.established}</span>
                  </div>
                  <div className="flex items-center">
                    <Book className="w-3 h-3 mr-2 text-slate-400 flex-shrink-0" />
                    <span>{university.courses.length} courses available</span>
                  </div>
                </div>
                {university.examsAccepted.length > 0 && (
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-1">
                      {university.examsAccepted.slice(0, 2).map((exam) => (
                        <span key={exam} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
                          {exam.toUpperCase()}
                        </span>
                      ))}
                      {university.examsAccepted.length > 2 && (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
                          +{university.examsAccepted.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {university.purchased && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                      ✓ Purchased
                    </span>
                  </div>
                )}
              </div>
            );
          })}
          {universities.length === 0 && (
            <div className="p-4 text-center text-slate-500 text-sm">
              No universities to display
            </div>
          )}
        </div>
      </div>

      {/* Toggle button when sidebar is closed */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="absolute left-4 top-4 z-20 p-2 bg-white shadow-lg rounded-lg hover:bg-slate-50 transition-colors border border-slate-200"
          aria-label="Open sidebar"
        >
          <Navigation className="w-5 h-5 text-slate-600" />
        </button>
      )}

      {/* Map Container */}
      <div className="flex-1 relative">
        <MapContainer
          center={center as [number, number]}
          zoom={8}
          style={{ height: '100%', minHeight: '700px', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <FitBounds validUniversities={validUniversities} />
          {/* Render Markers */}
          {validUniversities.map((university) => {
            const icon = createCustomIcon(university.ranking, university.name);
            return (
              <Marker
                key={university.slug}
                position={university.coords as [number, number]}
                icon={icon}
                eventHandlers={{
                  click: () => {
                    setSelectedUniversity(university);
                  },
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-bold text-sm">{university.name}</h3>
                    <p className="text-xs text-gray-600 mt-1">{university.location}</p>
                    <p className="text-xs text-gray-500 mt-1">Rank #{university.ranking}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Map Controls (Legend) */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 border border-slate-200 z-[1000]">
          <div className="text-xs text-slate-600 font-medium mb-2">Legend</div>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-5 h-5 bg-amber-500 rounded-full mr-2 border-2 border-white shadow-sm flex items-center justify-center text-white text-xs font-bold">1</div>
              <span className="text-xs text-slate-600">Top 10 (Gold)</span>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-5 bg-blue-500 rounded-full mr-2 border-2 border-white shadow-sm flex items-center justify-center text-white text-xs font-bold">25</div>
              <span className="text-xs text-slate-600">Top 50 (Blue)</span>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-5 bg-slate-500 rounded-full mr-2 border-2 border-white shadow-sm flex items-center justify-center text-white text-xs font-bold">75</div>
              <span className="text-xs text-slate-600">Others (Gray)</span>
            </div>
          </div>
          {universities.filter(u => parseCoordinates(u.mapLocation)[0] === 23.0225).length > 0 && (
            <div className="mt-2 pt-2 border-t border-slate-200">
              <p className="text-xs text-red-500">⚠️ Some universities have invalid locations</p>
            </div>
          )}
        </div>

        {/* Selected University Info */}
        {selectedUniversity && (
          <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl shadow-xl p-4 border border-slate-200 max-w-md mx-auto z-[1000]">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 text-lg">{selectedUniversity.name}</h3>
                <div className="flex items-center mt-1 text-sm text-slate-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  {selectedUniversity.location}
                </div>
              </div>
              <span className={`px-3 py-1.5 rounded-xl text-sm font-semibold ${getRankingConfig(selectedUniversity.ranking).bg} ${getRankingConfig(selectedUniversity.ranking).text} ${getRankingConfig(selectedUniversity.ranking).border} border ml-2 flex-shrink-0`}>
                Rank #{selectedUniversity.ranking}
              </span>
            </div>
            <p className="text-slate-600 text-sm mb-3 leading-relaxed">{selectedUniversity.description}</p>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="flex items-center text-sm text-slate-500">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Est. {selectedUniversity.established}</span>
              </div>
              <div className="flex items-center text-sm text-slate-500">
                <Book className="w-4 h-4 mr-2" />
                <span>{selectedUniversity.courses.length} courses</span>
              </div>
            </div>
            {selectedUniversity.examsAccepted.length > 0 && (
              <div className="mb-3">
                <div className="text-xs text-slate-500 mb-2">Exams Accepted:</div>
                <div className="flex flex-wrap gap-1">
                  {selectedUniversity.examsAccepted.map((exam) => (
                    <span key={exam} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                      {exam.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {selectedUniversity.courses.length > 0 && (
              <div className="mb-3">
                <div className="text-xs text-slate-500 mb-2">Popular Courses:</div>
                <div className="space-y-1">
                  {selectedUniversity.courses.slice(0, 2).map((course) => (
                    <div key={course.slug} className="text-sm text-slate-700">
                      • {course.name}
                    </div>
                  ))}
                  {selectedUniversity.courses.length > 2 && (
                    <div className="text-xs text-slate-500">
                      +{selectedUniversity.courses.length - 2} more courses
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="text-sm text-emerald-600 font-semibold">
                All Courses: ₹{selectedUniversity.allCoursesPrice}
              </div>
              {selectedUniversity.website && (
                <a
                  href={selectedUniversity.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                >
                  Visit Website
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              )}
            </div>
            <button
              onClick={() => setSelectedUniversity(null)}
              className="absolute top-2 right-2 p-1 hover:bg-slate-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        )}
      </div>

      {/* Fallback if no valid markers */}
      {!validUniversities.length && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-20">
          <div className="text-center p-4 bg-white rounded-lg shadow-lg">
            <p className="text-slate-600 mb-2">No valid locations found</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversitiesMap;