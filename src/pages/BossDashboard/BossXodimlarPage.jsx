import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui"
import { Truck, Users } from "lucide-react"
import { CouriersPerformanceCard } from "@/widgets"

export function BossXodimlarPage() {
  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Xodimlar va Dastavkachilar
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Haydovchilar faoliyati, kunlik samaradorlik va xizmat ko'rsatish sifati
        </p>
      </div>

      {/* 2 ta ko'rsatkich */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">
              Faol Dastavkachilar
            </CardTitle>
            <div className="size-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
              <Truck className="size-4.5 text-blue-600" strokeWidth={1.75} />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-3xl font-bold tracking-tight text-slate-900">
              8 / 10 <span className="text-sm font-medium text-slate-500">faol</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              8 tasi yo'lda • 2 tasi navbatda
            </p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">
              Biriktirilgan Mijozlar
            </CardTitle>
            <div className="size-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
              <Users className="size-4.5 text-blue-600" strokeWidth={1.75} />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-3xl font-bold tracking-tight text-slate-900">
              1 248 <span className="text-sm font-medium text-slate-500">ta</span>
            </div>
            <p className="text-xs text-emerald-600 font-medium mt-2">
              +7.4% shu oy yangi mijozlar
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Dastavkachilar jadvali */}
      <CouriersPerformanceCard />
    </div>
  )
}

export default BossXodimlarPage
