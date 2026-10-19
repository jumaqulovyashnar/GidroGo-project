import { useMemo } from "react"
import { StatCard } from "@/shared/ui"
import { Users, ShieldCheck, TrendingUp, Ban } from "lucide-react"

/**
 * Ferma egalari sahifasi 4 ta metrika kartochkalari
 * @param {Object} props
 * @param {import("@/entities/boss").BossStats} props.stats
 * @param {boolean} props.isLoading
 */
export function FermaEgalariStats({ stats, isLoading = false }) {
  const total = Number(stats?.total ?? 0)
  const active = Number(stats?.active ?? 0)
  const recently = Number(stats?.recently ?? 0)
  const blocked = Number(stats?.blocked ?? 0)

  const activePercent = total > 0 ? Math.min(100, Math.round((active / total) * 100)) : 0
  const recentlyPercent = total > 0 ? Math.min(100, Math.round((recently / total) * 100)) : 0
  const blockedPercent = total > 0 ? Math.min(100, Math.round((blocked / total) * 100)) : 0

  const cards = useMemo(
    () => [
      {
        id: 1,
        title: "JAMI BOSSLAR",
        value: `${total} nafar`,
        subText: `${active} faol / ${blocked} bloklangan`,
        badge: "Jami",
        icon: Users,
        percentage: 100,
      },
      {
        id: 2,
        title: "FAOL HISOBLAR",
        value: `${active} nafar`,
        subText: "Faoliyat yuritayotgan rahbarlar",
        badge: `${activePercent}%`,
        icon: ShieldCheck,
        percentage: activePercent,
      },
      {
        id: 3,
        title: "YANGI TASDIQLANGAN",
        value: `${recently} nafar`,
        subText: "Oxirgi qo'shilgan hisoblar",
        badge: `${recently} ta`,
        icon: TrendingUp,
        percentage: recentlyPercent,
      },
      {
        id: 4,
        title: "BLOKLANGAN",
        value: `${blocked} nafar`,
        subText: "Faoliyati to'xtatilgan hisoblar",
        badge: `${blocked} ta`,
        icon: Ban,
        percentage: blockedPercent,
      },
    ],
    [total, active, recently, blocked, activePercent, recentlyPercent, blockedPercent]
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 pt-4">
      {cards.map((card) => (
        <StatCard
          key={card.id}
          title={card.title}
          value={card.value}
          subText={card.subText}
          badge={card.badge}
          icon={card.icon}
          percentage={card.percentage}
          isLoading={isLoading}
        />
      ))}
    </div>
  )
}

export default FermaEgalariStats
