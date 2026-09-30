import React, { useMemo } from "react"
import { useParams, Link } from "react-router-dom"
import { Pencil, MapPin, Calendar, Layers, CheckCircle2, DollarSign, TrendingUp, Activity } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, Switch } from "@/shared/ui"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/shared/ui/breadcrumb"
import Chart from "react-apexcharts"

export function FermaDetailPage() {
  const { id } = useParams()

  // URL dagi ID orqali mos fermani topish
  const farm = useMemo(() => {
    return MOCK_FARMS.find((f) => f.id === id) || MOCK_FARMS[0]
  }, [id])

  // Ferma holati (Faol / Nofaol)
  const [status, setStatus] = React.useState(farm?.status || "active")
  const [prevFarmId, setPrevFarmId] = React.useState(farm?.id)

  if (farm?.id !== prevFarmId) {
    setPrevFarmId(farm?.id)
    setStatus(farm?.status || "active")
  }

  // Analitika grafigi (ApexCharts)
  const chartOptions = {
    chart: {
      type: "area",
      height: 300,
      toolbar: { show: false },
      fontFamily: "'Google Sans', 'Plus Jakarta Sans', sans-serif",
    },
    colors: ["#2563eb", "#10b981"],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2.5 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100],
      },
    },
    xaxis: {
      categories: ["Dush", "Sesh", "Chor", "Pay", "Jum", "Shan", "Yak"],
      labels: {
        style: { colors: "#64748b", fontFamily: "'Google Sans', sans-serif" },
      },
    },
    yaxis: {
      labels: {
        style: { colors: "#64748b", fontFamily: "'Google Sans', sans-serif" },
      },
    },
    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 4,
    },
    tooltip: {
      theme: "light",
    },
  }

  const chartSeries = [
    {
      name: "Buyurtmalar",
      data: [31, 40, 28, 51, 42, 85, 77],
    },
    {
      name: "Daromad ($)",
      data: [11, 32, 45, 32, 34, 52, 41],
    },
  ]


  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* 0. Breadcrumb qismi */}
      <div>
        <Breadcrumb className="mb-2">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                className="capitalize decoration-blue-500"
                render={<Link to="/super-admin" />}
              >
                bosh sahifa
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                className="capitalize decoration-blue-500"
                render={<Link to="/super-admin/fermalar" />}
              >
                fermalar
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="capitalize text-blue-600 font-medium">
                {farm.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* 1. Header Blok: Sarlavha va Tahrirlash Tugmasi */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            {farm.name}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Ferma to'liq profili, faoliyati va ko'rsatkichlari.
          </p>
        </div>

        {/* Action Button: Ko'k rangli Tahrirlash tugmasi */}
        <div className="flex items-center">
          <button
            type="button"
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-[10px] bg-[#2563EB] hover:bg-blue-700 text-white font-medium text-sm transition-colors cursor-pointer shrink-0 shadow-xs"
          >
            <Pencil className="size-4 text-white" />
            <span>Tahrirlash</span>
          </button>
        </div>
      </div>

      {/* 2. Asosiy Tafsilotlar: 1 Tomonda Katta Ferma Rasmi + Qolgan Tomonda Ma'lumotlar */}
      <Card className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Chap tomon: Yagona Katta Ferma Rasmi */}
          <div className="lg:col-span-5">
            <div className="w-full h-80 sm:h-96 lg:h-95 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-xs relative">
              <img
                src={farm.logoUrl || farm.bannerUrl}
                alt={farm.name}
                className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
              />
            </div>
          </div>

          {/* O'ng tomon: Barcha Ma'lumotlar va Tafsilotlar */}
          <div className="lg:col-span-7 space-y-6">
            {/* Sarlavha & Manzil */}
            <div className="space-y-2 pb-5 border-b border-slate-100">
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                Gidroponika Majmuasi
              </span>

              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                {farm.name}
              </h2>
              <div className="flex items-center gap-2 text-sm text-slate-600 pt-1">
                <MapPin className="size-4 text-blue-600 shrink-0" />
                <span className="font-medium">{farm.address}</span>
              </div>
            </div>

            {/* Ferma Haqida Tavsif (Description) */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Tavsif (Description)
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {farm.description}
              </p>
            </div>

            {/* Rekvizitlar & Rahbariyat Jadvali */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <p className="text-xs font-medium text-slate-400">Ferma Rahbari</p>
                <p className="text-sm font-semibold text-slate-900">{farm.bossFullName}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <p className="text-xs font-medium text-slate-400">Rahbar Telefoni</p>
                <p className="text-sm font-semibold text-slate-900">{farm.bossPhone}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <p className="text-xs font-medium text-slate-400">Ferma Rasmiy Raqami</p>
                <p className="text-sm font-semibold text-slate-900">{farm.phone}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <p className="text-xs font-medium text-slate-400">Elektron Pochta</p>
                <p className="text-sm font-semibold text-slate-900">info@{farm.id}.uz</p>
              </div>
            </div>

            {/* Ro'yxatdan o'tgan sana (chapda) va Ferma holati (o'ngda flex) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100 text-xs sm:text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-slate-400" />
                <span>
                  Ro'yxatdan o'tgan:{" "}
                  <strong className="text-slate-900 font-semibold">{farm.createdAt}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-xs font-medium text-slate-500">Ferma holati:</span>
                <Switch
                  checked={status === "active"}
                  onCheckedChange={(val) => setStatus(val ? "active" : "inactive")}
                  title={status === "active" ? "Faol" : "Nofaol"}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 3. 4 ta Qisqa Ko'rsatkich Kartochkasi (Hamma ikonkalari bir xil chiroyli KO'K rangda) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Jami */}
        <Card className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Jami Buyurtmalar
            </span>
            <div className="size-9 rounded-full bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
              <Layers className="size-4.5 text-blue-600" strokeWidth={1.75} />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {farm.totalOrders || "1,240"}
          </div>
          <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1 font-medium">
            <TrendingUp className="size-3.5" /> +12% o'tgan oydan
          </p>
        </Card>

        {/* Faol */}
        <Card className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Faol Jarayonda
            </span>
            <div className="size-9 rounded-full bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
              <Activity className="size-4.5 text-blue-600" strokeWidth={1.75} />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">320</div>
          <p className="text-xs text-slate-500 mt-1">Yetkazib berilmoqda</p>
        </Card>

        {/* Tugallangan */}
        <Card className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tugallangan
            </span>
            <div className="size-9 rounded-full bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
              <CheckCircle2 className="size-4.5 text-blue-600" strokeWidth={1.75} />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">920</div>
          <p className="text-xs text-emerald-600 mt-1 font-medium">
            98.5% muvaffaqiyat
          </p>
        </Card>

        {/* Daromad */}
        <Card className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Jami Daromad
            </span>
            <div className="size-9 rounded-full bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
              <DollarSign className="size-4.5 text-blue-600" strokeWidth={1.75} />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">$12,450</div>
          <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1 font-medium">
            <TrendingUp className="size-3.5" /> +18.4% o'sish
          </p>
        </Card>
      </div>

      {/* 4. Analitika Grafigi */}
      <Card className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <CardHeader className="p-0 pb-4 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-slate-900">
              Analitika va Savdo Dinamikasi
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Haftalik buyurtmalar va daromad ko'rsatkichlari grafigi
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0 pt-4">
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="area"
            height={300}
            width="100%"
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default FermaDetailPage
