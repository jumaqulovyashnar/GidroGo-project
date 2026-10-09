import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui"
import { Users } from "lucide-react"
import { useBossDashboard } from "@/shared/hooks"

export function CustomerSegmentDonutChart() {
  const { data: dashboardRes } = useBossDashboard()
  const db = dashboardRes?.data || dashboardRes || {}
  const totalClients = Number(db.totalClients || 0)

  return (
    <Card className="border border-slate-200/90 bg-white shadow-xs rounded-2xl flex flex-col justify-between h-full w-full">
      <CardHeader className="p-5 pb-3">
        <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
          Mijozlar Boshqaruvi
        </CardTitle>
        <p className="text-xs text-slate-500 mt-0.5">
          Fermaga biriktirilgan mijozlar hisobi.
        </p>
      </CardHeader>

      <CardContent className="p-5 pt-1 flex flex-col items-center justify-center flex-1 py-8">
        <div className="size-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-3">
          <Users className="size-6" />
        </div>
        <div className="text-2xl font-extrabold text-slate-900">
          {totalClients.toLocaleString("ru-RU")} ta
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Jami ro'yxatdan o'tgan mijozlar
        </p>
      </CardContent>
    </Card>
  )
}

export default CustomerSegmentDonutChart
