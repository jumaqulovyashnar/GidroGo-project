import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ArrowUp, TrendingUp } from "lucide-react"

export function BusinessMetricsSummary() {
  // 4 ta card ham bir xil, kulrang bo'lmagan toza premium uslubda
  const metrics = [
    {
      id: "tushum",
      label: "TUSHUM",
      value: "+18.4%",
      subtext: "Yuqori sur'at",
      icon: ArrowUp,
    },
    {
      id: "buyurtmalar",
      label: "BUYURTMALAR",
      value: "+12.2%",
      subtext: "Barqaror",
      icon: ArrowUp,
    },
    {
      id: "mijozlar",
      label: "MIJOZLAR",
      value: "+7.9%",
      subtext: "Yangi oqim",
      icon: ArrowUp,
    },
    {
      id: "foyda",
      label: "FOYDA",
      value: "+21.3%",
      subtext: "Optimal marja",
      icon: TrendingUp,
    },
  ]

  return (
    <Card className="border border-slate-200 bg-white shadow-xs rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-6">
        <div>
          <CardTitle className="text-lg font-bold text-slate-900 tracking-tight">
            Biznes o'sishi
          </CardTitle>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Shu oy ko'rsatkichlari o'tgan oy bilan taqqoslanganda
          </p>
        </div>

        {/* Oylik hisobot badge */}
        <span className="text-xs font-medium text-slate-600 bg-slate-100 px-3.5 py-1.5 rounded-full shrink-0">
          Oylik hisobot
        </span>
      </CardHeader>

      <CardContent className="px-6 pb-6 pt-4">
        {/* 4 ta bir xil premium ko'rinishdagi o'sish kartasi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-[#F8FAFF] border border-blue-100/80 hover:border-blue-200 hover:bg-[#F3F7FF] shadow-2xs flex flex-col justify-between transition-all duration-200 min-h-32.5"
              >
                <span className="text-xs font-semibold tracking-wider uppercase text-slate-500">
                  {item.label}
                </span>

                <div className="text-2xl sm:text-[26px] font-bold tracking-tight my-2.5 text-slate-900">
                  {item.value}
                </div>

                <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                  <Icon className="size-3.5" strokeWidth={2.5} />
                  <span>{item.subtext}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Pastki xulosa matni */}
        <p className="text-xs sm:text-sm text-slate-500 mt-5 leading-relaxed font-normal">
          Strategik ko'rsatkichlar rejadagi 15% o'rtacha o'sish marjasidan yuqori natija bermoqda.
        </p>
      </CardContent>
    </Card>
  )
}
