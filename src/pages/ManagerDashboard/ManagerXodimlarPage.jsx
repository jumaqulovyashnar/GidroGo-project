import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Users, Truck, Copy, Search, CheckCircle2, Banknote, Clock, ArrowRight } from "lucide-react"
import { toast } from "sonner"
import {
  useCourierCashBalances,
  useCashHandovers,
  useManagerCouriers,
  useManagerCouriersDailySummary,
} from "@/shared/hooks"
import { ManagerDirectHandoverModal, ConfirmHandoverModal } from "@/components"

export default function ManagerXodimlarPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Real Couriers & Daily Summary API hooks
  const { data: couriersRes } = useManagerCouriers()
  const { data: _dailySummaryRes } = useManagerCouriersDailySummary()

  const rawCouriers = couriersRes?.data || (Array.isArray(couriersRes) ? couriersRes : null)
  const couriers = Array.isArray(rawCouriers) ? rawCouriers : []

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

  const [selectedCourierForHandover, setSelectedCourierForHandover] = useState(null)
  const [selectedHandoverForConfirm, setSelectedHandoverForConfirm] = useState(null)

  const getCourierCashBalance = (courierId) => {
    const item = cashBalances.find((b) => Number(b.courierId) === Number(courierId))
    return item ? Number(item.balance || 0) : 0
  }

  const totalCourierCash = cashBalances.reduce((sum, b) => sum + Number(b.balance || 0), 0)

  const filteredCouriers = couriers.filter((courier) => {
    const name = String(courier.name || courier.fullName || "")
    const phone = String(courier.phone || "")
    const vehicle = String(courier.vehicle || "")
    const plate = String(courier.plate || "")
    const sector = String(courier.sector || courier.regionName || "")

    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phone.includes(searchQuery) ||
      vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sector.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false
    if (statusFilter === "on_way") return courier.status === "on_way" || courier.status === "DELIVERING"
    if (statusFilter === "free") return courier.status === "free" || courier.status === "AVAILABLE"
    if (statusFilter === "loading") return courier.status === "loading" || courier.status === "BUSY"
    return true
  })

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Xodimlar (Dastavkachilar)</h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Qarshi Filiali
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Qarshi filiali kuryerlar shtati, transport vositalari, sektorlar va kunlik yetkazish monitoringi.
          </p>
        </div>
      </div>

      {/* Top 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Jami kuryerlar</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-slate-900">{couriers.length}</span>
              <span className="text-xs font-semibold text-slate-400">nafar</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Barcha transportlar texnik soz</p>
          </div>
          <div className="size-10 rounded-full bg-blue-100/70 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Faol liniyada</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-slate-900">8</span>
              <span className="text-xs font-semibold text-slate-400">nafar</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">2 kuryer navbatchilikda</p>
          </div>
          <div className="size-10 rounded-full bg-blue-100/70 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Bugun yetkazilgan</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-slate-900">94</span>
              <span className="text-xs font-semibold text-slate-400">buyurtma</span>
            </div>
            <p className="text-[11px] text-blue-600 font-medium mt-0.5">1,780 Litr toza suv</p>
          </div>
          <div className="size-10 rounded-full bg-blue-100/70 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Dastavkachilar kassasi</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold text-emerald-600">
                {totalCourierCash.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-slate-500">so'm</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {pendingHandovers.length > 0
                ? `${pendingHandovers.length} ta topshirish kutilmoqda`
                : "Barcha kassalar nazoratda"}
            </p>
          </div>
          <div className="size-10 rounded-full bg-emerald-100/70 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
            <Banknote className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Kassa topshirish so'rovlari bildirishnomasi */}
      {pendingHandovers.length > 0 && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900 shadow-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>{pendingHandovers.length} ta</strong> dastavkachidan kassa topshirish so'rovi kutilmoqda!
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedHandoverForConfirm(pendingHandovers[0])}
            className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg text-xs flex items-center gap-1 shadow-xs cursor-pointer transition-colors"
          >
            <span>Ko'rib chiqish</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Couriers List Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col">
        {/* Table Filters */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
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
              Barchasi ({couriers.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("on_way")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === "on_way" ? "bg-blue-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:text-slate-900"
              }`}
            >
              Yo'lda ({couriers.filter((c) => c.status === "on_way").length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("free")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === "free" ? "bg-blue-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:text-slate-900"
              }`}
            >
              Bo'sh ({couriers.filter((c) => c.status === "free").length})
            </button>
          </div>
        </div>

        {/* Couriers Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Kuryer</th>
                <th className="py-2.5 px-3">Telefon raqam</th>
                <th className="py-2.5 px-3">Transport</th>
                <th className="py-2.5 px-3">Hudud / Sektor</th>
                <th className="py-2.5 px-3">Yuk sig'imi</th>
                <th className="py-2.5 px-3">Holat</th>
                <th className="py-2.5 px-3">Kassa Balansi</th>
                <th className="py-2.5 px-3 text-right">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCouriers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Kuryerlar topilmadi
                  </td>
                </tr>
              ) : (
                filteredCouriers.map((courier) => {
                  const courierCash = getCourierCashBalance(courier.id)
                  return (
                    <tr key={courier.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center shrink-0">
                            {courier.initials}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                              <span>{courier.name}</span>
                              <span className="text-[10px] text-amber-500 font-medium">
                                ★ {courier.rating}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400">Dastavkachi xodim</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-700">
                        {courier.phone}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-800">{courier.vehicle}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{courier.plate}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-700">
                        {courier.sector}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-blue-600">{courier.load}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            courier.status === "on_way"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : courier.status === "free"
                              ? "bg-slate-100 text-slate-700 border border-slate-200"
                              : "bg-slate-50 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {courier.statusText}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`font-bold font-mono ${courierCash > 0 ? "text-emerald-700" : "text-slate-500"}`}>
                          {courierCash.toLocaleString()} so'm
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Direct Handover button (POST /api/manager/couriers/{courierId}/cash/handovers) */}
                          <button
                            type="button"
                            onClick={() => setSelectedCourierForHandover(courier)}
                            className="px-2 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                            title="Kassani qabul qilish"
                          >
                            <Banknote className="w-3.5 h-3.5" />
                            <span>Kassa</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText(courier.phone)
                              toast.success(`Telefon raqami nusxalandi: ${courier.phone}`)
                            }}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                            title="Telefon raqamini nusxalash"
                          >
                            <Copy className="w-3.5 h-3.5 text-blue-600" />
                          </button>
                          <button
                            type="button"
                            onClick={() => navigate("/manager/dastavkachilar-xarita")}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer"
                          >
                            Xaritada
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Menejer tomonidan to'g'ridan-to'g'ri topshirilgan naqd pulni kiritish modali */}
      <ManagerDirectHandoverModal
        isOpen={Boolean(selectedCourierForHandover)}
        onClose={() => setSelectedCourierForHandover(null)}
        courierId={selectedCourierForHandover?.id}
        courierName={selectedCourierForHandover?.name}
      />

      {/* Kuryer kassa so'rovini tasdiqlash/rad etish modali */}
      <ConfirmHandoverModal
        isOpen={Boolean(selectedHandoverForConfirm)}
        onClose={() => setSelectedHandoverForConfirm(null)}
        handover={selectedHandoverForConfirm}
      />
    </div>
  )
}
