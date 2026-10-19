import { useMemo } from "react"
import { Card, CardHeader } from "@/shared/ui"
import { User, ShieldCheck, TrendingUpIcon, Hammer } from "lucide-react"

/**
 * Ferma egalari sahifasi 4 ta metrika kartochkalari (default holatda)
 * Barcha iconlar ko'k rangda (bg-blue-50 text-blue-600 border-blue-100)
 * @param {Object} props
 * @param {import("@/entities/boss").BossStats} props.stats
 * @param {boolean} props.isLoading
 */
export function FermaEgalariStats({ stats, isLoading = false }) {
  const cards = useMemo(
    () => [
      { id: 1, title: "JAMI BOSSLAR", value: stats?.total ?? 0, label: "nafar", icon: User },
      { id: 2, title: "FAOL HISOBLAR", value: stats?.active ?? 0, label: "nafar", icon: ShieldCheck },
      { id: 3, title: "YANGI TASDIQLANGAN", value: stats?.recently ?? 0, label: "nafar", icon: TrendingUpIcon },
      { id: 4, title: "BLOKLANGAN", value: stats?.blocked ?? 0, label: "nafar", icon: Hammer },
    ],
    [stats]
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.id} className="p-4 sm:p-5 border border-slate-200/80 rounded-2xl bg-white shadow-xs">
            <CardHeader className="flex items-center justify-between p-0">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {card.title}
              </span>
              <span className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                <Icon className="size-4.5 text-blue-600" />
              </span>
            </CardHeader>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900">
                {isLoading ? "—" : card.value}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {card.label}
              </span>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

export default FermaEgalariStats
