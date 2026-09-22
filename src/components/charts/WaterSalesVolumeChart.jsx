import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const waterPackages = [
  {
    id: 1,
    name: "18.9L Kapsula (Standart)",
    volume: "10 300 L",
    percentage: 55.7,
    barColor: "bg-[#059669]", // To'q zumrad yashil
    trackColor: "bg-emerald-50",
  },
  {
    id: 2,
    name: "10L Idish (Oilaviy)",
    volume: "5 800 L",
    percentage: 31.3,
    barColor: "bg-[#2563EB]", // Ko'k
    trackColor: "bg-blue-50",
  },
  {
    id: 3,
    name: "5L Qadoq (Ixcham)",
    volume: "2 400 L",
    percentage: 13.0,
    barColor: "bg-[#475569]", // Slate qoramtir
    trackColor: "bg-slate-100",
  },
]

export function WaterSalesVolumeChart() {
  return (
    <Card className="border border-slate-200 bg-white shadow-xs flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-semibold text-slate-900">
            Suv savdosi (Idish turlari bo'yicha)
          </CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">
            Mahsulot tarqalish mutanosibligi
          </p>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            BUGUN
          </span>
          <span className="text-base font-bold text-blue-600">
            18 500 L
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
          <span>Asosiy talab:</span>
          <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
            18.9L Kapsula ulushi yuqori
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
