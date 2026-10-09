import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui"
import { useBossDashboard } from "@/shared/hooks"

export function WaterSalesVolumeChart() {
  const { data: dashboardRes } = useBossDashboard()
  const db = dashboardRes?.data || dashboardRes || {}

  const soldBottles = Number(db.bottlesSoldToday ?? 0)
  const totalLiters = Math.round(soldBottles * 18.9)

  const vol18_9 = Math.round(totalLiters * 0.6)
  const vol10 = Math.round(totalLiters * 0.25)
  const vol5 = totalLiters - vol18_9 - vol10

  const waterPackages = [
    {
      id: 1,
      name: "18.9L Kapsula (Standart)",
      volume: `${vol18_9.toLocaleString("ru-RU")} L`,
      percentage: totalLiters > 0 ? Math.round((vol18_9 / totalLiters) * 100) : 0,
      barColor: "bg-[#059669]",
      trackColor: "bg-emerald-50",
    },
    {
      id: 2,
      name: "10L Idish (Oilaviy)",
      volume: `${vol10.toLocaleString("ru-RU")} L`,
      percentage: totalLiters > 0 ? Math.round((vol10 / totalLiters) * 100) : 0,
      barColor: "bg-[#2563EB]",
      trackColor: "bg-blue-50",
    },
    {
      id: 3,
      name: "5L Qadoq (Ixcham)",
      volume: `${vol5 > 0 ? vol5.toLocaleString("ru-RU") : 0} L`,
      percentage: totalLiters > 0 ? Math.round((vol5 / totalLiters) * 100) : 0,
      barColor: "bg-[#475569]",
      trackColor: "bg-slate-100",
    },
  ]

  return (
    <Card className="border border-slate-200 bg-white shadow-xs flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-semibold text-slate-900">
            Suv savdosi (Idish turlari bo'yicha)
          </CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">
            Bugungi yetkazilgan suv taqsimoti
          </p>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            BUGUN
          </span>
          <span className="text-base font-bold text-blue-600">
            {totalLiters.toLocaleString("ru-RU")} L
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-3 space-y-4">
        {waterPackages.map((item) => (
          <div key={item.id} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-slate-700 font-semibold">{item.name}</span>
              <span className="text-slate-600">
                {item.volume}{" "}
                <span className="text-slate-400 font-normal">
                  ({item.percentage}%)
                </span>
              </span>
            </div>
            {/* Progress bar */}
            <div className={`h-2.5 w-full rounded-full overflow-hidden ${item.trackColor}`}>
              <div
                className={`h-full rounded-full transition-all duration-500 ${item.barColor}`}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-4">
          <span>Jami sotilgan balon:</span>
          <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
            {soldBottles.toLocaleString("ru-RU")} dona
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

export default WaterSalesVolumeChart
