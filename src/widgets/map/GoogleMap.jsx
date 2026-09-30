import { useEffect, useRef, useState, useCallback } from "react"
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react"

const YANDEX_API_KEY = import.meta.env.VITE_YANDEX_MAPS_KEY

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
 * Koordinatalarni to'g'ri [Latitude, Longitude] formatiga o'tkazish
 * Inversion xatosini oldini oladi (agar adashib [lon, lat] kelib qolsa ham to'g'rilaydi)
 */
function toLatLong(coords) {
  if (!coords) return QASHQADARYO_CENTER

  if (Array.isArray(coords)) {
    if (coords.length < 2) return QASHQADARYO_CENTER
    const first = Number(coords[0])
    const second = Number(coords[1])
    if (Number.isNaN(first) || Number.isNaN(second)) return QASHQADARYO_CENTER

    // Agar [lon, lat] bo'lsa (lon ~ 64-68, lat ~ 38-40) -> [lat, lon] qilamiz
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

export default function GoogleMap({
  center = QASHQADARYO_CENTER,
  zoom = 8.5,
  couriers = [],
  selectedCourierId = null,
  onSelectCourier = () => {},
  className = "w-full h-full min-h-125",
}) {
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const onSelectCourierRef = useRef(onSelectCourier)
  useEffect(() => {
    onSelectCourierRef.current = onSelectCourier
  }, [onSelectCourier])

  const [mapType, setMapType] = useState("roadmap") // "roadmap" | "satellite"
  const [loadStatus, setLoadStatus] = useState(() => {
    if (!YANDEX_API_KEY) return "error"
    if (typeof window !== "undefined" && window.ymaps?.Map) return "ready"
    return "loading"
  })
  const [errorDetail, setErrorDetail] = useState(() => {
    if (!YANDEX_API_KEY) {
      return "API kalit .env faylida topilmadi (VITE_YANDEX_MAPS_KEY)"
    }
    return null
  })

  // Yandex Maps JavaScript SDK yuklash (standart [Latitude, Longitude] formati)
  useEffect(() => {
    if (!YANDEX_API_KEY) return

    let isMounted = true

    const loadYandexMaps = () => {
      if (window.ymaps?.Map) {
        if (isMounted) setLoadStatus("ready")
        return
      }

      const scriptId = "yandex-maps-sdk"
      let script = document.getElementById(scriptId)

      // Agar oldingi skriptda coordorder=longlat bo'lgan bo'lsa, uni tozalaymiz
      if (script && (script.src.includes("coordorder=longlat") || !script.src.includes(YANDEX_API_KEY))) {
        script.remove()
        script = null
        if (window.ymaps) {
          try {
            delete window.ymaps
          } catch {
            window.ymaps = undefined
          }
        }
      }

      if (!script) {
        script = document.createElement("script")
        script.id = scriptId
        script.type = "text/javascript"
        script.src = `https://api-maps.yandex.ru/2.1/?apikey=${YANDEX_API_KEY}&lang=uz_UZ`
        script.async = true
        document.head.appendChild(script)
      }

      const handleLoad = () => {
        if (window.ymaps) {
          window.ymaps.ready(() => {
            if (isMounted) setLoadStatus("ready")
          })
        }
      }

      const handleError = () => {
        if (isMounted) {
          setErrorDetail("Yandex Maps skripti yuklanmadi (tarmoq xatosi)")
          setLoadStatus("error")
        }
      }

      script.addEventListener("load", handleLoad)
      script.addEventListener("error", handleError)
    }

    loadYandexMaps()

    return () => {
      isMounted = false
    }
  }, [])

  // Placemarklarni chizish funksiyasi
  const renderPlacemarks = useCallback(
    (map) => {
      if (!map || !window.ymaps) return

      map.geoObjects.removeAll()

      // Qarshi markaziy pin (Placemark) - Latitude 38.8612, Longitude 65.7847
      const basePlacemark = new window.ymaps.Placemark(
        QARSHI_MARKER_COORDS,
        {
          iconContent: "Qarshi",
          hintContent: "Qashqadaryo viloyati (Qarshi shahri)",
        },
        {
          preset: "islands#blueStretchyIcon",
          hasBalloon: false,
          openBalloonOnClick: false,
        }
      )
      map.geoObjects.add(basePlacemark)

      // Kuryerlar markerlari (agar mavjud bo'lsa)
      if (Array.isArray(couriers) && couriers.length > 0) {
        couriers.forEach((courier) => {
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

          // Tanlangan kuryer uchun yo'nalish chizig'i va mijoz manzili
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
      }
    },
    [couriers, selectedCourierId]
  )

  // Map instance yaratish
  useEffect(() => {
    if (loadStatus !== "ready" || !mapContainerRef.current || !window.ymaps) return
    if (mapInstanceRef.current) return

    window.ymaps.ready(() => {
      if (!mapContainerRef.current || mapInstanceRef.current) return

      try {
        const initialCenter = toLatLong(center)

        const map = new window.ymaps.Map(
          mapContainerRef.current,
          {
            center: initialCenter, // [Latitude, Longitude] = [38.8986, 66.0464]
            zoom: zoom || 8.5,
            type: mapType === "satellite" ? "yandex#hybrid" : "yandex#map",
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
        console.error("[YandexMap] Xarita init xatosi:", err)
        setErrorDetail(err?.message || "Nomaʼlum xato")
        setLoadStatus("error")
      }
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy()
        mapInstanceRef.current = null
      }
    }
  }, [loadStatus, center, zoom, renderPlacemarks, mapType])

  // Placemarklarni sinxronlashtirish
  useEffect(() => {
    if (mapInstanceRef.current) {
      renderPlacemarks(mapInstanceRef.current)
    }
  }, [renderPlacemarks])

  // Tanlangan kuryerga silliq o'tish
  useEffect(() => {
    if (mapInstanceRef.current && selectedCourierId && Array.isArray(couriers)) {
      const selected = couriers.find((c) => c.id === selectedCourierId)
      if (selected?.coords) {
        const coords = toLatLong(selected.coords)
        mapInstanceRef.current.panTo(coords, { flying: true, duration: 600 })
      }
    }
  }, [selectedCourierId, couriers])

  // Xarita turini almashtirish (Sxema vs Sun'iy yo'ldosh)
  useEffect(() => {
    if (mapInstanceRef.current && window.ymaps) {
      mapInstanceRef.current.setType(
        mapType === "satellite" ? "yandex#hybrid" : "yandex#map"
      )
    }
  }, [mapType])

  /**
   * Arrow navigation buttons (↑ ↓ ← →)
   * Viewportning 25% qismi miqdorida siljitadi, zoom saqlanadi
   */
  const handlePan = useCallback((direction) => {
    const map = mapInstanceRef.current
    if (!map) return

    try {
      const currentCenter = map.getCenter() // [Latitude, Longitude]
      if (!currentCenter || currentCenter.length < 2) return

      let stepLat = 0.04
      let stepLon = 0.05

      // Viewport o'lchami asosida 25% siljish hisoblash
      const bounds = map.getBounds() // [[SW_lat, SW_lon], [NE_lat, NE_lon]]
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
          // Yuqoriga (Shimoliy yo'nalish: kenglik/latitude ortadi)
          newLat = curLat + stepLat
          break
        case "down":
          // Pastga (Janubiy yo'nalish: kenglik/latitude kamayadi)
          newLat = curLat - stepLat
          break
        case "left":
          // Chapga (G'arbiy yo'nalish: uzunlik/longitude kamayadi)
          newLon = curLon - stepLon
          break
        case "right":
          // O'ngga (Sharqiy yo'nalish: uzunlik/longitude ortadi)
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

      {/* Layer Toggle (Xarita vs Sun'iy yo'ldosh) */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-lg shadow-sm border border-slate-200 pointer-events-auto">
        <button
          type="button"
          onClick={() => setMapType("roadmap")}
          className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
            mapType === "roadmap"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Xarita
        </button>
        <button
          type="button"
          onClick={() => setMapType("satellite")}
          className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
            mapType === "satellite"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Sun'iy yo'ldosh
        </button>
      </div>

      {/* Yandex Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[31.25rem]" />

      {/* Loading State */}
      {loadStatus === "loading" && (
        <div className="absolute inset-0 bg-slate-50/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2.5 z-20">
          <RefreshCw className="w-7 h-7 text-blue-600 animate-spin" />
          <p className="text-xs font-medium text-slate-600">Yandex Xarita yuklanmoqda...</p>
        </div>
      )}

      {/* Error State */}
      {loadStatus === "error" && (
        <div className="absolute inset-0 bg-slate-100 flex flex-col items-center justify-center p-6 text-center z-20">
          <div className="bg-white p-6 rounded-2xl border border-red-200 shadow-sm max-w-md">
            <p className="text-sm font-bold text-red-600 mb-2">Yandex Maps yuklanmadi</p>
            <p className="text-xs text-slate-600 mb-2">
              .env faylingizda kalit kiritilganini tekshiring va dev-serverni qayta yoqing.
            </p>
            {errorDetail && (
              <p className="text-[11px] text-slate-400 font-mono">{errorDetail}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}