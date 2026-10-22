import { useState, useMemo, lazy, Suspense } from "react"
import { Link } from "react-router-dom"
import { Home, Truck, Navigation, RefreshCw, AlertCircle } from "lucide-react"
import { useManagerCouriersLiveTracking } from "@/shared/hooks"
import { Spinner, Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage, BreadcrumbSeparator } from "@/shared/ui"

const GoogleMap = lazy(() =>
  import("@/widgets/map").then((mod) => ({ default: mod.GoogleMap }))
)

export default function ManagerCouriersMapPage() {
  const { data: trackingRes, isLoading, isError, error, refetch } = useManagerCouriersLiveTracking()
  const [selectedCourierId, setSelectedCourierId] = useState(null)

  const normalizedCouriers = useMemo(() => {
    const rawCouriers = trackingRes?.data?.couriers || trackingRes?.data || (Array.isArray(trackingRes) ? trackingRes : null)
    const couriers = Array.isArray(rawCouriers) ? rawCouriers : []

    return couriers.map((c) => ({
      ...c,
      id: c.courierId || c.id,
      name: c.fullName || c.name || "Kuryer",
      phone: c.phone || "",
      coords: c.coords || (c.latitude && c.longitude ? [c.latitude, c.longitude] : null),
      targetCoords:
        c.targetCoords ||
        (c.activeOrderLatitude && c.activeOrderLongitude
          ? [c.activeOrderLatitude, c.activeOrderLongitude]
          : null),
      currentDestination: c.currentDestination || c.activeOrderAddress || "",
      vehicle: c.vehicle || `${c.vehicleModel || ""} ${c.vehiclePlateNumber || ""}`.trim() || "Mashina",
      status: c.currentStatus || c.status || "ACTIVE",
    }))
  }, [trackingRes])

  return (
    <div className="space-y-5 pb-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList className="text-xs">
          <BreadcrumbItem>
            <Link to="/manager" className="text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              <span>Bosh sahifa</span>
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold text-slate-800">
              Jonli xarita
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Dastavkachilar jonli xaritasi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kuryerlar lokatsiyasi va marshrut monitoringi.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => refetch()}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs cursor-pointer flex items-center gap-2 text-xs font-semibold"
            title="Xaritani yangilash"
          >
            <RefreshCw className="size-4" />
            <span>Yangilash</span>
          </button>
        </div>
      </div>

      {/* Error state banner */}
      {isError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between text-xs text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>Kuryerlar lokatsiyasini yuklashda xatolik yuz berdi: {error?.response?.data?.message || error?.message || "Server xatosi"}</span>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-3 py-1 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition cursor-pointer"
          >
            Qayta urinish
          </button>
        </div>
      )}

      {/* Main Map + Couriers List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-auto lg:h-[calc(100vh-230px)] min-h-[500px]">
        {/* Map Container (9 cols on large screen) */}
        <div className="lg:col-span-8 xl:col-span-9 h-[380px] sm:h-[450px] lg:h-full rounded-2xl overflow-hidden border border-slate-200 shadow-xs relative bg-white">
          <Suspense
            fallback={
              <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-white">
                <Spinner size="lg" />
                <span className="text-xs font-medium text-slate-500">Xarita yuklanmoqda...</span>
              </div>
            }
          >
            <GoogleMap
              couriers={normalizedCouriers}
              selectedCourierId={selectedCourierId}
              onSelectCourier={(id) => setSelectedCourierId(id)}
              className="w-full h-full"
            />
          </Suspense>
        </div>

        {/* Couriers Sidebar Panel (3 cols on large screen) */}
        <div className="lg:col-span-4 xl:col-span-3 h-[340px] sm:h-[400px] lg:h-full flex flex-col bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Kuryerlar ro'yxati
            </span>
            <span className="text-[11px] font-semibold text-slate-500">
              {normalizedCouriers.length} ta liniyada
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs">
                <Spinner size="sm" />
                <span>Yuklanmoqda...</span>
              </div>
            ) : normalizedCouriers.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                Hozircha onlayn kuryerlar mavjud emas
              </div>
            ) : (
              normalizedCouriers.map((courier) => {
                const isSelected = selectedCourierId === courier.id
                return (
                  <button
                    key={courier.id}
                    type="button"
                    onClick={() => setSelectedCourierId(courier.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                      isSelected
                        ? "bg-blue-50/80 border-blue-300 ring-2 ring-blue-500/20 shadow-xs"
                        : "bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50/60 shadow-2xs"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`size-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          isSelected ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-700"
                        }`}>
                          <Truck className="size-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-900 block truncate">
                            {courier.name}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium truncate block">
                            {courier.vehicle}
                          </span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        courier.coords ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-600"
                      }`}>
                        {courier.coords ? "GPS Faol" : "Oflayn"}
                      </span>
                    </div>

                    {courier.currentDestination && (
                      <div className="text-[11px] text-slate-600 bg-slate-50 p-1.5 rounded-lg border border-slate-100 flex items-start gap-1">
                        <Navigation className="size-3 text-blue-600 shrink-0 mt-0.5" />
                        <span className="truncate">{courier.currentDestination}</span>
                      </div>
                    )}
                  </button>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
