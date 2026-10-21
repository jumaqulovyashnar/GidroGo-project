import { useState, useMemo, lazy, Suspense } from "react"
import { Modal as MantineModal } from "@mantine/core"
import { Button, Card, CardHeader, CardTitle, CardContent, TablePagination, Spinner } from "@/shared/ui"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/shared/ui/table"
import { Filter, Tractor, Users, BadgeCheck, Gauge, RefreshCw, Calendar, MapPin, RotateCcw } from "lucide-react"
import { useRegionalStatistics, useSuperAdminDashboard } from "@/shared/hooks"
import { cn } from "@/shared/lib"

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
    const [selectedPreset, setSelectedPreset] = useState("all")

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
        setSelectedPreset(type)
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

    const handleApplyFilters = () => {
        setFilters(draftFilters)
        setCurrentPage(1)
        setIsFilterOpen(false)
    }

    const handleResetFilters = () => {
        const empty = { region: "all", from: "", to: "" }
        setDraftFilters(empty)
        setFilters(empty)
        setSelectedPreset("all")
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
                                    <p className="mt-1 text-[11px] text-slate-500 leading-normal" title={audit.description}>
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

                        {/* Filter Trigger Button */}
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
                                    setIsFilterOpen(true)
                                }}
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
                    </div>

                    {/* Centered Filter Modal (MantineModal) */}
                    <MantineModal
                        opened={isFilterOpen}
                        onClose={() => setIsFilterOpen(false)}
                        title={
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 shadow-2xs">
                                    <Filter className="size-5 stroke-2 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                                        Statistikani Filtrlash
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Hududlar va buyurtmalar davrini saralash
                                    </p>
                                </div>
                            </div>
                        }
                        size="540px"
                        centered
                        radius="xl"
                        styles={{
                            content: {
                                borderRadius: "24px",
                                border: "1px solid #e2e8f0",
                                boxShadow: "0 25px 60px -15px rgba(15, 23, 42, 0.2)",
                            },
                            header: {
                                borderBottom: "1px solid #f1f5f9",
                                padding: "20px 24px",
                                backgroundColor: "#ffffff",
                            },
                            body: {
                                padding: "24px",
                            },
                        }}
                    >
                        <div className="space-y-5">
                            {/* 1. Hudud tanlash (Chips / Pills) */}
                            <div>
                                <label className="text-xs font-bold text-slate-700 block mb-2.5 flex items-center gap-1.5">
                                    <MapPin className="size-4 text-blue-600" />
                                    <span>Hudud / Viloyat</span>
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setDraftFilters((prev) => ({ ...prev, region: "all" }))}
                                        className={cn(
                                            "px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border",
                                            draftFilters.region === "all"
                                                ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                                                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                                        )}
                                    >
                                        Barchasi
                                    </button>
                                    {availableRegions.map((reg) => (
                                        <button
                                            key={reg}
                                            type="button"
                                            onClick={() => setDraftFilters((prev) => ({ ...prev, region: reg }))}
                                            className={cn(
                                                "px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border",
                                                draftFilters.region === reg
                                                    ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                                                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                                            )}
                                        >
                                            {reg}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 2. Davr / Sana oralig'i */}
                            <div>
                                <label className="text-xs font-bold text-slate-700 block mb-2 flex items-center gap-1.5">
                                    <Calendar className="size-4 text-blue-600" />
                                    <span>Sana oralig'i (Davr)</span>
                                </label>

                                {/* Quick Preset Tabs */}
                                <div className="grid grid-cols-3 gap-1.5 bg-slate-100/90 p-1.5 rounded-xl mb-3.5">
                                    <button
                                        type="button"
                                        onClick={() => handleQuickDateSelect("all")}
                                        className={cn(
                                            "py-2 rounded-lg text-xs font-semibold transition-all text-center cursor-pointer",
                                            selectedPreset === "all"
                                                ? "bg-white text-blue-600 shadow-2xs"
                                                : "text-slate-600 hover:text-slate-900"
                                        )}
                                    >
                                        Barcha davr
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleQuickDateSelect("month")}
                                        className={cn(
                                            "py-2 rounded-lg text-xs font-semibold transition-all text-center cursor-pointer",
                                            selectedPreset === "month"
                                                ? "bg-white text-blue-600 shadow-2xs"
                                                : "text-slate-600 hover:text-slate-900"
                                        )}
                                    >
                                        Shu oy
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleQuickDateSelect("30days")}
                                        className={cn(
                                            "py-2 rounded-lg text-xs font-semibold transition-all text-center cursor-pointer",
                                            selectedPreset === "30days"
                                                ? "bg-white text-blue-600 shadow-2xs"
                                                : "text-slate-600 hover:text-slate-900"
                                        )}
                                    >
                                        Oxirgi 30 kun
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <span className="text-xs font-medium text-slate-600 block mb-1.5">
                                            Boshlanish sanasi
                                        </span>
                                        <input
                                            type="date"
                                            value={draftFilters.from}
                                            onChange={(e) => {
                                                setDraftFilters((prev) => ({ ...prev, from: e.target.value }))
                                                setSelectedPreset("custom")
                                            }}
                                            className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                                        />
                                    </div>
                                    <div>
                                        <span className="text-xs font-medium text-slate-600 block mb-1.5">
                                            Tugash sanasi
                                        </span>
                                        <input
                                            type="date"
                                            value={draftFilters.to}
                                            onChange={(e) => {
                                                setDraftFilters((prev) => ({ ...prev, to: e.target.value }))
                                                setSelectedPreset("custom")
                                            }}
                                            className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer Actions */}
                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                                <button
                                    type="button"
                                    onClick={handleResetFilters}
                                    className="text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors inline-flex items-center gap-1.5 py-2 px-3 rounded-xl hover:bg-rose-50 cursor-pointer"
                                >
                                    <RotateCcw className="size-3.5" />
                                    <span>Tozalash</span>
                                </button>
                                <div className="flex items-center gap-2.5">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsFilterOpen(false)}
                                        className="h-10 px-4 rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium cursor-pointer shadow-2xs"
                                    >
                                        Bekor qilish
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={handleApplyFilters}
                                        className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold cursor-pointer shadow-xs transition-all inline-flex items-center gap-2"
                                    >
                                        <span>Filtrni qo'llash</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </MantineModal>

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
                    {totalPages > 1 && (
                        <TablePagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            className="pt-6 pb-2"
                        />
                    )}
                </div>
            </div>
        </section>
    )
}

export default StatistikaPage
