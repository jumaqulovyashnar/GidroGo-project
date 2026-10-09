import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui"
import { useBossCouriersDailySummary } from "@/shared/hooks"
import { Truck } from "lucide-react"

export function CouriersPerformanceCard() {
  const { data: couriersRes, isLoading } = useBossCouriersDailySummary()
  const rawCouriers = couriersRes?.data || couriersRes

  const list =
    Array.isArray(rawCouriers)
      ? rawCouriers.map((c) => {
          const loaded = Number(c.loadedBottlesToday || 0)
          const sold = Number(c.soldBottlesToday || 0)
          const efficiency = loaded > 0 ? Math.min(100, Math.round((sold / loaded) * 100)) : 0

          const isActive =
            c.currentStatus === "ACTIVE" ||
            c.currentStatus === "ONLINE" ||
            c.currentStatus === "ON_THE_WAY"

          return {
            id: c.courierId,
            name: c.fullName || "Kuryer",
            phone: c.phone || "",
            avatarUrl: c.avatarUrl || "",
            initials: (c.fullName || "K").slice(0, 2).toUpperCase(),
            isActive,
            statusText: isActive ? "Faol" : "Kutilmoqda",
            ordersCount: `${c.completedOrdersCount ?? 0} ta`,
            deliveredBottles: `${sold} dona`,
            efficiency,
          }
        })
      : []

  return (
    <Card className="border border-slate-200 bg-white shadow-xs rounded-2xl overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-2">
        <div>
          <CardTitle className="text-base font-bold text-slate-900">
            Dastavkachilar faoliyati
          </CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">
            Bugungi kun bo'yicha shaxsiy samaradorlik ko'rsatkichlari
          </p>
        </div>
        <span className="text-xs font-medium text-slate-500">
          Jami {list.length} nafar haydovchi
        </span>
      </CardHeader>

      <CardContent className="p-0">
        {isLoading ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            Ma'lumotlar yuklanmoqda...
          </div>
        ) : list.length === 0 ? (
          <div className="py-12 px-4 text-center flex flex-col items-center justify-center">
            <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
              <Truck className="size-6" />
            </div>
            <h4 className="text-sm font-semibold text-slate-700">
              Faol kuryerlar topilmadi
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Bugungi kunda hali fermaning dastavkachilari tizimda ro'yxatdan o'tmagan yoki ishga chiqmagan.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-y border-slate-100 bg-slate-50/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-5 w-16 text-center">Rasm</th>
                  <th className="py-3 px-4">Dastavkachi</th>
                  <th className="py-3 px-4">Holat</th>
                  <th className="py-3 px-4">Buyurtmalar soni</th>
                  <th className="py-3 px-4">Yetkazilgan suv</th>
                  <th className="py-3 px-5 min-w-44">Bajarilish samaradorligi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {list.map((driver) => (
                  <tr
                    key={driver.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="py-3.5 px-5 text-center">
                      <div className="size-9 rounded-full bg-blue-50 border border-slate-200 overflow-hidden mx-auto flex items-center justify-center text-blue-600 font-semibold text-xs shrink-0 shadow-2xs">
                        {driver.avatarUrl ? (
                          <img
                            src={driver.avatarUrl}
                            alt={driver.name}
                            className="size-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none"
                            }}
                          />
                        ) : (
                          driver.initials
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{driver.name}</div>
                      {driver.phone && (
                        <div className="text-xs text-slate-400 font-normal">{driver.phone}</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                          driver.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                            : "bg-slate-100 text-slate-600 border-slate-200/80"
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            driver.isActive ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                        />
                        {driver.statusText}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {driver.ordersCount}
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-600">
                      {driver.deliveredBottles}
                    </td>

                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500 bg-[#059669]"
                            style={{ width: `${driver.efficiency}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold w-9 text-right text-emerald-700">
                          {driver.efficiency}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default CouriersPerformanceCard
