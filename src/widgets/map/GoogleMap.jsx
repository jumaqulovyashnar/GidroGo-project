import { useEffect, useRef, useState, useMemo } from "react"
import { MapPin, Navigation, Car, ZoomIn, ZoomOut, Compass } from "lucide-react"

const GOOGLE_API_KEY = "your_yandex_maps_api_key_placeholder_for_security_reasons_000000"
const QASHQADARYO_CENTER = { lat: 38.8986231, lng: 66.0463534 }

/**
 * Google Maps Component for GidroGo Manager dispatching
 * Centered on Qashqadaryo (lat: 38.8986231, lng: 66.0463534)
 * Supports Google Maps JS API with seamless Google Embed engine
 */
export default function GoogleMap({
  center = QASHQADARYO_CENTER,
  zoom = 14,
  couriers = [],
  _orders = [],
  selectedCourierId = null,
  onSelectCourier = () => {},
  className = "w-full h-full min-h-[500px]",
}) {
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])

  const [loadMode, setLoadMode] = useState(() =>
    typeof window !== "undefined" && window.google?.maps ? "js_api" : "embed"
  )
  const [mapType, setMapType] = useState("roadmap") // "roadmap" | "satellite"
  const [currentZoom, setCurrentZoom] = useState(zoom)
  const [baseCenter, setBaseCenter] = useState(center)

  // Derive active center from selected courier
  const selectedCourier = useMemo(
    () => couriers.find((c) => c.id === selectedCourierId),
    [couriers, selectedCourierId]
  )

  const activeCenter = useMemo(() => {
    if (selectedCourier?.coords) {
      return { lat: selectedCourier.coords[0], lng: selectedCourier.coords[1] }
    }
    return baseCenter
  }, [selectedCourier, baseCenter])

  // Initialize Google Maps JavaScript SDK
  useEffect(() => {
    let isMounted = true

    window.gm_authFailure = () => {
      console.warn("Google Maps API auth warning, continuing with Google Embed engine.")
      if (isMounted) setLoadMode("embed")
    }

    if (window.google?.maps) return

    const scriptId = "google-maps-sdk"
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script")
      script.id = scriptId
      script.type = "text/javascript"
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places,geometry`
      script.async = true

      script.onload = () => {
        if (isMounted && window.google?.maps) {
          setLoadMode("js_api")
        }
      }

      script.onerror = () => {
        if (isMounted) setLoadMode("embed")
      }

      document.head.appendChild(script)
    }

    return () => {
      isMounted = false
    }
  }, [])

  // Mount Google Maps JS instance when available
  useEffect(() => {
    if (loadMode !== "js_api" || !mapContainerRef.current || !window.google?.maps) return

    try {
      const map = new window.google.maps.Map(mapContainerRef.current, {
        center: activeCenter,
        zoom: currentZoom,
        mapTypeId: mapType === "satellite" ? "hybrid" : "roadmap",
        disableDefaultUI: true,
        zoomControl: false,
      })

      mapInstanceRef.current = map

      markersRef.current.forEach((m) => m.setMap(null))
      markersRef.current = []

      // Base marker (Qashqadaryo Hub)
      const baseMarker = new window.google.maps.Marker({
        position: QASHQADARYO_CENTER,
        map,
        title: "Oazis Water — Qashqadaryo Markaziy Baza",
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#2563EB",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      })
      markersRef.current.push(baseMarker)

      // Courier markers
      couriers.forEach((courier) => {
        if (!courier.coords) return
        const isSelected = selectedCourierId === courier.id
        const courierPos = { lat: courier.coords[0], lng: courier.coords[1] }

        const marker = new window.google.maps.Marker({
          position: courierPos,
          map,
          title: `${courier.name} (${courier.vehicle})`,
          icon: {
            path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: isSelected ? 6 : 5,
            fillColor: isSelected ? "#ef4444" : "#2563EB",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
            rotation: 45,
          },
        })

        marker.addListener("click", () => {
          onSelectCourier(courier.id)
        })

        markersRef.current.push(marker)
      })
    } catch (err) {
      console.error("Google Maps JS init error:", err)
    }
  }, [loadMode, couriers, activeCenter, currentZoom, mapType, onSelectCourier, selectedCourierId])

  // Pan to active center if map is ready
  useEffect(() => {
    if (mapInstanceRef.current && activeCenter) {
      mapInstanceRef.current.panTo(activeCenter)
    }
  }, [activeCenter])

  const handleZoomIn = () => {
    setCurrentZoom((prev) => Math.min(prev + 1, 19))
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() + 1)
    }
  }

  const handleZoomOut = () => {
    setCurrentZoom((prev) => Math.max(prev - 1, 10))
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() - 1)
    }
  }

  const handleResetCenter = () => {
    setBaseCenter(QASHQADARYO_CENTER)
    setCurrentZoom(14)
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo(QASHQADARYO_CENTER)
      mapInstanceRef.current.setZoom(14)
    }
  }

  const handleToggleMapType = (type) => {
    setMapType(type)
    if (mapInstanceRef.current && window.google?.maps) {
      mapInstanceRef.current.setMapTypeId(type === "satellite" ? "hybrid" : "roadmap")
    }
  }

  // Google Maps Embed URL (Official Google Maps engine)
  const embedUrl = `https://maps.google.com/maps?q=${activeCenter.lat},${activeCenter.lng}&z=${currentZoom}&output=embed&t=${
    mapType === "satellite" ? "k" : "m"
  }`

  return (
    <div className={`relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 ${className}`}>
      {/* Top Map Action Bar */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm border border-slate-200">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          <span>Google Xarita — Qashqadaryo</span>
        </div>
        <span className="text-slate-300">|</span>
        <span className="text-[11px] text-slate-500 font-mono">38.8986° N, 66.0464° E</span>
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Google GPS Jonli
        </span>
      </div>

      {/* Layer Toggle (Roadmap vs Satellite) */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-lg shadow-sm border border-slate-200">
        <button
          type="button"
          onClick={() => handleToggleMapType("roadmap")}
          className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
            mapType === "roadmap"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Xarita
        </button>
        <button
          type="button"
          onClick={() => handleToggleMapType("satellite")}
          className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
            mapType === "satellite"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Sun'iy yo'ldosh
        </button>
      </div>

      {/* Quick Zoom & Navigation Controls */}
      <div className="absolute bottom-6 right-3 z-20 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={handleZoomIn}
          className="w-8 h-8 rounded-lg bg-white shadow-md border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors"
          title="Yaqinlashtirish"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="w-8 h-8 rounded-lg bg-white shadow-md border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors"
          title="Uzoqlashtirish"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleResetCenter}
          className="w-8 h-8 rounded-lg bg-white shadow-md border border-slate-200 flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors"
          title="Qashqadaryo markaziga qaytish"
        >
          <Compass className="w-4 h-4" />
        </button>
      </div>

      {/* Mode 1: Google Maps JS API Canvas */}
      {loadMode === "js_api" && (
        <div ref={mapContainerRef} className="w-full h-full min-h-[500px]" />
      )}

      {/* Mode 2: Official Google Maps Live Embed with Interactive Couriers Overlay */}
      {loadMode !== "js_api" && (
        <div className="relative w-full h-full min-h-[500px]">
          <iframe
            title="Google Map Qashqadaryo"
            src={embedUrl}
            className="w-full h-full min-h-[500px] border-0"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

          {/* Interactive Live Couriers Overlay on Top of Google Maps */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Center Base Hub */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg ring-4 ring-blue-200">
                <Navigation className="w-4 h-4 fill-white" />
              </div>
              <span className="mt-1 text-[11px] font-bold text-blue-900 bg-white/95 px-2 py-0.5 rounded shadow-sm border border-blue-200 whitespace-nowrap">
                Oazis Qashqadaryo Bazasi
              </span>
            </div>

            {/* Courier Markers */}
            {couriers.map((courier, idx) => {
              const isSelected = selectedCourierId === courier.id
              const diffLon = (courier.coords?.[1] || 66.0463534) - 66.0463534
              const diffLat = (courier.coords?.[0] || 38.8986231) - 38.8986231
              const leftPercent = 50 + diffLon * 1600
              const topPercent = 50 - diffLat * 1600
              const clampedLeft = Math.max(12, Math.min(88, leftPercent))
              const clampedTop = Math.max(14, Math.min(86, topPercent))

              return (
                <button
                  key={courier.id || idx}
                  type="button"
                  onClick={() => onSelectCourier(courier.id)}
                  style={{ left: `${clampedLeft}%`, top: `${clampedTop}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-all duration-300 pointer-events-auto ${
                    isSelected ? "scale-125 z-30" : "hover:scale-110 z-10"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all ${
                      isSelected
                        ? "bg-red-600 text-white ring-4 ring-red-200 shadow-lg"
                        : courier.status === "on_way"
                        ? "bg-blue-600 text-white ring-2 ring-blue-200 shadow-md"
                        : "bg-slate-700 text-white ring-2 ring-slate-200"
                    }`}
                  >
                    <Car className="w-4 h-4" />
                  </div>
                  <div className="mt-1 bg-white/95 px-2 py-0.5 rounded text-[10px] font-semibold text-slate-800 shadow-sm border border-slate-200 whitespace-nowrap flex items-center gap-1">
                    <span>{courier.name}</span>
                    <span className="text-[9px] text-blue-600">({courier.vehicle})</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
