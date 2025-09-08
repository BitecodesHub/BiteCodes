"use client"

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface MapComponentProps {
  // For single university
  coordinates?: [number, number]
  universityName?: string
  // For multiple universities
  universities?: Array<{
    coordinates: [number, number]
    universityName: string
  }>
}

export default function MapComponent({ coordinates, universityName, universities }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])

  useEffect(() => {
    if (!mapRef.current) return

    // Initialize map only once
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstance.current)
    }

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []

    if (universities && universities.length > 0) {
      // Multiple universities
      universities.forEach(uni => {
        const marker = L.marker(uni.coordinates)
          .addTo(mapInstance.current!)
          .bindPopup(uni.universityName)
        markersRef.current.push(marker)
      })

      // Fit bounds
      const group = L.featureGroup(markersRef.current)
      const bounds = group.getBounds()
      if (bounds.isValid()) {
        mapInstance.current.fitBounds(bounds, { padding: [50, 50] })
      }
    } else if (coordinates) {
      // Single university
      const marker = L.marker(coordinates)
        .addTo(mapInstance.current!)
        .bindPopup(universityName || 'University')
        .openPopup()
      markersRef.current.push(marker)
      mapInstance.current.setView(coordinates, 13)
    }
  }, [coordinates, universityName, universities])

  return <div ref={mapRef} className="h-full w-full" />
}