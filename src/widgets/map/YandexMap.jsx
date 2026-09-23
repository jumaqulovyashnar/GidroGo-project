import { useEffect, useRef, useState } from "react"
import { MapPin, Navigation, Car, AlertCircle, RefreshCw, ZoomIn, ZoomOut, Compass } from "lucide-react"

const YANDEX_API_KEY = "2e2d5d970d7b1a4f3eef9da375f6c32837c32ae6070884fcdaa4b9ab7a01a28b"
const QASHQADARYO_CENTER = [38.8986231, 66.0463534]

/**
 * Yandex Map Component for GidroGo Manager dispatching
 * Dynamically loads Yandex Maps API v2.1 with full Qashqadaryo / Qarshi couriers & routes
 */
export default function YandexMap({
  center = QASHQADARYO_CENTER,
  zoom = 13,
  couriers = [],
  orders = [],
  selectedCourierId = null,
  onSelectCourier = () => {},
  className = "w-full h-full min-h-[500px]",
}) {
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const [loadStatus, setLoadStatus] = useState("loading") // "loading" | "ready" | "fallback"
  const [activeLayer, setActiveLayer] = useState("map") // "map" | "satellite"

  // Load Yandex script
  useEffect(() => {
    let isMounted = true

    const loadYandexScript = () => {
      if (window.ymaps && window.ymaps.Map) {
        if (isMounted) setLoadStatus("ready")
        return
      }

      // Check if script tag already exists
      const existingScript = document.getElementById("yandex-map-script")
      if (existingScript) {
        if (window.ymaps) {
          window.ymaps.ready(() => {
            if (isMounted) setLoadStatus("ready")
          })
        }
        return
      }

      const script = document.createElement("script")
      script.id = "yandex-map-script"
      script.type = "text/javascript"
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${YANDEX_API_KEY}&lang=uz_UZ`
      script.async = true

      const timeoutId = setTimeout(() => {
        if (isMounted && loadStatus === "loading") {
          console.warn("Yandex Maps API load timed out, falling back to vector map.")
          setLoadStatus("fallback")
        }
      }, 7000)

      script.onload = () => {
        clearTimeout(timeoutId)
        if (window.ymaps) {
          window.ymaps.ready(() => {
            if (isMounted) setLoadStatus("ready")
          })
        } else if (isMounted) {
          setLoadStatus("fallback")
        }
      }

      script.onerror = () => {
        clearTimeout(timeoutId)
        if (isMounted) setLoadStatus("fallback")
      }

      document.head.appendChild(script)
    }

    loadYandexScript()

    return () => {
      isMounted = false
    }
  }, [loadStatus])

  // Initialize and update Map instance when API is ready
  useEffect(() => {
    if (loadStatus !== "ready" || !mapContainerRef.current || !window.ymaps) return

    window.ymaps.ready(() => {
      if (!mapContainerRef.current) return

      try {
        // Destroy previous instance if needed
        if (mapInstanceRef.current) {
          mapInstanceRef.current.destroy()
          mapInstanceRef.current = null
        }

        const map = new window.ymaps.Map(mapContainerRef.current, {
          center: center,
          zoom: zoom,
          controls: ["zoomControl", "typeSelector", "fullscreenControl"],
        }, {
          searchControlProvider: "yandex#search",
        })

        mapInstanceRef.current = map

        // Central Base placemark (Oazis Water Qarshi Hub)
        const basePlacemark = new window.ymaps.Placemark(
          QASHQADARYO_CENTER,
          {
            balloonContentHeader: `<strong>Oazis Water — Qarshi Markaziy Baza</strong>`,
            balloonContentBody: `
              <div style="font-size: 13px; line-height: 1.4; color: #1e293b;">
                <p>📍 Qarshi shahar, Nasaf ko'chasi 1-A</p>
                <p>💧 Zaxira: <strong>10,600 litr</strong></p>
                <p>🚛 Navbatdagi mashinalar: 3 ta</p>
              </div>
            `,
            hintContent: "Oazis Water Qarshi Filiali",
          },
          {
            preset: "islands#blueDotIconWithCaption",
            iconColor: "#2563EB",
          }
        )
        map.geoObjects.add(basePlacemark)

        // Add Couriers Placemarks
        couriers.forEach((courier) => {
          if (!courier.coords) return

          const isSelected = selectedCourierId === courier.id
          const placemark = new window.ymaps.Placemark(
            courier.coords,
            {
              balloonContentHeader: `
                <div style="display: flex; align-items: center; gap: 8px;">
                  <strong style="color: #0f172a; font-size: 14px;">${courier.name}</strong>
                  <span style="background: ${courier.status === "on_way" ? "#dbeafe" : "#f1f5f9"}; color: ${courier.status === "on_way" ? "#1e40af" : "#475569"}; font-size: 11px; padding: 2px 6px; border-radius: 4px; font-weight: 600;">
                    ${courier.statusText || courier.status}
                  </span>
                </div>
              `,
              balloonContentBody: `
                <div style="font-size: 12px; line-height: 1.6; color: #334155; margin-top: 6px;">
                  <div>🚘 <strong>Transport:</strong> ${courier.vehicle || "Labo"} (${courier.plate || ""})</div>
                  <div>📦 <strong>Yuk holati:</strong> ${courier.load || "22/30"} kapsula</div>
                  <div>📞 <strong>Telefon:</strong> ${courier.phone || "+998 (90) 000-00-00"}</div>
                  <div>📍 <strong>Joriy yo'nalish:</strong> ${courier.currentDestination || "Qarshi markazi"}</div>
                  <div style="margin-top: 8px;">
                    <a href="tel:${courier.phone}" style="display: inline-block; background: #2563EB; color: white; padding: 4px 10px; border-radius: 6px; text-decoration: none; font-size: 11px; font-weight: 500;">
                      Qo'ng'iroq qilish
                    </a>
                  </div>
                </div>
              `,
              hintContent: `${courier.name} (${courier.vehicle})`,
            },
            {
              preset: isSelected ? "islands#redAutoIcon" : "islands#blueAutoIcon",
              iconColor: isSelected ? "#ef4444" : "#2563EB",
            }
          )

          placemark.events.add("click", () => {
            onSelectCourier(courier.id)
          })

          map.geoObjects.add(placemark)

          // If this courier is selected and has a delivery target, draw route line
          if (isSelected && courier.targetCoords) {
            const routeLine = new window.ymaps.Polyline(
              [courier.coords, courier.targetCoords],
              {
                hintContent: `Yo'nalish: ${courier.currentDestination}`,
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
              courier.targetCoords,
              {
                balloonContentHeader: `<strong>Mijoz manzili: ${courier.customerName || "Buyurtmachi"}</strong>`,
                balloonContentBody: `
                  <div style="font-size: 12px; color: #334155;">
                    <p>📍 ${courier.currentDestination}</p>
                    <p>📦 Mahsulot: ${courier.orderProduct || "18.9L Kapsula x 3"}</p>
                    <p>⏱ Kutilayotgan vaqt: <strong>${courier.eta || "15 daqiqa"}</strong></p>
                  </div>
                `,
                hintContent: "Mijoz yetkazish manzili",
              },
              {
                preset: "islands#darkOrangeDotIcon",
                iconColor: "#f97316",
              }
            )
            map.geoObjects.add(targetPlacemark)
          }
        })

        // Pan to selected courier if available
        if (selectedCourierId) {
          const selected = couriers.find((c) => c.id === selectedCourierId)
          if (selected && selected.coords) {
            map.panTo(selected.coords, { flying: true, duration: 600 })
          }
        }
      } catch (err) {
        console.error("Yandex Map init error:", err)
        setLoadStatus("fallback")
      }
    })
  }, [loadStatus, couriers, orders, selectedCourierId, center, zoom, onSelectCourier])

  // Center on selected courier change
  useEffect(() => {
    if (mapInstanceRef.current && selectedCourierId) {
      const selected = couriers.find((c) => c.id === selectedCourierId)
      if (selected && selected.coords) {
        mapInstanceRef.current.panTo(selected.coords, { flying: true, duration: 600 })
      }
    }
  }, [selectedCourierId, couriers])

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() + 1, { duration: 300 })
    }
  }

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() - 1, { duration: 300 })
    }
  }

  const handleResetCenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter(QASHQADARYO_CENTER, 13, { duration: 500 })
    }
  }

  const handleToggleLayer = (type) => {
    setActiveLayer(type)
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setType(type === "satellite" ? "yandex#satellite" : "yandex#map")
    }
  }

  return (
    <div className={`relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 ${className}`}>
      {/* Top Map Action Bar */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm border border-slate-200">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          <span>Qashqadaryo (Qarshi)</span>
        </div>
        <span className="text-slate-300">|</span>
        <span className="text-[11px] text-slate-500 font-mono">38.8986° N, 66.0464° E</span>
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Jonli GPS
        </span>
      </div>

      {/* Layer Toggle & Map Controls */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-lg shadow-sm border border-slate-200">
        <button
          type="button"
          onClick={() => handleToggleLayer("map")}
          className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
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
          className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
            activeLayer === "satellite"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Sun'iy yo'ldosh
        </button>
      </div>

      {/* Quick Zoom & Navigation Controls */}
      <div className="absolute bottom-6 right-3 z-10 flex flex-col gap-1.5">
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
          title="Qarshi markaziga qaytish"
        >
          <Compass className="w-4 h-4" />
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
          {/* Fallback Notice */}
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-800 border border-amber-200 text-xs px-3 py-1.5 rounded-lg w-fit shadow-xs">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Yandex xaritasi yuklanmadi (oflayn yoki tarmoq cheklovi). Interaktiv vektor sxemasi ishlamoqda.</span>
          </div>

          {/* Interactive Vector Map Grid of Qarshi */}
          <div className="relative flex-1 my-4 border border-blue-200/60 rounded-xl bg-white/70 backdrop-blur-sm p-4 overflow-hidden shadow-inner">
            {/* Roads & grid lines */}
            <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#93c5fd" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              {/* Nasaf road */}
              <line x1="10%" y1="20%" x2="90%" y2="80%" stroke="#3b82f6" strokeWidth="4" strokeDasharray="6 3" />
              {/* Mustaqillik avenue */}
              <line x1="15%" y1="75%" x2="85%" y2="25%" stroke="#2563eb" strokeWidth="5" />
              {/* Islom Karimov street */}
              <line x1="50%" y1="10%" x2="50%" y2="90%" stroke="#60a5fa" strokeWidth="3" />
            </svg>

            {/* Central Depot Hub */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg ring-4 ring-blue-200">
                <Navigation className="w-4 h-4 fill-white" />
              </div>
              <span className="mt-1 text-[11px] font-bold text-blue-900 bg-white/90 px-2 py-0.5 rounded shadow-xs border border-blue-200 whitespace-nowrap">
                Oazis Qarshi Bazasi
              </span>
            </div>

            {/* Couriers scattered across Qashqadaryo / Qarshi */}
            {couriers.map((courier, index) => {
              const isSelected = selectedCourierId === courier.id
              // Coordinate projections for Qashqadaryo relative to center
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
