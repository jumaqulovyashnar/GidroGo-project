import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui"

const couriersData = [
  {
    id: 1,
    name: "Azizbek Rahimov",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    initials: "AR",
    status: "active",
    statusText: "Faol",
    ordersCount: "48 ta",
    deliveredWater: "1 240 L",
    efficiency: 96,
    barColor: "bg-[#059669]", // Zumrad yashil
    textColor: "text-emerald-700",
  },
  {
    id: 2,
    name: "Sardor Karimov",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    initials: "SK",
    status: "active",
    statusText: "Faol",
    ordersCount: "42 ta",
    deliveredWater: "1 080 L",
    efficiency: 94,
    barColor: "bg-[#059669]",
    textColor: "text-emerald-700",
  },
  {
    id: 3,
    name: "Jamshid Aliyev",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
    initials: "JA",
    status: "resting",
    statusText: "Dam olishda",
    ordersCount: "37 ta",
    deliveredWater: "920 L",
    efficiency: 91,
    barColor: "bg-slate-500", // Dam olishda kulrang bar
    textColor: "text-slate-600",
  },
  {
    id: 4,
    name: "Bekzod Rustamov",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80",
    initials: "BR",
    status: "active",
    statusText: "Faol",
    ordersCount: "31 ta",
    deliveredWater: "780 L",
    efficiency: 89,
    barColor: "bg-[#059669]",
    textColor: "text-emerald-700",
  },
]

export function CouriersPerformanceCard() {
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
          Jami 10 nafar haydovchi
        </span>
      </CardHeader>

      <CardContent className="p-0">
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
              {couriersData.map((driver) => {
                const isActive = driver.status === "active"

                return (
                  <tr
                    key={driver.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Alohida "Rasm" ustuni */}
                    <td className="py-3.5 px-5 text-center">
                      <div className="size-9 rounded-full bg-blue-50 border border-slate-200 overflow-hidden mx-auto flex items-center justify-center text-blue-600 font-semibold text-xs shrink-0 shadow-2xs">
                        {driver.avatarUrl ? (
                          <img
                            src={driver.avatarUrl}
                            alt={driver.name}
                            className="size-full object-cover"
                            onError={(e) => {
                              // Agar rasm yuklanmasa harflarni ko'rsatish
                              e.currentTarget.style.display = "none"
                            }}
                          />
                        ) : (
                          driver.initials
                        )}
                      </div>
                    </td>

                    {/* Dastavkachi ismi */}
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {driver.name}
                    </td>

                    {/* Holat badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                          isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                            : "bg-slate-100 text-slate-600 border-slate-200/80"
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            isActive ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                        />
                        {driver.statusText}
                      </span>
                    </td>

                    {/* Buyurtmalar soni */}
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {driver.ordersCount}
                    </td>

                    {/* Yetkazilgan suv */}
                    <td className="py-3.5 px-4 font-medium text-slate-600">
                      {driver.deliveredWater}
                    </td>

                    {/* Bajarilish samaradorligi: Progress bar + Foiz */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${driver.barColor}`}
                            style={{ width: `${driver.efficiency}%` }}
                          />
                        </div>
                        <span className={`text-xs font-bold w-9 text-right ${driver.textColor}`}>
                          {driver.efficiency}%
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
