import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Users, Truck, Search, CheckCircle2, Banknote, Clock, ArrowRight } from "lucide-react"
import {
  useCourierCashBalances,
  useCashHandovers,
  useManagerCouriers,
  useManagerCouriersDailySummary,
} from "@/shared/hooks"
import { ConfirmHandoverModal } from "@/components"

export default function ManagerXodimlarPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Real Couriers & Daily Summary API hooks
  const { data: couriersRes } = useManagerCouriers()
  const { data: dailySummaryRes } = useManagerCouriersDailySummary()

  const couriers = useMemo(() => {
    const raw = couriersRes?.data || (Array.isArray(couriersRes) ? couriersRes : null)
    return Array.isArray(raw) ? raw : []
  }, [couriersRes])

  const summaries = useMemo(() => {
    const raw = dailySummaryRes?.data || (Array.isArray(dailySummaryRes) ? dailySummaryRes : [])
    return Array.isArray(raw) ? raw : []
  }, [dailySummaryRes])

  // Real Cash & Handover API hooks
  const { data: cashBalancesRes } = useCourierCashBalances()
  const { data: pendingHandoversRes } = useCashHandovers({ status: "PENDING" })

  const cashBalances = Array.isArray(cashBalancesRes?.data)
    ? cashBalancesRes.data
    : Array.isArray(cashBalancesRes)
    ? cashBalancesRes
    : []
  const pendingHandovers = Array.isArray(pendingHandoversRes?.data)
    ? pendingHandoversRes.data
    : Array.isArray(pendingHandoversRes)
    ? pendingHandoversRes
    : []

  const [selectedHandoverForConfirm, setSelectedHandoverForConfirm] = useState(null)

  const getCourierCashBalance = (courierId) => {
    const item = cashBalances.find((b) => Number(b.courierId) === Number(courierId))
    return item ? Number(item.balance || 0) : 0
  }

  const totalCourierCash = cashBalances.reduce((sum, b) => sum + Number(b.balance || 0), 0)

  const normalizedCouriers = useMemo(() => {
    return couriers.map((courier) => {
      const id = courier.id || courier.courierId
      const name = courier.fullName || courier.name || "Kuryer"
      const initials =
        name
          .split(" ")
          .filter(Boolean)
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase() || "KR"

      const phone = courier.phone || "-"
      const vehicle = courier.vehicleModel || courier.vehicle || "-"
      const plate = courier.vehiclePlateNumber || courier.plate || ""
      const sector = courier.regionName || courier.sector || "-"
      const load = courier.maxCapacity ? `${courier.maxCapacity} dona` : (courier.load || "-")
      const isOnline = Boolean(
        courier.online ||
        courier.status === "ACTIVE" ||
        courier.status === "on_way" ||
        courier.status === "DELIVERING" ||
        courier.status === "delivering" ||
        courier.status === "free" ||
        courier.status === "AVAILABLE"
      )
      const statusText = courier.statusLabel || (isOnline ? "Onlayn" : "Oflayn")

      return {
        ...courier,
        id,
        name,
        initials,
        phone,
        vehicle,
        plate,
        sector,
        load,
        isOnline,
        statusText,
      }
    })
  }, [couriers])

  const activeCouriersCount = normalizedCouriers.filter((c) => c.isOnline).length
  const totalDeliveredOrders = summaries.reduce((sum, s) => sum + Number(s.completedOrdersCount || 0), 0)
  const totalDeliveredBottles =
    summaries.reduce((sum, s) => sum + Number(s.soldBottlesToday || 0), 0) ||
    couriers.reduce((sum, c) => sum + Number(c.todayDeliveredBottles || 0), 0)

  const filteredCouriers = normalizedCouriers.filter((courier) => {
    const name = courier.name.toLowerCase()
    const phone = courier.phone
    const vehicle = courier.vehicle.toLowerCase()
    const plate = courier.plate.toLowerCase()
    const sector = courier.sector.toLowerCase()
    const query = searchQuery.toLowerCase().trim()

    const matchesSearch =
      !query ||
      name.includes(query) ||
      phone.includes(query) ||
      vehicle.includes(query) ||
      plate.includes(query) ||
      sector.includes(query)

    if (!matchesSearch) return false
    if (statusFilter === "on_way") return courier.status === "on_way" || courier.status === "DELIVERING" || courier.status === "delivering"
    if (statusFilter === "free") return courier.status === "free" || courier.status === "AVAILABLE" || courier.status === "available"
    if (statusFilter === "loading") return courier.status === "loading" || courier.status === "BUSY" || courier.status === "busy"
    return true
  })

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Xodimlar (Dastavkachilar)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kuryerlar shtati, transport vositalari, sektorlar va kunlik yetkazish monitoringi.
          </p>
        </div>
      </div>

      {/* Top 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.05)] transition-all duration-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Jami kuryerlar</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-slate-900">{couriers.length}</span>
              <span className="text-xs font-semibold text-slate-400">nafar</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              {couriers.length > 0 ? "Barcha ro'yxatdan o'tgan kuryerlar" : "Kuryerlar mavjud emas"}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100/80 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-5.5 h-5.5" />
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.05)] transition-all duration-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Faol liniyada</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-slate-900">{activeCouriersCount}</span>
              <span className="text-xs font-semibold text-slate-400">nafar</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {activeCouriersCount > 0 ? `${activeCouriersCount} kuryer liniyada ishlamoqda` : "Hozirda faol kuryer yo'q"}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200/80 text-slate-600 flex items-center justify-center shrink-0">
            <Truck className="w-5.5 h-5.5" />
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.05)] transition-all duration-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Bugun yetkazilgan</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-slate-900">{totalDeliveredOrders}</span>
              <span className="text-xs font-semibold text-slate-400">buyurtma</span>
            </div>
            <p className="text-[11px] text-blue-600 font-medium mt-1">
              {totalDeliveredBottles > 0 ? `${totalDeliveredBottles.toLocaleString()} ta suv idishi` : "Hozircha yetkazilgan buyurtma yo'q"}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100/80 text-blue-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5.5 h-5.5" />
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.05)] transition-all duration-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Dastavkachilar kassasi</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold text-slate-900">
                {Number(totalCourierCash || 0).toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-slate-500">so'm</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {pendingHandovers.length > 0
                ? `${pendingHandovers.length} ta topshirish kutilmoqda`
                : "Barcha kassalar nazoratda"}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200/80 text-slate-600 flex items-center justify-center shrink-0">
            <Banknote className="w-5.5 h-5.5" />
          </div>
        </div>
      </div>

      {/* Kassa topshirish so'rovlari bildirishnomasi */}
      {pendingHandovers.length > 0 && (
        <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-900 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>{pendingHandovers.length} ta</strong> dastavkachidan kassa topshirish so'rovi kutilmoqda!
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedHandoverForConfirm(pendingHandovers[0])}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
          >
            <span>Ko'rib chiqish</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Couriers List Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col">
        {/* Table Filters */}
        <div className="p-5 sm:p-6 border-b border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Qidiruv..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === "all" ? "bg-blue-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:text-slate-900"
              }`}
            >
              Barchasi ({normalizedCouriers.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("on_way")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === "on_way" ? "bg-blue-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:text-slate-900"
              }`}
            >
              Yo'lda ({normalizedCouriers.filter((c) => c.status === "on_way" || c.status === "DELIVERING" || c.status === "delivering").length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("free")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === "free" ? "bg-blue-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:text-slate-900"
              }`}
            >
              Bo'sh ({normalizedCouriers.filter((c) => c.status === "free" || c.status === "AVAILABLE" || c.status === "available").length})
            </button>
          </div>
        </div>

        {/* Couriers Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-xs tracking-wider">
                <th className="py-3.5 px-4">Kuryer</th>
                <th className="py-3.5 px-4">Telefon raqam</th>
                <th className="py-3.5 px-4">Transport</th>
                <th className="py-3.5 px-4">Yuk sig'imi</th>
                <th className="py-3.5 px-4">Holat</th>
                <th className="py-3.5 px-4">Kassa Balansi</th>
                <th className="py-3.5 px-4 text-right">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCouriers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    Kuryerlar topilmadi
                  </td>
                </tr>
              ) : (
                filteredCouriers.map((courier) => {
                  const courierCash = getCourierCashBalance(courier.id)
                  return (
                    <tr key={courier.id} className="hover:bg-slate-50/80 transition-colors min-h-14">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center shrink-0">
                            {courier.initials}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">
                              {courier.name}
                            </div>
                            <div className="text-xs text-slate-400">Dastavkachi xodim</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono text-slate-700">
                        {courier.phone}
                      </td>
                      <td className="py-4 px-4">
                        {courier.vehicle && courier.vehicle !== "-" ? (
                          <div>
                            <div className="font-medium text-slate-800">{courier.vehicle}</div>
                            {courier.plate && (
                              <div className="text-xs text-slate-400 font-mono">{courier.plate}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">Biriktirilmagan</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-blue-600">{courier.load}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                            courier.isOnline
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {courier.statusText}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`font-bold font-mono ${courierCash > 0 ? "text-emerald-700" : "text-slate-500"}`}>
                          {Number(courierCash || 0).toLocaleString()} so'm
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => navigate("/manager/dastavkachilar-xarita")}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer"
                        >
                          Xaritada
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Kuryer kassa so'rovini tasdiqlash/rad etish modali */}
      <ConfirmHandoverModal
        isOpen={Boolean(selectedHandoverForConfirm)}
        onClose={() => setSelectedHandoverForConfirm(null)}
        handover={selectedHandoverForConfirm}
      />
    </div>
  )
}
