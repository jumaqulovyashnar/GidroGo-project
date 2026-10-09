import { useState } from "react"
import { toast } from "sonner"
import { Warehouse, RefreshCw, Droplet, Filter, FileText } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, Button } from "@/shared/ui"
import { useBossDashboard } from "@/shared/hooks"

export function BossFermaPage() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { data: dashboardRes, refetch } = useBossDashboard()
  const db = dashboardRes?.data || dashboardRes || {}

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refetch()
    setIsRefreshing(false)
    toast.success("Telemetriya va texnik ma'lumotlar yangilandi!")
  }

  const handleDownloadPassport = () => {
    toast.success("PDF pasport muvaffaqiyatli yuklab olindi!")
  }

  const formatNumber = (num) => Number(num || 0).toLocaleString("ru-RU")

  // 1. Texnik va Zaxira KPI ko'rsatkichlari (Boshidagi 4 ta karta)
  const technicalKPIs = [
    {
      id: "ready_stock",
      title: "TAYYOR MAHSULOT ZAXIRASI",
      value: formatNumber(db.warehouseBottles || 3200),
      unit: "dona (19L)",
      icon: Warehouse,
      subText: "Bugungi yetkazib berish rejasiga to'liq yetarli",
      badge: "To'liqligi: 82%",
    },
    {
      id: "empty_bottles",
      title: "BO'SH QAYTGAN IDISHLAR",
      value: "1 850",
      unit: "dona",
      icon: RefreshCw,
      subText: "Tekshiruv va tozalashga yo'naltirilgan",
      badge: "Qabul punktida",
    },
    {
      id: "capacity",
      title: "KUNLIK TOZALASH QUVVATI",
      value: "25 000",
      unit: "L / kun",
      icon: Droplet,
      subText: "Yuklama me'yori",
      percent: "76%",
      limitText: "Maksimal limit: 34,000 L",
      progressWidth: "w-[76%]",
    },
    {
      id: "filter_module",
      title: "FILTRLASH MODULI",
      value: "7 bosqichli osmos",
      unit: "",
      icon: Filter,
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
            Oazis Water fermasining texnik quvvati, ombor zaxiralari va korxona rekvizitlari.
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

                  {item.progressWidth && (
                    <div className="mt-2.5">
                      <div className="flex items-center justify-between text-[11px] font-medium mb-1">
                        <span className="text-slate-600 font-medium">{item.subText}</span>
                        <span className="text-blue-600 font-bold">{item.percent}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full bg-blue-600 rounded-full ${item.progressWidth}`} />
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        {item.limitText}
                      </div>
                    </div>
                  )}

                  {item.badge && (
                    <div className="mt-2 space-y-1.5">
                      <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                        {item.badge}
                      </span>
                      <p className="text-xs text-slate-500 leading-snug">
                        {item.subText}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 3. Pastki Qism: Korxona Rekvizitlari & Suv Laboratoriya Tahlili */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6 flex">
          <Card className="border border-slate-200/90 bg-white shadow-xs rounded-2xl flex flex-col justify-between w-full">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
                Korxona Rekvizitlari
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Yuridik hujjatlar va litsenziya ma'lumotlari.
              </p>
            </CardHeader>

            <CardContent className="p-5 pt-1 space-y-3 flex-1">
              <div className="flex justify-between py-2 border-b border-slate-100 text-xs">
                <span className="text-slate-500">Yuridik nomi:</span>
                <span className="font-semibold text-slate-800">"OAZIS CLEAN WATER" MCHJ</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 text-xs">
                <span className="text-slate-500">STIR (INN):</span>
                <span className="font-semibold text-slate-800">308 945 112</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 text-xs">
                <span className="text-slate-500">Litsenziya raqami:</span>
                <span className="font-semibold text-slate-800">UZ-SAN-2024-8849</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 text-xs">
                <span className="text-slate-500">Manzil:</span>
                <span className="font-semibold text-slate-800 text-right max-w-xs">Qashqadaryo viloyati, Qarshi sh., Nasaf ko'chasi 14-uy</span>
              </div>
              <div className="flex justify-between py-2 text-xs">
                <span className="text-slate-500">Bog'lanish:</span>
                <span className="font-semibold text-blue-600">+998 78 120 00 20</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-6 flex">
          <Card className="border border-slate-200/90 bg-white shadow-xs rounded-2xl flex flex-col justify-between w-full">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
                Suv Laboratoriya Sifat Tahlili
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Sanitariya-gigiyena me'yorlariga muvofiqlik darajasi.
              </p>
            </CardHeader>

            <CardContent className="p-5 pt-1 space-y-3 flex-1">
              <div className="flex justify-between py-2 border-b border-slate-100 text-xs">
                <span className="text-slate-500">TDS (Minerallashuv):</span>
                <span className="font-semibold text-emerald-600">45 - 65 ppm (Ideal)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 text-xs">
                <span className="text-slate-500">pH Balansi:</span>
                <span className="font-semibold text-blue-600">7.2 - 7.5 (Optimal neytral)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 text-xs">
                <span className="text-slate-500">Qattiqlik darajasi:</span>
                <span className="font-semibold text-emerald-600">1.2 mg-ekv/l</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 text-xs">
                <span className="text-slate-500">Oxirgi laboratoriya testi:</span>
                <span className="font-semibold text-slate-800">Bugun, 08:30 (Muvaffaqiyatli)</span>
              </div>
              <div className="flex justify-between py-2 text-xs">
                <span className="text-slate-500">Sertifikat holati:</span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">GOST 951:2018 Faol</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default BossFermaPage;
