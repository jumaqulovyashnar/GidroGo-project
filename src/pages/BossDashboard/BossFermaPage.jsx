import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Building2, Droplet, ShieldCheck, Gauge } from "lucide-react"

export function BossFermaPage() {
  const farmStats = [
    { title: "Zaxiradagi suv", value: "48 000 L", subtext: "To'liq sig'im: 60 000 L", icon: Droplet },
    { title: "Filtrlash sifati", value: "99.2%", subtext: "Standart talabiga mos", icon: ShieldCheck },
    { title: "Kunlik tozalash quvvati", value: "25 000 L/kun", subtext: "Filtrlar holati a'lo", icon: Gauge },
    { title: "Faol uskunalar", value: "6 / 6 dona", subtext: "100% barqaror ishlamoqda", icon: Building2 },
  ]

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Ferma Ma'lumotlari
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Oazis Water Qarshi filiali, suv tozalash texnologiyalari va zaxira nazorati
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {farmStats.map((item, index) => {
          const Icon = item.icon
          return (
            <Card
              key={index}
              className="border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs transition-all duration-200"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
                <CardTitle className="text-xs sm:text-sm font-medium text-slate-600">
                  {item.title}
                </CardTitle>
                <div className="size-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  <Icon className="size-4.5 text-blue-600" strokeWidth={1.75} />
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="text-2xl font-bold tracking-tight text-slate-900">
                  {item.value}
                </div>
                <p className="text-xs text-slate-500 mt-1">{item.subtext}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default BossFermaPage
