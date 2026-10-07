import { useState, useMemo, useCallback } from "react"

const DEFAULT_FILTERS = {
  search: "",
  status: "all",
  farm: "all",
}

/**
 * Ferma egalari jadvali uchun filterlash, qidiruv va pagination custom hooki
 * @param {import("@/entities/boss").NormalizedBoss[]} bosses - Normalizatsiya qilingan ro'yxat
 * @param {number} itemsPerPage - Har bir sahifada ko'rsatiladigan elementlar soni
 */
export function useBossesTable(bosses = [], itemsPerPage = 8) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [currentPage, setCurrentPage] = useState(1)

  /**
   * DRY: Filter o'zgarganda sahifani avtomatik 1 ga tushiruvchi yagona funksiya
   */
  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
    setCurrentPage(1)
  }, [])

  /**
   * Mavjud rahbarlar ma'lumotlaridan dinamik fermalar tanlovini shakllantirish
   */
  const farmOptions = useMemo(() => {
    const uniqueFarms = new Map()
    bosses.forEach((b) => {
      if (b.farmName && b.farmName !== "Ferma biriktirilmagan") {
        const idStr = String(b.farmId || b.farmName)
        if (!uniqueFarms.has(idStr)) {
          uniqueFarms.set(idStr, b.farmName)
        }
      }
    })

    const options = [{ value: "all", label: "Barcha fermalar" }]
    uniqueFarms.forEach((label, value) => {
      options.push({ value, label })
    })
    return options
  }, [bosses])

  /**
   * Filtrlash mantiqi (search, status, farm)
   */
  const filteredBosses = useMemo(() => {
    const query = filters.search.toLowerCase().trim()
    const { status, farm } = filters

    return bosses.filter((boss) => {
      // 1. Search filter
      const matchesSearch =
        !query ||
        boss.fullName.toLowerCase().includes(query) ||
        boss.farmName.toLowerCase().includes(query) ||
        boss.phone.toLowerCase().includes(query)

      if (!matchesSearch) return false

      // 2. Status filter
      if (status === "active" && !boss.isActive) return false
      if (status === "blocked" && boss.isActive) return false

      // 3. Farm filter
      if (farm !== "all") {
        const matchesFarm =
          String(boss.farmId) === farm ||
          boss.farmName.toLowerCase().includes(farm.toLowerCase())
        if (!matchesFarm) return false
      }

      return true
    })
  }, [bosses, filters])

  const totalPages = Math.max(1, Math.ceil(filteredBosses.length / itemsPerPage))

  const paginatedBosses = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredBosses.slice(start, start + itemsPerPage)
  }, [filteredBosses, currentPage, itemsPerPage])

  return {
    filters,
    updateFilter,
    resetFilters,
    farmOptions,
    paginatedBosses,
    totalPages,
    currentPage,
    setCurrentPage,
    totalFilteredCount: filteredBosses.length,
  }
}
