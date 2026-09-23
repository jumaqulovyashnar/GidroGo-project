import { useState } from "react"
import { Truck, Users, Clock, Banknote, Search, Copy, Navigation, CheckCircle2, Package, Car, ChevronRight } from "lucide-react"
import { GoogleMap } from "@/widgets"
import { MOCK_COURIERS } from "@/mock"
import { toast } from "sonner"

export default function ManagerCouriersMapPage() {
  const [couriers] = useState(MOCK_COURIERS)
  const [selectedCourierId, setSelectedCourierId] = useState(1) // Default Otabek
  const [activeTab, setActiveTab] = useState("all") // all, on_way, free, loading
  const [searchQuery, setSearchQuery] = useState("")

  // Filter couriers
  const filteredCouriers = couriers.filter((courier) => {
    const matchesSearch =
      courier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      courier.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      courier.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      courier.phone.includes(searchQuery)

    if (!matchesSearch) return false

    if (activeTab === "on_way") return courier.status === "on_way"
    if (activeTab === "free") return courier.status === "free"
    if (activeTab === "loading") return courier.status === "loading"
    return true
  })

  const handleCopyPhone = (phone, name) => {
    navigator.clipboard?.writeText(phone)
    toast.success(`${name} telefon raqami nusxalandi: ${phone}`)
  }

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Dastavkachilar va Xarita (Dispatch)</h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              Qarshi filiali Jonli
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Qarshi shahri bo'ylab barcha kuryerlarning joriy joylashuvi, yuk sig'imi va yo'nalishlari monitoringi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              toast.success("GPS signallari yangilandi")
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200"
          >
            <Navigation className="w-3.5 h-3.5 text-blue-600" />
            <span>GPS Yangilash</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* KPI 1 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Faol dastavkachilar</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold text-slate-900">8</span>
              <span className="text-xs font-semibold text-slate-400">/ 10 nafar</span>
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>2 kuryer navbatchi</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Mashinalarda suv</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold text-slate-900">188</span>
              <span className="text-xs font-semibold text-slate-400">dona</span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              Jami sig'imning 78% qismi
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">O'rtacha yetkazish vaqti</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold text-slate-900">24</span>
              <span className="text-xs font-semibold text-slate-400">daqiqa</span>
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">
              Rejadan 6 daqiqa tezroq
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Kassa tushumi (Bugun)</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-slate-900">5,840,000</span>
              <span className="text-xs font-semibold text-slate-400">UZS</span>
            </div>
            <div className="text-[11px] text-blue-600 font-medium mt-1">
              84 ta yetkazilgan buyurtma
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Banknote className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Map + Couriers Dispatch Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Courier Dispatch List (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-[680px]">
          {/* Dispatch Header & Tabs */}
          <div className="p-3.5 border-b border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>Dastavkachilar Boshqaruvi</span>
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {couriers.length} ta kuryer
              </span>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`flex-1 py-1 rounded transition-colors text-center ${
                  activeTab === "all" ? "bg-white text-blue-600 shadow-xs font-semibold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Barchasi ({couriers.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("on_way")}
                className={`flex-1 py-1 rounded transition-colors text-center ${
                  activeTab === "on_way" ? "bg-white text-blue-600 shadow-xs font-semibold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Yo'lda ({couriers.filter((c) => c.status === "on_way").length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("free")}
                className={`flex-1 py-1 rounded transition-colors text-center ${
                  activeTab === "free" ? "bg-white text-blue-600 shadow-xs font-semibold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Bo'sh ({couriers.filter((c) => c.status === "free").length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("loading")}
                className={`flex-1 py-1 rounded transition-colors text-center ${
                  activeTab === "loading" ? "bg-white text-blue-600 shadow-xs font-semibold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Yukda ({couriers.filter((c) => c.status === "loading").length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Kuryer, avtoraqam yoki telefon..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Couriers Scrollable List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 divide-y divide-slate-100">
            {filteredCouriers.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                Kuryerlar topilmadi
              </div>
            ) : (
              filteredCouriers.map((courier) => {
                const isSelected = selectedCourierId === courier.id

                return (
                  <div
                    key={courier.id}
                    onClick={() => setSelectedCourierId(courier.id)}
                    className={`pt-2.5 first:pt-0 cursor-pointer rounded-lg p-2.5 transition-all ${
                      isSelected
                        ? "bg-blue-50/70 border border-blue-200 shadow-xs"
                        : "hover:bg-slate-50 border border-transparent"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                            isSelected
                              ? "bg-blue-600 text-white shadow-xs"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {courier.initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-xs text-slate-900 leading-tight">
                              {courier.name}
                            </span>
                            <span className="text-[10px] font-medium text-slate-400">
                              ★ {courier.rating}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                            <Car className="w-3 h-3 text-slate-400" />
                            <span>{courier.vehicle}</span>
                            <span className="font-mono bg-slate-100 px-1 rounded text-[10px] text-slate-600">
                              {courier.plate}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                          courier.status === "on_way"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : courier.status === "free"
                            ? "bg-blue-100/70 text-blue-800 border border-blue-200"
                            : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        {courier.statusText}
                      </span>
                    </div>

                    {/* Delivery & Destination info */}
                    <div className="mt-2.5 pt-2 border-t border-slate-100/80 flex items-center justify-between text-[11px]">
                      <div className="truncate max-w-50">
                        <span className="text-slate-400">Manzil: </span>
                        <span className="font-medium text-slate-700 truncate">
                          {courier.currentDestination}
                        </span>
                      </div>
                      <span className="text-blue-600 font-semibold shrink-0">
                        {courier.load}
                      </span>
                    </div>

                    {/* Bottom Quick Action buttons */}
                    <div className="mt-2 flex items-center justify-between pt-1.5">
                      <div className="text-[10px] text-slate-400">
                        Bugun: <strong className="text-slate-700">{courier.completedToday}</strong> ta yetkazildi
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCopyPhone(courier.phone, courier.name)
                          }}
                          className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                          title="Telefon raqamini nusxalash"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedCourierId(courier.id)
                          }}
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-1"
                        >
                          <span>Xaritada</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Right Big Live Google Map (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs p-2 flex flex-col h-[680px]">
          {/* Map Container */}
          <div className="flex-1 w-full h-full relative rounded-lg overflow-hidden">
            <GoogleMap
              couriers={couriers}
              selectedCourierId={selectedCourierId}
              onSelectCourier={(id) => setSelectedCourierId(id)}
              className="w-full h-full min-h-[660px]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
