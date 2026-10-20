import { useEffect, useRef, useState, useCallback } from "react"
import { Navigation, Car, AlertCircle, RefreshCw, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"

import { useYandexMapsLoader } from "./useYandexMapsLoader"

/**
 * Aniq Geografik Koordinatalar (Yandex Maps v2.1 standarti: [Latitude, Longitude])
 * Reference:
 *   Xarita markazi (Qashqadaryo viloyati): Latitude 38.8986, Longitude 66.0464
 *   Qarshi shahri markeri: Latitude 38.8612, Longitude 65.7847
 */
const QASHQADARYO_CENTER = [38.8986, 66.0464]
const QARSHI_MARKER_COORDS = [38.8612, 65.7847]

/**
 * Qashqadaryo viloyati Bounding Box (restrictMapArea uchun)
 * SW (Janubiy-G'arb): [38.0000, 64.3000]
 * NE (Shimoliy-Sharq): [39.8000, 67.5000]
 */
const QASHQADARYO_RESTRICT_BOUNDS = [
  [38.0000, 64.3000],
  [39.8000, 67.5000],
]

/**
 * Koordinatalarni [Latitude, Longitude] formatiga o'tkazish
 */
function toLatLong(coords) {
  if (!coords) return QASHQADARYO_CENTER

  if (Array.isArray(coords)) {
    if (coords.length < 2) return QASHQADARYO_CENTER
    const first = Number(coords[0])
    const second = Number(coords[1])
    if (Number.isNaN(first) || Number.isNaN(second)) return QASHQADARYO_CENTER

    // Agar [lon, lat] berilgan bo'lsa (lon ~ 64-68, lat ~ 38-40) -> [lat, lon]
    if (first > 50 && second < 50) {
      return [second, first]
    }
    return [first, second]
  }

  if (typeof coords === "object") {
    const lat = Number(coords.lat ?? coords.latitude)
    const lon = Number(coords.lng ?? coords.lon ?? coords.longitude)
    if (!Number.isNaN(lon) && !Number.isNaN(lat)) {
      return [lat, lon]
    }
  }

  return QASHQADARYO_CENTER
}

/**
 * Yandex Map Component for GidroGo Manager dispatching
 */
export default function YandexMap({
  center = QASHQADARYO_CENTER,
  zoom = 8.5,
  couriers = [],
  _orders = [],
  selectedCourierId = null,
  onSelectCourier = () => {},
  className = "w-full h-full min-h-[500px]",
}) {
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const onSelectCourierRef = useRef(onSelectCourier)
  useEffect(() => {
    onSelectCourierRef.current = onSelectCourier
  }, [onSelectCourier])

  const { loadStatus } = useYandexMapsLoader()
  const [activeLayer, setActiveLayer] = useState("map") // "map" | "satellite"

  // Helper to populate/refresh markers without destroying the map instance
  const renderPlacemarks = useCallback((map) => {
    if (!map || !window.ymaps) return

    map.geoObjects.removeAll()

    // Central Base placemark (Oazis Water Qarshi Hub) - Latitude 38.8612, Longitude 65.7847
    const basePlacemark = new window.ymaps.Placemark(
      QARSHI_MARKER_COORDS,
      {
        iconContent: "Qarshi",
        hintContent: "Qarshi shahri",
      },
      {
        preset: "islands#blueStretchyIcon",
        hasBalloon: false,
        openBalloonOnClick: false,
      }
    )
    map.geoObjects.add(basePlacemark)

    // Add Couriers Placemarks
    couriers.forEach((courier) => {
      if (!courier.coords) return
      const courierCoord = toLatLong(courier.coords)
      if (!courierCoord) return

      const isSelected = selectedCourierId === courier.id
      const placemark = new window.ymaps.Placemark(
        courierCoord,
        {
          hintContent: `${courier.name} (${courier.vehicle || "Kuryer"})`,
        },
        {
          preset: isSelected ? "islands#redAutoIcon" : "islands#blueAutoIcon",
          iconColor: isSelected ? "#ef4444" : "#2563EB",
        }
      )

      placemark.events.add("click", () => {
        onSelectCourierRef.current?.(courier.id)
      })

      map.geoObjects.add(placemark)

      // If this courier is selected and has a delivery target, draw route line
      if (isSelected && courier.targetCoords) {
        const targetCoord = toLatLong(courier.targetCoords)
        if (targetCoord) {
          const routeLine = new window.ymaps.Polyline(
            [courierCoord, targetCoord],
            {
              hintContent: `Yo'nalish: ${courier.currentDestination || ""}`,
            },
            {
              strokeColor: "#2563EB",
              strokeWidth: 4,
              strokeOpacity: 0.8,
              strokeStyle: "shortdash",
            }
          )
          map.geoObjects.add(routeLine)

          // Add Target delivery point
          const targetPlacemark = new window.ymaps.Placemark(
            targetCoord,
            {
              hintContent: "Mijoz yetkazish manzili",
            },
            {
              preset: "islands#darkOrangeDotIcon",
              iconColor: "#f97316",
            }
          )
          map.geoObjects.add(targetPlacemark)
        }
      }
    })
  }, [couriers, selectedCourierId])

  // Initialize Map instance once when API is ready
  useEffect(() => {
    if (loadStatus !== "ready" || !mapContainerRef.current || !window.ymaps) return
    if (mapInstanceRef.current) return

    window.ymaps.ready(() => {
      if (!mapContainerRef.current || mapInstanceRef.current) return

      try {
        const initialType = activeLayer === "satellite" ? "yandex#hybrid" : "yandex#map"

        const map = new window.ymaps.Map(
          mapContainerRef.current,
          {
            center: toLatLong(center),
            zoom: zoom || 8.5,
            type: initialType,
            controls: ["zoomControl"],
          },
          {
            restrictMapArea: QASHQADARYO_RESTRICT_BOUNDS,
            minZoom: 7,
            maxZoom: 18,
            suppressMapOpenBlock: true,
          }
        )

        mapInstanceRef.current = map
        renderPlacemarks(map)
      } catch (err) {
        console.error("Yandex Map init error:", err)
        setLoadStatus("fallback")
      }
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy()
        mapInstanceRef.current = null
      }
    }
  }, [loadStatus, center, zoom, activeLayer, renderPlacemarks])

  // Synchronize placemarks without recreating map
  useEffect(() => {
    if (mapInstanceRef.current) {
      renderPlacemarks(mapInstanceRef.current)
    }
  }, [renderPlacemarks])

  // Center on selected courier change
  useEffect(() => {
    if (mapInstanceRef.current && selectedCourierId) {
      const selected = couriers.find((c) => c.id === selectedCourierId)
      if (selected?.coords) {
        const coords = toLatLong(selected.coords)
        mapInstanceRef.current.panTo(coords, { flying: true, duration: 600 })
      }
    }
  }, [selectedCourierId, couriers])

  // Synchronize map type when activeLayer changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      const targetType = activeLayer === "satellite" ? "yandex#hybrid" : "yandex#map"
      mapInstanceRef.current.setType(targetType)
    }
  }, [activeLayer])

  const handleToggleLayer = (type) => {
    setActiveLayer(type)
    if (mapInstanceRef.current) {
      const targetType = type === "satellite" ? "yandex#hybrid" : "yandex#map"
      mapInstanceRef.current.setType(targetType)
    }
  }

  /**
   * Arrow navigation buttons (↑ ↓ ← →)
   * 25% of visible viewport
   */
  const handlePan = useCallback((direction) => {
    const map = mapInstanceRef.current
    if (!map) return

    try {
      const currentCenter = map.getCenter() // [Latitude, Longitude]
      if (!currentCenter || currentCenter.length < 2) return

      let stepLat = 0.04
      let stepLon = 0.05

      const bounds = map.getBounds()
      if (bounds && bounds.length === 2) {
        const spanLat = Math.abs(bounds[1][0] - bounds[0][0])
        const spanLon = Math.abs(bounds[1][1] - bounds[0][1])
        stepLat = spanLat * 0.25
        stepLon = spanLon * 0.25
      } else {
        const currentZoom = map.getZoom() || 8.5
        stepLat = (180 / Math.pow(2, currentZoom)) * 0.25
        stepLon = (360 / Math.pow(2, currentZoom)) * 0.25
      }

      const [curLat, curLon] = currentCenter
      let newLat = curLat
      let newLon = curLon

      switch (direction) {
        case "up":
          newLat = curLat + stepLat
          break
        case "down":
          newLat = curLat - stepLat
          break
        case "left":
          newLon = curLon - stepLon
          break
        case "right":
          newLon = curLon + stepLon
          break
        default:
          return
      }

      map.panTo([newLat, newLon], {
        duration: 300,
        flying: false,
        checkZoomRange: true,
      })
    } catch (err) {
      console.error("[YandexMap] Navigatsiyada xatolik:", err)
    }
  }, [])

  return (
    <div className={`relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 ${className}`}>
      {/* 4 ta Arrow Navigation Buttons: [ ↑ ] / [ ← ][ → ] / [ ↓ ] */}
      <div
        className="absolute bottom-8 right-3 z-10 flex flex-col items-center bg-white/95 backdrop-blur-md p-1.5 rounded-xl shadow-md border border-slate-200 pointer-events-auto select-none"
        role="group"
        aria-label="Xarita navigatsiyasi"
      >
        <button
          type="button"
          onClick={() => handlePan("up")}
          aria-label="Xaritani yuqoriga surish"
          title="Yuqoriga surish"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-700 hover:text-blue-600 hover:bg-slate-100 active:bg-blue-50 active:scale-95 transition-all cursor-pointer shadow-xs border border-transparent hover:border-slate-200"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-1 my-0.5">
          <button
            type="button"
            onClick={() => handlePan("left")}
            aria-label="Xaritani chapga surish"
            title="Chapga surish"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-700 hover:text-blue-600 hover:bg-slate-100 active:bg-blue-50 active:scale-95 transition-all cursor-pointer shadow-xs border border-transparent hover:border-slate-200"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handlePan("right")}
            aria-label="Xaritani o‘ngga surish"
            title="O'ngga surish"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-700 hover:text-blue-600 hover:bg-slate-100 active:bg-blue-50 active:scale-95 transition-all cursor-pointer shadow-xs border border-transparent hover:border-slate-200"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <button
          type="button"
          onClick={() => handlePan("down")}
          aria-label="Xaritani pastga surish"
          title="Pastga surish"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-700 hover:text-blue-600 hover:bg-slate-100 active:bg-blue-50 active:scale-95 transition-all cursor-pointer shadow-xs border border-transparent hover:border-slate-200"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Layer Toggle & Map Controls */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-lg shadow-sm border border-slate-200 pointer-events-auto">
        <button
          type="button"
          onClick={() => handleToggleLayer("map")}
          className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
            activeLayer === "map"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Xarita
        </button>
        <button
          type="button"
          onClick={() => handleToggleLayer("satellite")}
          className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
            activeLayer === "satellite"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Sun'iy yo'ldosh
        </button>
      </div>

      {/* Actual Map Container */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[500px]" />

      {/* Loading state indicator */}
      {loadStatus === "loading" && (
        <div className="absolute inset-0 bg-slate-50/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2.5 z-20">
          <RefreshCw className="w-7 h-7 text-blue-600 animate-spin" />
          <p className="text-xs font-medium text-slate-600">Yandex Xarita yuklanmoqda...</p>
        </div>
      )}

      {/* Vector Fallback if offline / API restricted */}
      {loadStatus === "fallback" && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-sky-50 to-blue-50 p-6 flex flex-col justify-between overflow-hidden">
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-800 border border-amber-200 text-xs px-3 py-1.5 rounded-lg w-fit shadow-xs">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Yandex xaritasi yuklanmadi (oflayn yoki tarmoq cheklovi). Interaktiv vektor sxemasi ishlamoqda.</span>
          </div>

          <div className="relative flex-1 my-4 border border-blue-200/60 rounded-xl bg-white/70 backdrop-blur-sm p-4 overflow-hidden shadow-inner">
            <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#93c5fd" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <line x1="10%" y1="20%" x2="90%" y2="80%" stroke="#3b82f6" strokeWidth="4" strokeDasharray="6 3" />
              <line x1="15%" y1="75%" x2="85%" y2="25%" stroke="#2563eb" strokeWidth="5" />
              <line x1="50%" y1="10%" x2="50%" y2="90%" stroke="#60a5fa" strokeWidth="3" />
            </svg>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg ring-4 ring-blue-200">
                <Navigation className="w-4 h-4 fill-white" />
              </div>
              <span className="mt-1 text-[11px] font-bold text-blue-900 bg-white/90 px-2 py-0.5 rounded shadow-xs border border-blue-200 whitespace-nowrap">
                Oazis Qarshi Bazasi
              </span>
            </div>

            {couriers.map((courier, index) => {
              const isSelected = selectedCourierId === courier.id
              const leftPercent = 50 + ((courier.coords?.[1] || 66.0463534) - 66.0463534) * 900
              const topPercent = 50 - ((courier.coords?.[0] || 38.8986231) - 38.8986231) * 900
              const clampedLeft = Math.max(12, Math.min(88, leftPercent))
              const clampedTop = Math.max(12, Math.min(88, topPercent))

              return (
                <button
                  key={courier.id || index}
                  type="button"
                  onClick={() => onSelectCourier(courier.id)}
                  style={{ left: `${clampedLeft}%`, top: `${clampedTop}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-all duration-300 z-10 ${
                    isSelected ? "scale-125 z-20" : "hover:scale-110"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all ${
                      isSelected
                        ? "bg-red-600 text-white ring-4 ring-red-200"
                        : courier.status === "on_way"
                        ? "bg-blue-600 text-white ring-2 ring-blue-200"
                        : "bg-slate-700 text-white ring-2 ring-slate-200"
                    }`}
                  >
                    <Car className="w-4 h-4" />
                  </div>
                  <div className="mt-1 bg-white/95 px-2 py-0.5 rounded text-[10px] font-semibold text-slate-800 shadow-sm border border-slate-200 whitespace-nowrap">
                    {courier.name}
                  </div>
                </button>
              )
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 bg-white/80 p-2 rounded-lg border border-slate-200">
            <span>📍 Qarshi markazi: Mustaqillik shox ko'chasi & Nasaf ko'chalari kesishmasi</span>
            <span className="font-medium text-blue-600">{couriers.length} ta kuryer kuzatuvda</span>
          </div>
        </div>
      )}
    </div>
  )
}
