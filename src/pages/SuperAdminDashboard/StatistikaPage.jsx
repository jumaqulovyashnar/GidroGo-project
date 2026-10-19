import { useState, useMemo, useRef, useEffect, lazy, Suspense } from "react"
import { Button, Card, CardHeader, CardTitle, CardContent, TablePagination, Spinner } from "@/shared/ui"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/shared/ui/table"
import { Filter, Tractor, Users, BadgeCheck, Gauge, RefreshCw, Calendar, MapPin, X, RotateCcw, ChevronDown } from "lucide-react"
import { useRegionalStatistics, useSuperAdminDashboard } from "@/shared/hooks"

const LineColumn = lazy(() => import("@/widgets").then((m) => ({ default: m.LineColumn })))

const ITEMS_PER_PAGE = 8

const formatDateYMD = (date) => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, "0")
    const d = String(date.getDate()).padStart(2, "0")
    return `${y}-${m}-${d}`
}

export const StatistikaPage = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const filterRef = useRef(null)

    const [filters, setFilters] = useState({
        region: "all",
        from: "",
        to: "",
    })

    const [draftFilters, setDraftFilters] = useState({
        region: "all",
        from: "",
        to: "",
    })

    // Click outside va Escape tugmasi orqali popoverni yopish
    useEffect(() => {
        if (!isFilterOpen) return

        const handleClickOutside = (e) => {
            if (filterRef.current && !filterRef.current.contains(e.target)) {
                setIsFilterOpen(false)
            }
        }
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setIsFilterOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        document.addEventListener("keydown", handleKeyDown)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [isFilterOpen])

    const activeFilterCount = useMemo(() => {
        let count = 0
        if (filters.region && filters.region !== "all") count++
        if (filters.from) count++
        if (filters.to) count++
        return count
    }, [filters])

    // Backend so'rovi uchun parametrlar (OpenAPI: region, from, to)
    const queryParams = useMemo(() => {
        const p = {}
        if (filters.region && filters.region !== "all") {
            p.region = filters.region
        }
        if (filters.from) {
            p.from = filters.from
        }
        if (filters.to) {
            p.to = filters.to
        }
        return p
    }, [filters])

    const { data: regData, isFetching: isFetchingReg, refetch: refetchReg } = useRegionalStatistics(queryParams)
    const { data: dashData } = useSuperAdminDashboard()

    const regResponse = regData?.data || regData
    const dashboard = useMemo(() => dashData?.data || dashData || {}, [dashData])

    // Mavjud hududlar ro'yxati (Dropdown uchun)
    const availableRegions = useMemo(() => {
        const rawList = Array.isArray(regResponse?.regions)
            ? regResponse.regions.map((r) => r.regionName || r.name).filter(Boolean)
            : []
        const unique = Array.from(new Set(rawList))
        return unique.length > 0 ? unique : ["Toshkent", "Samarqand", "Qarshi", "Belgilanmagan"]
    }, [regResponse])

    // Faqat haqiqiy API dan kelgan hududlar ro'yxati (hech qanday mock yo'q)
    const regionsList = useMemo(() => {
        if (Array.isArray(regResponse?.regions) && regResponse.regions.length > 0) {
            return regResponse.regions.map((r, idx) => ({
                id: `reg-${r.id || idx}`,
                code: (r.regionName || r.name || "HUD").slice(0, 3).toUpperCase(),
                name: r.regionName || r.name || "Hudud",
                subtitle: r.formattedText || `${r.count ?? r.value ?? 0} ta ferma`,
                farmsActive: r.count ?? r.value ?? 0,
                farmsBackup: r.backupFarms ?? 0,
                monthlyOrders: r.percentage !== undefined ? `${r.percentage}% ulush` : `${r.ordersCount ?? 0} ta buyurtma`,
                rating: r.rating ? Number(r.rating).toFixed(1) : "—",
                reviewCount: r.reviewCount ? `${r.reviewCount} baho` : "0 baho",
                growthRate: r.growthRate || (r.percentage !== undefined ? `${r.percentage}%` : "0%"),
            }))
        }
        return []
    }, [regResponse])

    // Client-side xavfsiz filtrlash (agar backend barcha hududlarni qaytarsa ham UI to'g'ri filtrlanadi)
    const filteredRegionsList = useMemo(() => {
        if (!filters.region || filters.region === "all") return regionsList
        const target = filters.region.trim().toLowerCase()
        return regionsList.filter((r) => r.name.toLowerCase().includes(target))
    }, [regionsList, filters.region])

    // Tezkor sana tanlash yordamchisi
    const handleQuickDateSelect = (type) => {
        const now = new Date()
        if (type === "all") {
            setDraftFilters((prev) => ({ ...prev, from: "", to: "" }))
        } else if (type === "month") {
            const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
            setDraftFilters((prev) => ({
                ...prev,
                from: formatDateYMD(firstDay),
                to: formatDateYMD(now),
            }))
        } else if (type === "30days") {
            const past30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            setDraftFilters((prev) => ({
                ...prev,
                from: formatDateYMD(past30),
                to: formatDateYMD(now),
            }))
        }
    }

    const activePreset = useMemo(() => {
        if (!draftFilters.from && !draftFilters.to) return "all"
        const now = new Date()
        const firstDay = formatDateYMD(new Date(now.getFullYear(), now.getMonth(), 1))
        const today = formatDateYMD(now)
        if (draftFilters.from === firstDay && draftFilters.to === today) return "month"
        const past30 = formatDateYMD(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000))
        if (draftFilters.from === past30 && draftFilters.to === today) return "30days"
        return "custom"
    }, [draftFilters.from, draftFilters.to])

    const handleApplyFilters = () => {
        setFilters(draftFilters)
        setCurrentPage(1)
        setIsFilterOpen(false)
    }

    const handleResetFilters = () => {
        const empty = { region: "all", from: "", to: "" }
        setDraftFilters(empty)
        setFilters(empty)
        setCurrentPage(1)
        setIsFilterOpen(false)
    }

    // Faqat haqiqiy API dan kelgan ko'rsatkichlar (hech qanday mock yo'q)
    const auditMetrics = useMemo(() => {
        const totalFarms = regResponse?.totalFarms ?? dashboard?.totalFarms ?? 0
        const activeFarms = dashboard?.activeFarms ?? 0
        const totalClients = dashboard?.totalClients ?? 0
        const totalOrders = dashboard?.totalOrders ?? 0
        const totalCouriers = dashboard?.totalCouriers ?? 0

        const totalFarmsNum = Number(totalFarms) || 0
        const activeFarmsNum = Number(activeFarms) || 0
        const totalClientsNum = Number(totalClients) || 0
        const totalOrdersNum = Number(totalOrders) || 0
        const totalCouriersNum = Number(totalCouriers) || 0

        const farmPercent = totalFarmsNum > 0 ? Math.min(100, Math.round((activeFarmsNum / totalFarmsNum) * 100)) : 0
        const clientsPercent = totalClientsNum > 0 ? Math.min(100, Math.round((totalClientsNum / Math.max(totalClientsNum, 50)) * 100)) : 0
        const ordersPercent = totalOrdersNum > 0 ? Math.min(100, Math.round((totalOrdersNum / Math.max(totalOrdersNum, 100)) * 100)) : 0
        const couriersPercent = totalCouriersNum > 0 ? Math.min(100, Math.round((totalCouriersNum / Math.max(totalCouriersNum, 20)) * 100)) : 0

        return [
            {
                id: 1,
                title: "JAMI FERMALAR",
                value: Number(totalFarms).toLocaleString("uz-UZ"),
                badge: `${activeFarms} ta faol`,
                description: "Viloyatlar kesimida faoliyat yurituvchi",
                icon: Tractor,
                percentage: farmPercent,
            },
            {
                id: 2,
                title: "FAOL MIJOZLAR BAZASI",
                value: `${Number(totalClients).toLocaleString("uz-UZ")} nafar`,
                badge: "Mijozlar",
                description: "Ro'yxatdan o'tgan iste'molchilar",
                icon: Users,
                percentage: clientsPercent,
            },
            {
                id: 3,
                title: "UMUMIY BUYURTMALAR",
                value: Number(totalOrders).toLocaleString("uz-UZ"),
                badge: "Jami",
                description: "Barcha fermalar bo'yicha",
                icon: BadgeCheck,
                percentage: ordersPercent,
            },
            {
                id: 4,
                title: "JAMI KURYERLAR",
                value: `${Number(totalCouriers).toLocaleString("uz-UZ")} nafar`,
                badge: "Tizimda",
                description: "Mahsulot yetkazib beruvchilar",
                icon: Gauge,
                percentage: couriersPercent,
            },
        ]
    }, [regResponse, dashboard])

    const totalPages = Math.max(1, Math.ceil(filteredRegionsList.length / ITEMS_PER_PAGE))
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE
        return filteredRegionsList.slice(start, start + ITEMS_PER_PAGE)
    }, [filteredRegionsList, currentPage])

    return (
        <section>
            <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-900 leading-normal">
                            Statistika va Platforma Tahlili
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            GidroGo tarmog'idagi fermalar, buyurtmalar oqimi va mijozlar dinamikasining umumiy tahliliy ko'rsatkichlari.
                        </p>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => refetchReg()}
                            disabled={isFetchingReg}
                            className="h-9 px-3.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold gap-2 cursor-pointer shadow-xs"
                        >
                            <RefreshCw className={`size-3.5 text-slate-500 transition-transform ${isFetchingReg ? "animate-spin" : ""}`} />
                            <span>Yangilash</span>
                        </Button>
                    </div>
                </div>

                {/* 4 ta KPI card */}
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4 pt-4">
                    {auditMetrics.map((audit) => {
                        const Icon = audit.icon

                        return (
                            <Card
                                key={audit.id}
                                className="border border-slate-200/80 rounded-xl p-3 sm:p-3.5 bg-white shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
                            >
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 pb-1">
                                    <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        {audit.title}
                                    </CardTitle>
                                    <div className="size-11 sm:size-12 rounded-full flex items-center justify-center shrink-0 border bg-blue-50 text-blue-600 border-blue-100/80 shadow-2xs">
                                        <Icon className="size-5.5 sm:size-6 text-blue-600" strokeWidth={1.75} />
                                    </div>
                                </CardHeader>

                                <CardContent className="p-0 pt-1.5">
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-xl sm:text-2xl font-bold text-slate-900">{audit.value}</span>
                                        {audit.badge && (
                                            <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-600 border border-blue-100">
                                                {audit.badge}
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-1 text-[11px] text-slate-500 truncate" title={audit.description}>
                                        {audit.description}
                                    </p>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                {/* Diagramma section */}
                <div className="mt-8">
                    <Suspense
                        fallback={
                            <div className="h-72 bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col items-center justify-center gap-2 text-slate-400">
                                <Spinner size="md" />
                                <span className="text-xs">Diagramma yuklanmoqda...</span>
                            </div>
                        }
                    >
                        <LineColumn dashboard={dashboard} />
                    </Suspense>
                </div>

                {/* Hududiy Taqsimot va Fermalar Faollik Matritsasi Table */}
                <div className="mt-8 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
                        <div>
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                                Hududiy Taqsimot va Fermalar Faollik Matritsasi
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Viloyatlar kesimida infratuzilma zichligi va buyurtmalar quvvati
                            </p>
                        </div>

                        {/* Interactive Filter Button & Popover */}
                        <div className="relative" ref={filterRef}>
                            <div className="flex items-center gap-2">
                                {activeFilterCount > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleResetFilters}
                                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
                                        title="Filtrlarni tozalash"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5" />
                                        <span className="hidden sm:inline">Tozalash</span>
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setDraftFilters(filters)
                                        setIsFilterOpen((prev) => !prev)
                                    }}
                                    aria-expanded={isFilterOpen}
                                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all shadow-2xs cursor-pointer ${
                                        activeFilterCount > 0
                                            ? "border-blue-300 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20"
                                            : "border-blue-100 bg-blue-50/60 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                                    }`}
                                >
                                    <Filter className="w-3.5 h-3.5" />
                                    <span>Filtrlash</span>
                                    {activeFilterCount > 0 && (
                                        <span className="size-4.5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </button>
                            </div>

                            {/* Dropdown Popover Modal */}
                            {isFilterOpen && (
                                <div className="absolute right-0 top-full mt-2.5 z-40 w-88 sm:w-[410px] bg-white rounded-2xl border border-slate-200/90 shadow-2xl shadow-slate-900/10 p-5 animate-in fade-in zoom-in-95 duration-150 ring-1 ring-slate-900/5">
                                    {/* Top decorative arrow */}
                                    <div className="absolute -top-1.5 right-6 size-3 bg-white border-t border-l border-slate-200/90 rotate-45 z-10" />

                                    {/* Modal Header */}
                                    <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                                        <div className="flex items-center gap-2.5">
                                            <div className="size-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/70 shadow-2xs">
                                                <Filter className="size-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900 tracking-tight leading-tight">
                                                    Jadvalni filtrlash
                                                </h4>
                                                <p className="text-[11px] text-slate-400 mt-0.5">
                                                    Viloyatlar va buyurtmalar davrini saralash
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setIsFilterOpen(false)}
                                            className="size-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer transition-colors"
                                        >
                                            <X className="size-4" />
                                        </button>
                                    </div>

                                    {/* Form Fields */}
                                    <div className="mt-4 space-y-4">
                                        {/* 1. Hudud tanlash */}
                                        <div>
                                            <label className="text-xs font-semibold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                                                <MapPin className="size-3.5 text-blue-600" />
                                                <span>Hudud / Viloyat</span>
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={draftFilters.region}
                                                    onChange={(e) =>
                                                        setDraftFilters((prev) => ({ ...prev, region: e.target.value }))
                                                    }
                                                    className="w-full h-10 pl-3.5 pr-9 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white focus:bg-white text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                                                >
                                                    <option value="all">Barcha hududlar</option>
                                                    {availableRegions.map((reg) => (
                                                        <option key={reg} value={reg}>
                                                            {reg}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="size-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                            </div>
                                        </div>

                                        {/* 2. Davr / Sana oralig'i */}
                                        <div>
                                            <label className="text-xs font-semibold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                                                <Calendar className="size-3.5 text-blue-600" />
                                                <span>Sana oralig'i</span>
                                            </label>

                                            {/* Segmented Quick Presets */}
                                            <div className="grid grid-cols-3 gap-1 bg-slate-100/80 p-1 rounded-xl mb-3">
                                                <button
                                                    type="button"
                                                    onClick={() => handleQuickDateSelect("all")}
                                                    className={`py-1.5 rounded-lg text-xs font-medium transition-all text-center cursor-pointer ${
                                                        activePreset === "all"
                                                            ? "bg-white text-blue-600 shadow-2xs font-semibold"
                                                            : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                                                    }`}
                                                >
                                                    Barchasi
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleQuickDateSelect("month")}
                                                    className={`py-1.5 rounded-lg text-xs font-medium transition-all text-center cursor-pointer ${
                                                        activePreset === "month"
                                                            ? "bg-white text-blue-600 shadow-2xs font-semibold"
                                                            : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                                                    }`}
                                                >
                                                    Shu oy
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleQuickDateSelect("30days")}
                                                    className={`py-1.5 rounded-lg text-xs font-medium transition-all text-center cursor-pointer ${
                                                        activePreset === "30days"
                                                            ? "bg-white text-blue-600 shadow-2xs font-semibold"
                                                            : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                                                    }`}
                                                >
                                                    Oxirgi 30 kun
                                                </button>
                                            </div>

                                            {/* 2 Date Pickers */}
                                            <div className="grid grid-cols-2 gap-2.5">
                                                <div>
                                                    <span className="text-[11px] font-medium text-slate-500 block mb-1">
                                                        Boshlanish sanasi
                                                    </span>
                                                    <input
                                                        type="date"
                                                        value={draftFilters.from}
                                                        onChange={(e) =>
                                                            setDraftFilters((prev) => ({ ...prev, from: e.target.value }))
                                                        }
                                                        className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white focus:bg-white text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                                                    />
                                                </div>
                                                <div>
                                                    <span className="text-[11px] font-medium text-slate-500 block mb-1">
                                                        Tugash sanasi
                                                    </span>
                                                    <input
                                                        type="date"
                                                        value={draftFilters.to}
                                                        onChange={(e) =>
                                                            setDraftFilters((prev) => ({ ...prev, to: e.target.value }))
                                                        }
                                                        className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white focus:bg-white text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Modal Actions */}
                                    <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                                        <button
                                            type="button"
                                            onClick={handleResetFilters}
                                            className="text-xs font-medium text-slate-500 hover:text-rose-600 transition-colors inline-flex items-center gap-1.5 py-1.5 px-2 rounded-lg hover:bg-rose-50 cursor-pointer"
                                        >
                                            <RotateCcw className="size-3.5" />
                                            <span>Tozalash</span>
                                        </button>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setIsFilterOpen(false)}
                                                className="h-9 px-3.5 rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium cursor-pointer shadow-2xs"
                                            >
                                                Bekor qilish
                                            </Button>
                                            <Button
                                                type="button"
                                                onClick={handleApplyFilters}
                                                className="h-9 px-4.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer shadow-xs transition-all inline-flex items-center gap-1.5"
                                            >
                                                <span>Qo'llash</span>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Table Container */}
                    <div className="mt-2 rounded-xl border border-slate-200/80 overflow-hidden">
                        <Table className="w-full">
                            <TableHeader className="bg-slate-50/80">
                                <TableRow className="border-b border-slate-200/80 hover:bg-transparent">
                                    <TableHead className="py-3.5 pl-6 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        HUDUD / VILOYAT
                                    </TableHead>
                                    <TableHead className="py-3.5 px-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                                        FERMALAR SONI (FAOL / ZAXIRA)
                                    </TableHead>
                                    <TableHead className="py-3.5 px-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                                        OYLIK BUYURTMALAR HAJMI
                                    </TableHead>
                                    <TableHead className="py-3.5 px-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                                        O'SISH KO'RSATKICHI
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-16 text-slate-500 text-sm">
                                            {isFetchingReg
                                                ? "Hududiy statistika yuklanmoqda..."
                                                : activeFilterCount > 0
                                                ? "Tanlangan filtrlar bo'yicha hech qanday hudud topilmadi."
                                                : "Hududiy statistika ma'lumotlari mavjud emas."}
                                            {activeFilterCount > 0 && !isFetchingReg && (
                                                <div className="mt-3">
                                                    <button
                                                        type="button"
                                                        onClick={handleResetFilters}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
                                                    >
                                                        <RotateCcw className="size-3 text-slate-500" />
                                                        <span>Filtrlarni tozalash</span>
                                                    </button>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedData.map((item) => (
                                        <TableRow
                                            key={item.id}
                                            className="hover:bg-slate-50/70 transition-colors border-b border-slate-100 last:border-b-0 h-16"
                                        >
                                            {/* 1. Hudud / Viloyat */}
                                            <TableCell className="py-3.5 pl-6 text-left align-middle">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs select-none">
                                                        {item.code}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="text-sm font-semibold text-slate-900 truncate">
                                                            {item.name}
                                                        </div>
                                                        <div className="text-xs text-slate-500 truncate mt-0.5">
                                                            {item.subtitle}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {/* 2. Fermalar soni (Faol / Zaxira) */}
                                            <TableCell className="py-3.5 px-4 text-left whitespace-nowrap align-middle">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-sm font-semibold text-slate-900">
                                                        {item.farmsActive} ta faol
                                                    </span>
                                                    {item.farmsBackup > 0 && (
                                                        <span className="text-xs text-slate-400">
                                                            / {item.farmsBackup} zaxira
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>

                                            {/* 3. Oylik buyurtmalar hajmi */}
                                            <TableCell className="py-3.5 px-4 text-left whitespace-nowrap align-middle">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                                                    {item.monthlyOrders}
                                                </span>
                                            </TableCell>

                                            {/* 4. O'sish ko'rsatkichi */}
                                            <TableCell className="py-3.5 px-4 text-left whitespace-nowrap align-middle">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                    {item.growthRate}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {filteredRegionsList.length > 0 && (
                        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                            <div>
                                Jami <span className="font-semibold text-slate-800">{filteredRegionsList.length}</span> ta hududdan{" "}
                                <span className="font-semibold text-slate-800">
                                    {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
                                    {Math.min(currentPage * ITEMS_PER_PAGE, filteredRegionsList.length)}
                                </span> ko'rsatilmoqda
                            </div>

                            {totalPages > 1 && (
                                <TablePagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default StatistikaPage
