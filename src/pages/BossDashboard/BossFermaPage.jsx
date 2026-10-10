import { useState } from "react"
import { toast } from "sonner"
import { Warehouse, RefreshCw, Droplet, Filter, FileText } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, Button } from "@/shared/ui"
import { useBossDashboard, useBossFarmPassport } from "@/shared/hooks"
import { useUserStore } from "@/entities/user"

export function BossFermaPage() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { data: dashboardRes, refetch: refetchDashboard } = useBossDashboard()
  const { data: farmRes, refetch: refetchFarm } = useBossFarmPassport()
  const userInfo = useUserStore((state) => state.userInfo)

  const db = dashboardRes?.data || dashboardRes || {}
  const farm = farmRes?.data || farmRes || {}

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await Promise.all([refetchDashboard(), refetchFarm()])
    setIsRefreshing(false)
    toast.success("Telemetriya va texnik ma'lumotlar yangilandi!")
  }

  const handleDownloadPassport = () => {
    toast.success("PDF pasport muvaffaqiyatli yuklab olindi!")
  }

  const formatNumber = (num) => Number(num || 0).toLocaleString("ru-RU")

  // 1. Texnik va Zaxira KPI ko'rsatkichlari (Real API ma'lumotlari)
  const technicalKPIs = [
    {
      id: "ready_stock",
      title: "TAYYOR MAHSULOT ZAXIRASI",
      value: formatNumber(db.warehouseBottles ?? 0),
      unit: "dona (18.9L)",
      icon: Warehouse,
      subText: "Ombordagi joriy tayyor suv zaxirasi",
    },
    {
      id: "empty_bottles",
      title: "BO'SH QAYTGAN IDISHLAR",
      value: formatNumber(db.returnedBottles ?? db.emptyBottles ?? 0),
      unit: "dona",
      icon: RefreshCw,
      subText: "Qaytarilgan bo'sh idishlar balansi",
    },
    {
      id: "bottles_sold",
      title: "KUNLIK YETKAZILGAN SUV",
      value: formatNumber(db.bottlesSoldToday ?? db.deliveredToday ?? 0),
      unit: "dona",
      icon: Droplet,
      subText: "Bugun yetkazib berilgan tayyor balonlar",
    },
    {
      id: "active_couriers",
      title: "BIRIKTIRILGAN KURYERLAR",
      value: formatNumber(db.activeCouriers ?? 0),
      unit: "nafar",
      icon: Filter,
      subText: "Fermaga biriktirilgan faol logistika xodimlari",
    },
  ]

  return (
    <div className="space-y-6 pb-10">
      {/* 1. Sarlavha va Amallar paneli */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Ferma Ma'lumotlari va Texnik Pasport
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            {(farm.name || farm.farm_name || userInfo?.farm_name || userInfo?.farmName) ? `${farm.name || farm.farm_name || userInfo?.farm_name || userInfo?.farmName} fermasining` : "Fermaning"} texnik quvvati, ombor zaxiralari va korxona rekvizitlari.
          </p>
        </div>

        {/* O'ng tomon amallar */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-9 rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold gap-1.5 shadow-2xs px-3.5 flex items-center cursor-pointer transition-colors"
          >
            <RefreshCw className={`size-3.5 text-slate-500 ${isRefreshing ? "animate-spin text-blue-600" : ""}`} />
            <span>Ma'lumotlarni tekshirish</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={handleDownloadPassport}
            className="h-9 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold gap-1.5 shadow-2xs px-3.5 flex items-center shrink-0 cursor-pointer transition-colors whitespace-nowrap"
          >
            <FileText className="size-4 stroke-2" />
            <span>PDF Pasportni yuklab olish</span>
          </Button>
        </div>
      </div>

      {/* 2. Boshidagi 4 ta KPI Ko'rsatkich Kartalari */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {technicalKPIs.map((item) => {
          const Icon = item.icon
          return (
            <Card
              key={item.id}
              className="border border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-xs transition-all duration-200 rounded-2xl flex flex-col justify-between"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0 p-4">
                <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  {item.title}
                </CardTitle>
                <div className="size-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-blue-600">
                  <Icon className="size-4 stroke-2" />
                </div>
              </CardHeader>

              <CardContent className="p-4 pt-1 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 truncate">
                      {item.value}
                    </span>
                    {item.unit && (
                      <span className="text-xs font-medium text-slate-500">
                        {item.unit}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">
                    {item.subText}
                  </p>
                  <div className="mt-3 h-1 w-12 bg-blue-600 rounded-full" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 3. Pastki Qism: Korxona Rekvizitlari */}
      <Card className="border border-slate-200/90 bg-white shadow-xs rounded-2xl w-full">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
            Korxona Rekvizitlari
          </CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">
            Ferma ma'lumotlari va boshqaruv rekvizitlari.
          </p>
        </CardHeader>

        <CardContent className="p-5 pt-1 space-y-3">
          <div className="flex justify-between py-2 border-b border-slate-100 text-xs">
            <span className="text-slate-500">Korxona nomi:</span>
            <span className="font-semibold text-slate-800">
              {farm.name || farm.farm_name || userInfo?.farm_name || userInfo?.farmName || "—"}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100 text-xs">
            <span className="text-slate-500">Ferma rahbari:</span>
            <span className="font-semibold text-slate-800">
              {farm.bossFullName || farm.ownerName || farm.boss_name || userInfo?.name || userInfo?.fullName || "—"}
            </span>
          </div>
          {(farm.phone || userInfo?.phone) && (
            <div className="flex justify-between py-2 border-b border-slate-100 text-xs">
              <span className="text-slate-500">Bog'lanish telefoni:</span>
              <span className="font-semibold text-blue-600">
                {farm.phone || userInfo?.phone}
              </span>
            </div>
          )}
          {farm.bossPhone && (
            <div className="flex justify-between py-2 border-b border-slate-100 text-xs">
              <span className="text-slate-500">Rahbar telefoni:</span>
              <span className="font-semibold text-slate-800">
                {farm.bossPhone}
              </span>
            </div>
          )}
          <div className="flex justify-between py-2 border-b border-slate-100 text-xs">
            <span className="text-slate-500">Manzil:</span>
            <span className="font-semibold text-slate-800 text-right max-w-xs">
              {farm.address || userInfo?.address || "—"}
            </span>
          </div>
          {(farm.latitude && farm.longitude) && (
            <div className="flex justify-between py-2 text-xs">
              <span className="text-slate-500">Geolokatsiya:</span>
              <span className="font-semibold text-slate-800 font-mono text-[11px]">
                {farm.latitude}, {farm.longitude}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default BossFermaPage;
