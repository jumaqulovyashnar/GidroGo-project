import { GoogleMap } from "@/widgets"

export default function ManagerCouriersMapPage() {
  return (
    <div className="w-full h-[calc(100vh-125px)] min-h-[580px]">
      <GoogleMap className="w-full h-full shadow-xs border border-slate-200" />
    </div>
  )
}
