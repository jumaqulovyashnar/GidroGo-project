import { useMemo } from "react"
import { Card } from "@/shared/ui"
import { User, ShieldCheck, TrendingUpIcon, Hammer } from "lucide-react"

/**
 * Ferma egalari sahifasi 4 ta metrika kartochkalari
 * Barcha elementlar startda (chapda) bir xil tekislangan
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card
            key={card.id}
            className="p-4 sm:p-5 border border-slate-200/80 rounded-2xl bg-white shadow-xs flex flex-col justify-between min-h-[130px] transition-all hover:border-slate-300"
          >
            {/* Yuqori qism: Sarlavha va Ikona (chapdan startda tekislangan) */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {card.title}
              </span>
              <div className="size-10 sm:size-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/80 shadow-2xs shrink-0">
                <Icon className="size-5 text-blue-600" strokeWidth={1.75} />
              </div>
            </div>

            {/* Pastki qism: Qiymat va label (chapdan startda yuqori sarlavha bilan bir xil tekislangan) */}
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
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
