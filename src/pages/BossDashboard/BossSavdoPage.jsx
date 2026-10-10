import { useState } from "react"
import { Select } from "@mantine/core"
import { toast } from "sonner"
import { Droplet, CheckCircle2, Truck, FileSpreadsheet, ChevronDown, Calendar, Package, Zap } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, Button } from "@/shared/ui"
import { WeeklySalesDynamicsChart } from "@/widgets"
import { useBossDashboard, useBossSalesSummary, useBossSalesProductsSummary } from "@/shared/hooks"

const periodOptions = [
  { value: "today", label: "Bugun" },
  { value: "7days", label: "Oxirgi 7 kun" },
  { value: "this_month", label: "Shu oy" },
  { value: "this_year", label: "Shu yil" },
]

export function BossSavdoPage() {
  const [activePeriod, setActivePeriod] = useState("today")
  const [selectedProduct, setSelectedProduct] = useState("all")
  
  // Real API: Sales summary va Products summary
  const { data: salesRes } = useBossSalesSummary({
    period: activePeriod,
    productId: selectedProduct !== "all" ? Number(selectedProduct) : undefined,
  })
  const { data: productsRes } = useBossSalesProductsSummary()
  const { data: dashboardRes } = useBossDashboard()

  const salesData = salesRes?.data || salesRes || {}
  const rawProducts = productsRes?.data || productsRes || []
  const products = Array.isArray(rawProducts) ? rawProducts : []
  const db = dashboardRes?.data || dashboardRes || {}

  const productFilterOptions = [
    { value: "all", label: "Barcha mahsulotlar" },
    ...products.map((p) => ({ value: String(p.productId || p.id), label: p.name || p.title })),
  ]

  const handleExport = () => {
    toast.success("XLSX hisobot muvaffaqiyatli yuklab olindi!")
  }

  const formatNumber = (num) => Number(num || 0).toLocaleString("ru-RU")

  const totalLiters = salesData.totalWaterVolumeLiters ?? Math.round(Number(db.bottlesSoldToday || 0) * 18.9)
  const soldBottles = salesData.totalBottlesSold ?? Number(db.bottlesSoldToday || 0)
  const todayRevenue = Number(db.todayIncome || 0)
  const completedOrders = salesData.completedOrders ?? db.deliveredToday ?? 0
  const totalOrders = salesData.totalOrders ?? db.todayOrders ?? 0
  const completionPercent = salesData.completionPercent ?? (totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 100)
  const pendingOrders = salesData.pendingOrders ?? db.activeOrders ?? 0
  const topProduct = salesData.topProduct || null

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
                Sotilgan balonlar:
              </span>
              <span className="text-blue-600 font-bold">
                {formatNumber(soldBottles)} dona
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
                {completedOrders}
              </span>
              <span className="text-slate-400 font-normal text-base sm:text-lg">
                / {totalOrders} ta
              </span>
            </div>
            <div className="mt-2.5">
              <div className="flex items-center justify-between text-[11px] font-medium mb-1.5">
                <span className="text-emerald-600 font-semibold">
                  {completionPercent}% yakunlandi
                </span>
                <span className="text-slate-400">{pendingOrders} ta kutilmoqda</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#047857] rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.max(0, completionPercent))}%`,
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
            {topProduct ? (
              <>
                <div>
                  <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 block truncate">
                    {topProduct.name || "Yetakchi Mahsulot"}
                  </span>
                  <span className="text-xs text-slate-400 font-medium mt-0.5 block">
                    {formatNumber(topProduct.soldLiters || 0)} L sotildi
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2.5 text-xs text-slate-500">
                  <span className="text-[11px] text-slate-500">Ulushi: {topProduct.sharePercent ?? 0}%</span>
                  <span className="text-xs font-bold text-slate-800">
                    {formatNumber(topProduct.soldCount || 0)} dona
                  </span>
                </div>
              </>
            ) : products.length > 0 ? (
              <>
                <div>
                  <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 block truncate">
                    {products[0]?.name || "Mahsulot"}
                  </span>
                  <span className="text-xs text-slate-400 font-medium mt-0.5 block">
                    {formatNumber(products[0]?.soldCount || 0)} dona sotildi
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2.5 text-xs text-slate-500">
                  <span className="text-[11px] text-slate-500">Ombor qoldig'i</span>
                  <span className="text-xs font-bold text-slate-800">
                    {formatNumber(products[0]?.stock || 0)} dona
                  </span>
                </div>
              </>
            ) : (
              <div>
                <span className="text-base sm:text-lg font-bold tracking-tight text-slate-700 block truncate">
                  Mahsulot topilmadi
                </span>
                <span className="text-xs text-slate-400 font-medium mt-1 block">
                  Katalog kutilmoqda
                </span>
                <div className="flex items-center justify-between mt-2.5 text-xs text-slate-400">
                  <span className="text-[11px]">Sotuv mavjud emas</span>
                  <span className="text-xs font-semibold">0 dona</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 3. Haftalik Savdo va Buyurtmalar Dinamikasi Grafigi */}
      <WeeklySalesDynamicsChart />

      {/* 4. Pastki Qism: Mahsulotlar Kesimida Savdo Tahlili */}
      <Card className="border border-slate-200/90 bg-white shadow-xs rounded-2xl w-full">
        <CardHeader className="p-5 pb-3">
          <div>
            <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
              Mahsulotlar Kesimida Savdo Tahlili
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Sotilgan idishlar soni, suv litri va umumiy tushum ko'rsatkichi.
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-5 pt-1 space-y-4">
          {products.length === 0 ? (
            /* Bo'sh holat (Empty State) - Mahsulotlar topilmadi */
            <div className="py-12 px-4 text-center flex flex-col items-center justify-center">
              <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <Package className="size-6 stroke-[1.5]" />
              </div>
              <p className="text-sm font-bold text-slate-800">
                Mahsulotlar topilmadi
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Hozircha tizimga mahsulotlar kiritilmagan.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {products.map((prod) => (
                <div
                  key={prod.productId || prod.id}
                  className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
                      <Package className="size-5 stroke-2" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        {prod.name}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Omborda: {formatNumber(prod.stock ?? 0)} dona
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Sotilgan: <strong className="text-slate-800">{formatNumber(prod.soldCount ?? 0)}</strong></span>
                    <span className="font-bold text-blue-600">{formatNumber(prod.revenue ?? 0)} so'm</span>
                  </div>
                </div>
              ))}
            </div>
          )}

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