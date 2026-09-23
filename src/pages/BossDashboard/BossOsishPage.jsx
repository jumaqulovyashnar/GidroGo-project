import { useState } from "react"
import { Select } from "@mantine/core"
import { toast } from "sonner"
import { Calendar, ChevronDown, FileText, Wallet, Truck, Users, ShieldCheck, Clock, UserMinus, Sparkles } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, Button } from "@/shared/ui"
import { CustomerGrowthAreaChart } from "@/widgets"

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

  const handleExportPDF = () => {
    toast.success("PDF hisobot muvaffaqiyatli yuklab olindi!")
  }

  // 1. Top 4 ta O'sish KPI ko'rsatkichlari
  const kpiMetrics = [
    {
      id: "revenue_growth",
      title: "CHORAKLIK TUSHUM O'SISHI",
      value: "+18.4%",
      badge: "↑ 3.4%",
      subtext: "Rejadagi 15% dan yuqori sur'at",
      icon: Wallet,
    },
    {
      id: "orders_growth",
      title: "BUYURTMALAR SONI O'SISHI",
      value: "+12.2%",
      badge: "↗ barqaror",
      subtext: "Kunlik o'rtacha 146 ta buyurtma",
      icon: Truck,
    },
    {
      id: "new_customers",
      title: "YANGI MIJOZLAR OQIMI",
      value: "+7.9%",
      badge: "+98 yangi",
      subtext: "+98 ta yangi doimiy xonadon bu oy",
      icon: Users,
    },
    {
      id: "retention",
      title: "MIJOZLARNI SAQLAB QOLISH",
      value: "94.2%",
      badge: "LTV: 8.4 oy",
      subtext: "Sohadagi eng yuqori ko'rsatkich",
      icon: ShieldCheck,
    },
  ]

  // 2. Fermaning mijozlar segmentlari bo'yicha o'sishi
  const sectors = [
    {
      id: "01",
      number: "01",
      title: "Xonadonlar va Aholi (B2C)",
      sub: "Yetakchi iste'molchilar • 545 ta doimiy xonadon",
      growth: "+22.4%",
      percentage: 88,
      barColor: "bg-blue-600",
    },
    {
      id: "02",
      number: "02",
      title: "Ofislar va Biznes Markazlar (B2B)",
      sub: "Korporativ shartnomalar • 320 ta tashkilot",
      growth: "+16.8%",
      percentage: 70,
      barColor: "bg-sky-500",
    },
    {
      id: "03",
      number: "03",
      title: "Chakana Savdo va HoReCa",
      sub: "Do'konlar, kafelar va restoranlar • 210 ta nuqta",
      growth: "+11.5%",
      percentage: 54,
      barColor: "bg-blue-400",
    },
    {
      id: "04",
      number: "04",
      title: "Davlat va Ta'lim Muassasalari",
      sub: "Shifoxonalar, maktablar va idoralar • 73 ta muassasa",
      growth: "+8.2%",
      percentage: 38,
      barColor: "bg-slate-400",
    },
  ]

  // 3. Qayta buyurtma berish davriyligi ro'yxati
  const retentionIntervals = [
    {
      id: "3days",
      title: "Har 3 kunda buyurtma",
      sub: "Katta oilalar va ofislar (Doimiy)",
      percent: "44%",
      icon: Users,
      iconColor: "text-blue-600 bg-blue-50 border-blue-100",
      textColor: "text-blue-600",
    },
    {
      id: "weekly",
      title: "Har haftada 1 marta",
      sub: "O'rtacha 3-4 kishilik xonadonlar",
      percent: "38%",
      icon: Calendar,
      iconColor: "text-sky-600 bg-sky-50 border-sky-100",
      textColor: "text-sky-600",
    },
    {
      id: "biweekly",
      title: "2 haftada 1 marta",
      sub: "Yakka iste'molchilar yoki yozgi uylar",
      percent: "14%",
      icon: Clock,
      iconColor: "text-slate-600 bg-slate-50 border-slate-200",
      textColor: "text-slate-700",
    },
    {
      id: "churn",
      title: "Qaytmagan / Passiv mijozlar",
      sub: "Past yo'qotish darajasi (Sohada eng kam)",
      percent: "4%",
      icon: UserMinus,
      iconColor: "text-rose-600 bg-rose-50 border-rose-100",
      textColor: "text-rose-600",
    },
  ]

  return (
    <div className="space-y-6 pb-10">
      {/* 1. Sarlavha va Boshqaruv vositalari (2 ta Select + PDF hisobot) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Biznes O'sishi va Rivojlanish Dinamikasi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Oazis Water fermasining oylik va davriy o'sish ko'rsatkichlari.
          </p>
        </div>

        {/* O'ng tomon: 2 ta Select + PDF yuklash tugmasi */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
          {/* Chorak selektori */}
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

          {/* Rejim selektori */}
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

          {/* PDF Hisobot tugmasi */}
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
                <div className="flex items-center gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                    {item.value}
                  </span>
                  <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                    {item.badge}
                  </span>
                </div>
                <div className="mt-2 text-xs text-slate-500 font-medium">
                  {item.subtext}
                </div>

                {/* Ko'k chiziqli ko'rsatkich */}
                <div className="mt-3 h-1 w-12 bg-blue-600 rounded-full"></div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 3. O'sish Tendensiyasi Katta Grafigi (Area Chart) */}
      <CustomerGrowthAreaChart />

      {/* 4. Pastki Qism: Qarshi Shahri Hududlari + Qayta Buyurtma Davriyligi */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Chapdagi karta: Hududlar bo'yicha o'sish matritsasi (7 ustun) */}
        <div className="lg:col-span-7 flex">
          <Card className="border border-slate-200/90 bg-white shadow-xs rounded-2xl flex flex-col justify-between w-full">
            <CardHeader className="p-5 pb-3">
              <div>
                <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
                  Mijozlar Yo'nalishlari bo'yicha O'sish
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Fermaning asosiy iste'molchilar qatlami va korporativ shartnomalar dinamikasi.
                </p>
              </div>
            </CardHeader>

            <CardContent className="p-5 pt-1 space-y-3.5 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                {sectors.map((sec) => (
                  <div
                    key={sec.id}
                    className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/40 hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="size-8 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 font-extrabold text-xs flex items-center justify-center shrink-0">
                          {sec.number}
                        </span>
                        <div>
                          <div className="text-sm font-bold text-slate-900">
                            {sec.title}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            {sec.sub}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-sm font-extrabold text-blue-600">
                          {sec.growth}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 font-medium">
                          O'sish sur'ati
                        </div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="h-1.5 w-full bg-slate-200/70 rounded-full overflow-hidden mt-3">
                      <div
                        className={`h-full rounded-full ${sec.barColor}`}
                        style={{ width: `${sec.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pastki footer qatori */}
              <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  Fermaning jami faol mijozlar bazasi:{" "}
                  <strong className="text-slate-800 font-semibold">1,148 ta manzil</strong>
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* O'ngdagi karta: Qayta Buyurtma Berish Davriyligi (5 ustun) */}
        <div className="lg:col-span-5 flex">
          <Card className="border border-slate-200/90 bg-white shadow-xs rounded-2xl flex flex-col justify-between w-full">
            <CardHeader className="p-5 pb-3">
              <div>
                <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
                  Qayta Buyurtma Berish Davriyligi
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mijozlarning toza ichimlik suvi iste'mol qilish sikli va xonadonlar sadoqati darajasi.
                </p>
              </div>
            </CardHeader>

            <CardContent className="p-5 pt-1 flex flex-col justify-between flex-1 gap-5">
              {/* Buyurtma sadoqat taqsimoti bloki */}
              <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-slate-800">
                    Buyurtma Sadoqat Taqsimoti
                  </span>
                  <span className="font-semibold text-blue-600">
                    96% Faol / Qayta Buyurtma
                  </span>
                </div>

                {/* Segmented bar */}
                <div className="h-2.5 w-full rounded-full overflow-hidden flex gap-0.5 bg-slate-200">
                  <div className="h-full bg-blue-700 w-[44%]" title="Har 3 kunda: 44%"></div>
                  <div className="h-full bg-sky-500 w-[38%]" title="Haftada 1: 38%"></div>
                  <div className="h-full bg-cyan-400 w-[14%]" title="2 haftada 1: 14%"></div>
                  <div className="h-full bg-rose-500 w-[4%]" title="Passiv: 4%"></div>
                </div>

                {/* Mini dots legend */}
                <div className="grid grid-cols-2 gap-y-1 gap-x-2 mt-2.5 text-[11px] text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-blue-700"></span>
                    <span>Har 3 kunda: <strong className="text-slate-900">44%</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-sky-500"></span>
                    <span>Haftada 1: <strong className="text-slate-900">38%</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-cyan-400"></span>
                    <span>2 haftada 1: <strong className="text-slate-900">14%</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-rose-500"></span>
                    <span>Passiv/Churn: <strong className="text-slate-900">4%</strong></span>
                  </div>
                </div>
              </div>

              {/* Taqsimot tafsilotlari ro'yxati */}
              <div className="space-y-3">
                {retentionIntervals.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`size-7 rounded-lg flex items-center justify-center border shrink-0 ${item.iconColor}`}>
                          <Icon className="size-3.5 stroke-2" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-800 truncate">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                            {item.sub}
                          </div>
                        </div>
                      </div>

                      <div className={`font-bold text-sm shrink-0 pl-2 ${item.textColor}`}>
                        {item.percent}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Pastki LTV ko'rsatkichi */}
              <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  O'rtacha LTV qiymati:
                </span>
                <span className="font-extrabold text-slate-900 text-sm">
                  1,420,000 UZS <span className="text-xs font-medium text-slate-400">/ mijoz</span>
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default BossOsishPage
