import { Users, Truck, CheckCircle2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui"

export function XodimlarStats({ stats, isLoading }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Karta 1: Jami shtat birligi */}
      <Card className="border border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-xs transition-all duration-200 rounded-2xl flex flex-col justify-between">
        <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0 p-4">
          <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            JAMI SHTAT BIRLIGI
          </CardTitle>
          <div className="size-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-blue-600">
            <Users className="size-4 stroke-2" />
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {isLoading ? "..." : stats.total}
            </span>
            <span className="text-xs font-medium text-slate-500">nafar</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-2.5 pt-2 border-t border-slate-100">
            <span>{isLoading ? "—" : `${stats.managersCount} ta Manager`}</span>
            <span>{isLoading ? "—" : `${stats.couriersCount} ta Dastavkachi`}</span>
          </div>
        </CardContent>
      </Card>

      {/* Karta 2: Faol smenada */}
      <Card className="border border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-xs transition-all duration-200 rounded-2xl flex flex-col justify-between">
        <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0 p-4">
          <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            FAOL SMENADA
          </CardTitle>
          <div className="size-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-blue-600">
            <Truck className="size-4 stroke-2" />
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {isLoading ? "..." : stats.activeCount}
            </span>
            <span className="text-xs font-medium text-slate-500">nafar</span>
          </div>
          <div className="mt-2.5">
            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
              Yo'nalishda &amp; Navbatchi
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Karta 3: Bloklangan xodimlar */}
      <Card className="border border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-xs transition-all duration-200 rounded-2xl flex flex-col justify-between">
        <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0 p-4">
          <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            BLOKLANGAN XODIMLAR
          </CardTitle>
          <div className="size-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 text-slate-500">
            <CheckCircle2 className="size-4 stroke-2" />
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {isLoading ? "..." : (stats.blockedCount ?? 0)}
            </span>
            <span className="text-xs font-medium text-slate-500">nafar</span>
          </div>
          <p className="text-xs text-slate-500 mt-2.5 leading-tight font-medium">
            {stats.blockedCount > 0
              ? `${stats.blockedCount} ta hisob faoliyati to'xtatilgan`
              : "Barcha xodimlar faol holatda"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
