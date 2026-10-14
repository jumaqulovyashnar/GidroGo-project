import { lazy, Suspense } from "react"
import { useManagerCouriersLiveTracking } from "@/shared/hooks"
import { Spinner } from "@/shared/ui"

const GoogleMap = lazy(() =>
  import("@/widgets/map").then((mod) => ({ default: mod.GoogleMap }))
)

export default function ManagerCouriersMapPage() {
  const { data: trackingRes } = useManagerCouriersLiveTracking()
  const rawCouriers = trackingRes?.data?.couriers || trackingRes?.data || (Array.isArray(trackingRes) ? trackingRes : null)
  const couriers = Array.isArray(rawCouriers) ? rawCouriers : []

  return (
    <div className="w-full h-[calc(100vh-125px)] min-h-145">
      <Suspense
        fallback={
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-white border border-slate-200 rounded-2xl">
            <Spinner size="lg" />
            <span className="text-xs font-medium text-slate-500">Xarita yuklanmoqda...</span>
          </div>
        }
      >
        <GoogleMap couriers={couriers} className="w-full h-full shadow-xs border border-slate-200" />
      </Suspense>
    </div>
  )
}
