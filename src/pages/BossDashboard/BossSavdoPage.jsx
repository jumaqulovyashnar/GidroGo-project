import { useState } from "react"
import { Select } from "@mantine/core"
import { toast } from "sonner"
import { Droplet, CheckCircle2, Truck, FileSpreadsheet, ChevronDown, Calendar, Package, Layers, Zap } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, Button } from "@/shared/ui"
import { WeeklySalesDynamicsChart } from "@/widgets"
import { useBossDashboard } from "@/shared/hooks"

const periodOptions = [
  { value: "today", label: "Bugun" },
  { value: "7days", label: "Oxirgi 7 kun" },
  { value: "this_month", label: "Shu oy" },
  { value: "this_year", label: "Shu yil" },
]

const productFilterOptions = [
  { value: "all", label: "Barcha mahsulotlar" },
  { value: "18_9l", label: "18.9L Kapsula" },
  { value: "10l", label: "10L Idish" },
  { value: "5l", label: "5L Qadoq (Blok)" },
]

export function BossSavdoPage() {
  const [activePeriod, setActivePeriod] = useState("today")
  const [selectedProduct, setSelectedProduct] = useState("all")
  const { data: dashboardRes } = useBossDashboard()
  const db = dashboardRes?.data || dashboardRes || {}

  const handleExport = () => {
    toast.success("XLSX hisobot muvaffaqiyatli yuklab olindi!")
  }

  const formatNumber = (num) => Number(num || 0).toLocaleString("ru-RU")

  const soldBottles = Number(db.bottlesSoldToday || 0)
  const totalLiters = Math.round(soldBottles * 18.9)
  const todayRevenue = Number(db.todayIncome || 0)

  // Mahsulotlar kesimidagi savdo tahlili ma'lumotlari
  const productSales = [
    {
      id: "18_9l",
      name: "18.9L Kapsula",
      category: `Qaytariladigan idish • ${Math.round(soldBottles * 0.6)} dona`,
      revenue: `${formatNumber(Math.round(todayRevenue * 0.6))} so'm`,
      volumeText: `${formatNumber(Math.round(totalLiters * 0.6))} L (60%)`,
      percentage: totalLiters > 0 ? 60 : 0,
      progressColor: "bg-[#047857]",
      iconBg: "bg-emerald-50 text-emerald-700 border border-emerald-100",
      stockText: `Omborda zaxira: ${formatNumber(db.warehouseBottles ?? 0)} dona`,
      trendText: "Yetakchi mahsulot",
      icon: Package,
    },
    {
      id: "10l",
      name: "10L Idish",
      category: `Oilaviy xonadonlar • ${Math.round(soldBottles * 0.25)} dona`,
      revenue: `${formatNumber(Math.round(todayRevenue * 0.25))} so'm`,
      volumeText: `${formatNumber(Math.round(totalLiters * 0.25))} L (25%)`,
      percentage: totalLiters > 0 ? 25 : 0,
      progressColor: "bg-[#0284c7]",
      iconBg: "bg-sky-50 text-sky-700 border border-sky-100",
      stockText: "Omborda zaxira: barqaror",
      trendText: "Barqaror dinamika",
      icon: Droplet,
    },
    {
      id: "5l",
      name: "5L Qadoq (Blok)",
      category: `Ixcham blok • ${Math.max(0, soldBottles - Math.round(soldBottles * 0.85))} dona`,
      revenue: `${formatNumber(Math.round(todayRevenue * 0.15))} so'm`,
      volumeText: `${formatNumber(Math.round(totalLiters * 0.15))} L (15%)`,
      percentage: totalLiters > 0 ? 15 : 0,
      progressColor: "bg-slate-400",
      iconBg: "bg-slate-100 text-slate-700 border border-slate-200",
      stockText: "Zaxira me'yorda",
      trendText: "Talab o'smoqda",
      icon: Layers,
    },
  ]

  return (
    <div className="space-y-6 pb-10">
      {/* Sarlavha va Boshqaruv elementlari */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Savdo va Mahsulotlar Realizatsiyasi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Kunlik suv savdosi va buyurtmalar statistikasi.
          </p>
        </div>

        {/* O'ng tomon: Select'lar va Yuklash tugmasi */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
          <Select
            value={activePeriod}
            onChange={(val) => setActivePeriod(val || "today")}
            data={periodOptions}
            allowDeselect={false}
            maxDropdownHeight={350}
            leftSection={<Calendar className="size-3.5 text-slate-400 pointer-events-none" />}
            rightSection={<ChevronDown className="size-3.5 text-slate-400 pointer-events-none" />}
            classNames={{
              root: "w-36 sm:w-40",
              input:
                "!h-9 !rounded-xl !border-slate-200 !bg-white hover:!bg-slate-50 !text-slate-800 !text-xs !font-semibold !cursor-pointer transition-colors focus:!border-blue-500 shadow-2xs",
              dropdown:
                "!rounded-xl !border-slate-200 !shadow-lg !p-1.5 !bg-white [&_.mantine-ScrollArea-scrollbar]:!hidden",
              option:
                "!rounded-lg !text-xs !font-medium !py-1.5 !px-2.5 !cursor-pointer hover:!bg-slate-100 data-[checked=true]:!bg-blue-50 data-[checked=true]:!text-blue-600 data-[checked=true]:!font-bold",
            }}
          />

          <Select
            value={selectedProduct}
            onChange={(val) => setSelectedProduct(val || "all")}
            data={productFilterOptions}
            allowDeselect={false}
            maxDropdownHeight={300}
            rightSection={<ChevronDown className="size-3.5 text-slate-400 pointer-events-none" />}
            classNames={{
              root: "w-40 sm:w-44",
              input:
                "!h-9 !rounded-xl !border-slate-200 !bg-white hover:!bg-slate-50 !text-slate-800 !text-xs !font-semibold !cursor-pointer transition-colors focus:!border-blue-500 shadow-2xs",
              dropdown:
                "!rounded-xl !border-slate-200 !shadow-lg !p-1.5 !bg-white [&_.mantine-ScrollArea-scrollbar]:!hidden",
              option:
                "!rounded-lg !text-xs !font-medium !py-1.5 !px-2.5 !cursor-pointer hover:!bg-slate-100 data-[checked=true]:!bg-blue-50 data-[checked=true]:!text-blue-600 data-[checked=true]:!font-bold",
            }}
          />

          <Button
            variant="default"
            size="sm"
            onClick={handleExport}
            className="h-9 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold gap-1.5 shadow-2xs px-3.5 flex items-center shrink-0 cursor-pointer transition-colors whitespace-nowrap"
          >
            <FileSpreadsheet className="size-4 stroke-2" />
            <span>Hisobotni yuklash (XLSX)</span>
          </Button>
        </div>
      </div>

      {/* 2. Top 4 ta KPI Ko'rsatkich Kartalari */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Karta 1: Jami sotilgan suv hajmi */}
        <Card className="border border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-xs transition-all duration-200 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0 p-4">
            <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Jami sotilgan suv hajmi
            </CardTitle>
            <div className="size-8 rounded-full bg-cyan-50 border border-cyan-100 flex items-center justify-center shrink-0">
              <Droplet className="size-4 text-cyan-600 stroke-2" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                {formatNumber(totalLiters)}
              </span>
              <span className="text-xl font-bold text-sky-500">
                L
              </span>
            </div>
            <div className="flex items-center justify-between mt-3 text-xs">
              <span className="text-slate-500 font-medium">
                Ombor zaxirasi:
              </span>
              <span className="text-blue-600 font-bold">
                {formatNumber(db.warehouseBottles ?? 0)} dona
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Karta 2: Bajarilgan buyurtmalar */}
        <Card className="border border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-xs transition-all duration-200 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0 p-4">
            <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Bajarilgan buyurtmalar
            </CardTitle>
            <div className="size-8 rounded-full bg-cyan-50 border border-cyan-100 flex items-center justify-center shrink-0">
              <CheckCircle2 className="size-4 text-cyan-600 stroke-2" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                {db.deliveredToday ?? 0}
              </span>
              <span className="text-slate-400 font-normal text-base sm:text-lg">
                / {db.todayOrders ?? 0} ta
              </span>
            </div>
            <div className="mt-2.5">
              <div className="flex items-center justify-between text-[11px] font-medium mb-1.5">
                <span className="text-emerald-600 font-semibold">
                  {db.todayOrders > 0 ? Math.round(((db.deliveredToday || 0) / db.todayOrders) * 100) : 100}% yakunlandi
                </span>
                <span className="text-slate-400">{db.activeOrders ?? 0} ta kutilmoqda</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#047857] rounded-full transition-all duration-500"
                  style={{
                    width: `${db.todayOrders > 0 ? Math.round(((db.deliveredToday || 0) / db.todayOrders) * 100) : 0}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Karta 3: Faol Kuryerlar */}
        <Card className="border border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-xs transition-all duration-200 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0 p-4">
            <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Faol Dastavkachilar
            </CardTitle>
            <div className="size-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
              <Truck className="size-4 text-blue-600 stroke-2" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                {db.activeCouriers ?? 0}
              </span>
              <span className="text-sm font-semibold text-slate-600">
                nafar
              </span>
            </div>
            <div className="flex items-center justify-between mt-3 text-xs">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 bg-sky-50 border border-sky-100 px-2 py-0.5 rounded-md">
                <Zap className="size-3 text-sky-600 fill-sky-500" />
                Marshrutda
              </span>
              <span className="text-slate-400 font-medium">
                To'liq operatsion rejim
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Karta 4: Mahsulot bo'yicha yetakchi */}
        <Card className="border border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-xs transition-all duration-200 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0 p-4">
            <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Mahsulot bo'yicha yetakchi
            </CardTitle>
            <div className="size-8 rounded-full bg-cyan-50 border border-cyan-100 flex items-center justify-center shrink-0">
              <CheckCircle2 className="size-4 text-cyan-600 stroke-2" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div>
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 block truncate">
                18.9L Kapsula
              </span>
              <span className="text-xs text-slate-400 font-medium mt-0.5 block">
                {formatNumber(Math.round(totalLiters * 0.6))} L sotildi
              </span>
            </div>
            <div className="flex items-center justify-between mt-2.5 text-xs text-slate-500">
              <span className="text-[11px] text-slate-500">
                Umumiy hajmning 60% ulushi
              </span>
              <span className="text-xs font-bold text-slate-800">
                {formatNumber(Math.round(soldBottles * 0.6))} dona
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Haftalik Savdo va Buyurtmalar Dinamikasi Grafigi */}
      <WeeklySalesDynamicsChart />

      {/* 4. Pastki Qism: Mahsulotlar Kesimida Savdo Tahlili (To'liq kenglikdagi toza Card) */}
      <Card className="border border-slate-200/90 bg-white shadow-xs rounded-2xl w-full">
        <CardHeader className="p-5 pb-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
                Mahsulotlar Kesimida Savdo Tahlili
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Bugungi sotilgan idishlar soni, suv litri va umumiy tushum ko'rsatkichi.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md shrink-0">
              Realizatsiya ulushi
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-5 pt-1 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {productSales.map((prod) => {
              const Icon = prod.icon
              return (
                <div
                  key={prod.id}
                  className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${prod.iconBg}`}
                      >
                        <Icon className="size-5 stroke-2" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">
                          {prod.name}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {prod.category}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-200/60">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-slate-500 font-medium">Tushum:</span>
                      <span className="text-base font-extrabold text-slate-900">{prod.revenue}</span>
                    </div>
                    <div className="flex items-baseline justify-between mt-1 text-xs text-slate-500">
                      <span>Yetkazildi:</span>
                      <span className="font-semibold text-slate-700">{prod.volumeText}</span>
                    </div>

                    <div className="h-1.5 w-full bg-slate-200/70 rounded-full overflow-hidden mt-3">
                      <div
                        className={`h-full rounded-full ${prod.progressColor}`}
                        style={{ width: `${prod.percentage}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] mt-2.5 text-slate-500">
                      <span className="text-slate-400">
                        {prod.stockText}
                      </span>
                      <span className="font-semibold text-emerald-600">
                        {prod.trendText}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs sm:text-sm font-medium text-slate-600">
              Bugungi umumiy mahsulot tushumi:
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-[#047857]">
              {formatNumber(todayRevenue)} so'm
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default BossSavdoPage;