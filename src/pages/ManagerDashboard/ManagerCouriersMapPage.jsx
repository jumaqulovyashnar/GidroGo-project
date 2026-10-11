import { GoogleMap } from "@/widgets"
import { useManagerCouriersLiveTracking } from "@/shared/hooks"

export default function ManagerCouriersMapPage() {
  const { data: trackingRes } = useManagerCouriersLiveTracking()
  const rawCouriers = trackingRes?.data?.couriers || trackingRes?.data || (Array.isArray(trackingRes) ? trackingRes : null)
  const couriers = Array.isArray(rawCouriers) ? rawCouriers : []

  return (
    <div className="w-full h-[calc(100vh-125px)] min-h-[580px]">
      <GoogleMap couriers={couriers} className="w-full h-full shadow-xs border border-slate-200" />
    </div>
  )
}
