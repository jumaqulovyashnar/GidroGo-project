/**
 * Xom API javobini standartlashtirilgan NormalizedBoss ob'yektiga aylantirish
 * @param {Object} raw - API dan kelgan xom ob'yekt
 * @returns {import("./boss.types").NormalizedBoss}
 */
export function normalizeBoss(raw) {
  if (!raw) return null

  const fullName = raw.fullName || raw.profile?.fullName || "—"
  const avatarUrl = raw.avatarUrl || raw.profile?.avatar || ""
  const phone = raw.phone || raw.profile?.phone || "—"
  const farmName = raw.farmName || raw.farm?.name || "Ferma biriktirilmagan"
  const farmId = raw.farmId || raw.farm?.id || "—"
  const farmImage = raw.farmLogoUrl || raw.logoUrl || avatarUrl || raw.farm?.logoUrl || ""
  
  const isActive = raw.active !== undefined
    ? Boolean(raw.active)
    : (raw.status === "ACTIVE" || raw.profile?.status === "active")

  let createdAtStr = "—"
  let createdAtTimestamp = 0

  if (raw.formattedCreatedAt) {
    createdAtStr = raw.formattedCreatedAt
  } else if (raw.createdAt) {
    const d = new Date(raw.createdAt)
    if (!isNaN(d.getTime())) {
      createdAtTimestamp = d.getTime()
      createdAtStr = d.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    }
  }

  return {
    id: raw.id,
    fullName,
    avatarUrl,
    phone,
    farmName,
    farmId,
    farmImage,
    isActive,
    createdAtStr,
    createdAtTimestamp,
    raw,
  }
}

/**
 * Normalizatsiya qilingan rahbarlar ro'yxatidan statistikani hisoblash
 * @param {import("./boss.types").NormalizedBoss[]} bosses
 * @returns {import("./boss.types").BossStats}
 */
export function calculateBossStats(bosses) {
  if (!Array.isArray(bosses)) {
    return { total: 0, active: 0, blocked: 0, recently: 0 }
  }

  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
  let active = 0
  let blocked = 0
  let recently = 0

  bosses.forEach((boss) => {
    if (boss.isActive) {
      active++
    } else {
      blocked++
    }

    if (boss.createdAtTimestamp && boss.createdAtTimestamp >= thirtyDaysAgo) {
      recently++
    }
  })

  return {
    total: bosses.length,
    active,
    blocked,
    recently,
  }
}
