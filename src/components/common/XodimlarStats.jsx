import { Users, Truck, CheckCircle2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui"

export function XodimlarStats({ stats, isLoading }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {/* Karta 1: Jami shtat birligi */}
      <Card className="border border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-xs transition-all duration-200 rounded-2xl flex flex-col justify-between">
        <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0 p-5">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
            JAMI SHTAT BIRLIGI
          </CardTitle>
          <div className="size-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-blue-600">
            <Users className="size-5 stroke-2" />
          </div>
        </CardHeader>
        <CardContent className="p-5 pt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {isLoading ? "..." : stats.total}
            </span>
            <span className="text-sm font-semibold text-slate-500">nafar</span>
          </div>
          <div className="flex items-center justify-between text-sm text-slate-600 font-medium mt-3 pt-3 border-t border-slate-100">
            <span>{isLoading ? "—" : `${stats.managersCount} ta Menejer`}</span>
            <span>{isLoading ? "—" : `${stats.couriersCount} ta Dastavkachi`}</span>
          </div>
        </CardContent>
      </Card>

      {/* Karta 2: Faol smenada */}
      <Card className="border border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-xs transition-all duration-200 rounded-2xl flex flex-col justify-between">
        <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0 p-5">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
            FAOL SMENADA
          </CardTitle>
          <div className="size-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-blue-600">
            <Truck className="size-5 stroke-2" />
          </div>
        </CardHeader>
        <CardContent className="p-5 pt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {isLoading ? "..." : stats.activeCount}
            </span>
            <span className="text-sm font-semibold text-slate-500">nafar</span>
          </div>
          <div className="mt-3">
            <span className="inline-block text-xs font-bold px-3 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
              Yo'nalishda &amp; Navbatchi
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Karta 3: Bloklangan xodimlar */}
      <Card className="border border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-xs transition-all duration-200 rounded-2xl flex flex-col justify-between">
        <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0 p-5">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
            BLOKLANGAN XODIMLAR
          </CardTitle>
          <div className="size-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-blue-600">
            <CheckCircle2 className="size-5 stroke-2" />
          </div>
        </CardHeader>
        <CardContent className="p-5 pt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {isLoading ? "..." : (stats.blockedCount ?? 0)}
            </span>
            <span className="text-sm font-semibold text-slate-500">nafar</span>
          </div>
          <p className="text-sm text-slate-600 mt-3 leading-tight font-medium">
            {stats.blockedCount > 0
              ? `${stats.blockedCount} ta hisob faoliyati to'xtatilgan`
              : "Barcha xodimlar faol holatda"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
