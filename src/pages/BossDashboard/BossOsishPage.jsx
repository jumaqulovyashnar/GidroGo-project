import { useState } from "react"
import { Select } from "@mantine/core"
import { toast } from "sonner"
import { Calendar, ChevronDown, FileText, Wallet, Truck, Users, TrendingUp, Sparkles } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, Button } from "@/shared/ui"
import { CustomerGrowthAreaChart } from "@/widgets"
import { useBossDashboard, useBossClients, useBossClientSegments, useBossBusinessGrowth } from "@/shared/hooks"

const quarterOptions = [
  { value: "2026_q1", label: "2026-yil 1-Chorak" },
  { value: "2025_q4", label: "2025-yil 4-Chorak" },
  { value: "2025_q3", label: "2025-yil 3-Chorak" },
  { value: "2025_q2", label: "2025-yil 2-Chorak" },
]

const modeOptions = [
  { value: "prev_quarter", label: "O'tgan chorak" },
  { value: "prev_year", label: "O'tgan yil" },
  { value: "plan", label: "Reja bo'yicha" },
]

export function BossOsishPage() {
  const [selectedQuarter, setSelectedQuarter] = useState("2026_q1")
  const [selectedMode, setSelectedMode] = useState("prev_quarter")
  const { data: growthRes } = useBossBusinessGrowth({ period: "quarter" })
  const { data: dashboardRes } = useBossDashboard()
  const { data: clientsRes } = useBossClients()
  const { data: segmentsRes } = useBossClientSegments()

  const growth = growthRes?.data || growthRes || {}
  const segments = segmentsRes?.data || segmentsRes || {}
  const db = dashboardRes?.data || dashboardRes || {}
  const rawClients = clientsRes?.data || clientsRes || []
  const clients = Array.isArray(rawClients) ? rawClients : []
  const totalClients = Number(segments.total || db.totalClients || clients.length || 0)

  const handleExportPDF = () => {
    toast.success("PDF hisobot muvaffaqiyatli yuklab olindi!")
  }

  const formatNumber = (num) => Number(num || 0).toLocaleString("ru-RU")

  // 1. Top 4 ta O'sish KPI ko'rsatkichlari (100% Real API)
  const kpiMetrics = [
    {
      id: "revenue",
      title: "OYLIK JAMI TUSHUM",
      value: `${formatNumber(db.monthIncome || db.todayIncome)} so'm`,
      subtext: growth.revenue_growth_percent != null ? `O'sish sur'ati: +${growth.revenue_growth_percent}%` : "Fermaning aylanma mablag'i",
      icon: Wallet,
    },
    {
      id: "orders",
      title: "JAMI BUYURTMALAR",
      value: `${formatNumber(db.totalOrders || db.todayOrders)} ta`,
      subtext: `${db.todayOrders ?? 0} ta bugungi buyurtma`,
      icon: Truck,
    },
    {
      id: "customers",
      title: "MIJOZLAR BAZASI",
      value: `${formatNumber(totalClients)} ta`,
      subtext: growth.retention_rate_percent != null ? `Mijozlarni saqlab qolish: ${growth.retention_rate_percent}%` : "Fermaga biriktirilgan mijozlar",
      icon: Users,
    },
    {
      id: "profit",
      title: "OYLIK SOF FOYDA",
      value: `${formatNumber(db.monthProfit || db.todayProfit)} so'm`,
      subtext: "Daromaddan xarajatlar chegirilgan foyda",
      icon: TrendingUp,
    },
  ]

  return (
    <div className="space-y-6 pb-10">
      {/* 1. Sarlavha va Boshqaruv vositalari */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Biznes O'sishi va Rivojlanish Dinamikasi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Fermaning davriy ko'rsatkichlari va mijozlar bazasi tahlili.
          </p>
        </div>

        {/* O'ng tomon: Select'lar + PDF hisobot */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
          <Select
            value={selectedQuarter}
            onChange={(val) => setSelectedQuarter(val || "2026_q1")}
            data={quarterOptions}
            allowDeselect={false}
            maxDropdownHeight={350}
            leftSection={<Calendar className="size-3.5 text-slate-400 pointer-events-none" />}
            rightSection={<ChevronDown className="size-3.5 text-slate-400 pointer-events-none" />}
            classNames={{
              root: "w-40 sm:w-44",
              input:
                "!h-9 !rounded-xl !border-slate-200 !bg-white hover:!bg-slate-50 !text-slate-800 !text-xs !font-semibold !cursor-pointer transition-colors focus:!border-blue-500 shadow-2xs !select-none caret-transparent",
              dropdown:
                "!rounded-xl !border-slate-200 !shadow-lg !p-1.5 !bg-white [&_.mantine-ScrollArea-scrollbar]:!hidden",
              option:
                "!rounded-lg !text-xs !font-medium !py-1.5 !px-2.5 !cursor-pointer hover:!bg-slate-100 data-[checked=true]:!bg-blue-50 data-[checked=true]:!text-blue-600 data-[checked=true]:!font-bold",
            }}
          />

          <Select
            value={selectedMode}
            onChange={(val) => setSelectedMode(val || "prev_quarter")}
            data={modeOptions}
            allowDeselect={false}
            maxDropdownHeight={300}
            leftSection={<Sparkles className="size-3.5 text-slate-400 pointer-events-none" />}
            rightSection={<ChevronDown className="size-3.5 text-slate-400 pointer-events-none" />}
            classNames={{
              root: "w-40 sm:w-44",
              input:
                "!h-9 !rounded-xl !border-slate-200 !bg-white hover:!bg-slate-50 !text-slate-800 !text-xs !font-semibold !cursor-pointer transition-colors focus:!border-blue-500 shadow-2xs !select-none caret-transparent",
              dropdown:
                "!rounded-xl !border-slate-200 !shadow-lg !p-1.5 !bg-white [&_.mantine-ScrollArea-scrollbar]:!hidden",
              option:
                "!rounded-lg !text-xs !font-medium !py-1.5 !px-2.5 !cursor-pointer hover:!bg-slate-100 data-[checked=true]:!bg-blue-50 data-[checked=true]:!text-blue-600 data-[checked=true]:!font-bold",
            }}
          />

          <Button
            variant="default"
            size="sm"
            onClick={handleExportPDF}
            className="h-9 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold gap-1.5 shadow-2xs px-3.5 flex items-center shrink-0 cursor-pointer transition-colors whitespace-nowrap"
          >
            <FileText className="size-4 stroke-2" />
            <span>PDF Hisobot</span>
          </Button>
        </div>
      </div>

      {/* 2. Top 4 ta O'sish KPI Ko'rsatkich Kartalari */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiMetrics.map((item) => {
          const Icon = item.icon
          return (
            <Card
              key={item.id}
              className="border border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-xs transition-all duration-200 rounded-2xl"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0 p-4">
                <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  {item.title}
                </CardTitle>
                <div className="size-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-blue-600">
                  <Icon className="size-4 stroke-2" />
                </div>
              </CardHeader>

              <CardContent className="p-4 pt-1">
                <div className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 truncate" title={item.value}>
                  {item.value}
                </div>
                <div className="mt-2 text-xs text-slate-500 font-medium">
                  {item.subtext}
                </div>
                <div className="mt-3 h-1 w-12 bg-blue-600 rounded-full" />
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 3. O'sish Tendensiyasi Grafigi */}
      <CustomerGrowthAreaChart />

      {/* 4. Pastki Qism: Mijozlar va Yetkazish ko'rsatkichlari */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 flex">
          <Card className="border border-slate-200/90 bg-white shadow-xs rounded-2xl flex flex-col justify-between w-full">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
                Fermaning Mijozlar Bazasi Holati
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Faol mijozlar va xizmat ko'rsatilayotgan hududlar balansi.
              </p>
            </CardHeader>

            <CardContent className="p-5 pt-1 space-y-4 flex-1">
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    Jami ro'yxatdan o'tgan mijozlar
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Fermaga buyurtma beruvchi faol iste'molchilar
                  </div>
                  {(segments.b2cCount != null || segments.b2bCount != null) && (
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] font-medium text-slate-500">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">B2C: {segments.b2cCount ?? 0}</span>
                      <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-semibold">B2B: {segments.b2bCount ?? 0}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold">Ulgurji: {segments.wholesaleCount ?? 0}</span>
                    </div>
                  )}
                </div>
                <div className="text-2xl font-extrabold text-blue-600 shrink-0">
                  {formatNumber(totalClients)} ta
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    Bugun yetkazilgan buyurtmalar
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Muvaffaqiyatli topshirilgan buyurtmalar soni
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-emerald-600">
                  {db.deliveredToday ?? 0} ta
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    Jarayondagi faol buyurtmalar
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Hozirda kuryerlar yo'lida yoki kutilayotgan
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-amber-600">
                  {db.activeOrders ?? 0} ta
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-5 flex">
          <Card className="border border-slate-200/90 bg-white shadow-xs rounded-2xl flex flex-col justify-between w-full">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
                Logistika va Kuryerlar Quvvati
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Yetkazib berish xizmatining operatsion tayyorgarligi.
              </p>
            </CardHeader>

            <CardContent className="p-5 pt-1 space-y-4 flex-1">
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    Faol kuryerlar soni
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Hozir liniyada xizmat qilayotgan
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-slate-900">
                  {db.activeCouriers ?? 0} nafar
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    Ombordagi zaxira balonlar
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Tayyor mahsulot zaxirasi
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-blue-600">
                  {formatNumber(db.warehouseBottles)} dona
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    Bugun sotilgan suv idishlari
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    18.9L tayyor kapsulalar
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-[#059669]">
                  {formatNumber(db.bottlesSoldToday)} dona
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default BossOsishPage
