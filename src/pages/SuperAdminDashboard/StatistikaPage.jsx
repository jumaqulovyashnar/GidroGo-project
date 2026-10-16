import { useState, useMemo, lazy, Suspense } from "react"
import { Button, Card, CardContent, CardHeader, CardTitle, TablePagination, Spinner } from "@/shared/ui"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/shared/ui/table"
import { Filter, Tractor, Users, BadgeCheck, Gauge, RefreshCw } from "lucide-react"
import { useRegionalStatistics, useSuperAdminDashboard } from "@/shared/hooks"

const LineColumn = lazy(() => import("@/widgets").then((m) => ({ default: m.LineColumn })))

const ITEMS_PER_PAGE = 8

export const StatistikaPage = () => {
    const [currentPage, setCurrentPage] = useState(1)

    const { data: regData, isFetching: isFetchingReg, refetch: refetchReg } = useRegionalStatistics()
    const { data: dashData } = useSuperAdminDashboard()

    const regResponse = regData?.data || regData
    const dashboard = useMemo(() => dashData?.data || dashData || {}, [dashData])

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

    // Faqat haqiqiy API dan kelgan ko'rsatkichlar (hech qanday mock yo'q)
    const auditMetrics = useMemo(() => {
        const totalFarms = regResponse?.totalFarms ?? dashboard?.totalFarms ?? 0
        const activeFarms = dashboard?.activeFarms ?? 0
        const totalClients = dashboard?.totalClients ?? 0
        const totalOrders = dashboard?.totalOrders ?? 0
        const totalCouriers = dashboard?.totalCouriers ?? 0

        return [
            {
                id: 1,
                title: "JAMI FERMALAR",
                value: Number(totalFarms).toLocaleString("uz-UZ"),
                badge: `${activeFarms} ta faol`,
                description: "Viloyatlar kesimida faoliyat yurituvchi",
                icon: Tractor,
            },
            {
                id: 2,
                title: "FAOL MIJOZLAR BAZASI",
                value: Number(totalClients).toLocaleString("uz-UZ"),
                unit: "nafar",
                badge: "Mijozlar",
                description: "Ro'yxatdan o'tgan iste'molchilar",
                icon: Users,
            },
            {
                id: 3,
                title: "UMUMIY BUYURTMALAR",
                value: Number(totalOrders).toLocaleString("uz-UZ"),
                badge: "Jami",
                description: "Barcha fermalar bo'yicha",
                icon: BadgeCheck,
            },
            {
                id: 4,
                title: "JAMI KURYERLAR",
                value: Number(totalCouriers).toLocaleString("uz-UZ"),
                unit: "nafar",
                badge: "Tizimda",
                description: "Mahsulot yetkazib beruvchilar",
                icon: Gauge,
            },
        ]
    }, [regResponse, dashboard])

    const totalPages = Math.max(1, Math.ceil(regionsList.length / ITEMS_PER_PAGE))
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE
        return regionsList.slice(start, start + ITEMS_PER_PAGE)
    }, [regionsList, currentPage])

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
                <div className="grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 pt-6">
                    {auditMetrics.map((audit, index) => {
                        const Icon = audit.icon
                        const isBlue = index % 2 === 0

                        return (
                            <Card
                                key={audit.id}
                                className="border border-slate-200/80 rounded-2xl p-5 sm:p-6 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.05)] transition-all duration-200 flex flex-col justify-between"
                            >
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 pb-2">
                                    <CardTitle className="text-xs font-medium uppercase tracking-wider text-slate-500">
                                        {audit.title}
                                    </CardTitle>
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border ${
                                            isBlue
                                                ? "bg-blue-50 text-blue-600 border-blue-100/80"
                                                : "bg-slate-100 text-slate-600 border-slate-200/80"
                                        }`}
                                    >
                                        <Icon className="size-5.5" strokeWidth={1.75} />
                                    </div>
                                </CardHeader>

                                <CardContent className="p-0 pt-2">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-extrabold text-slate-900">{audit.value}</span>
                                        {audit.unit && (
                                            <span className="text-xs font-medium text-slate-500">{audit.unit}</span>
                                        )}
                                        {audit.badge && (
                                            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600 border border-blue-100">
                                                {audit.badge}
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-1 text-xs text-slate-500">
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
                        <div>
                            <button
                                type="button"
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-blue-100 bg-blue-50/60 text-xs font-semibold text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-colors shadow-2xs cursor-pointer"
                            >
                                <Filter className="w-3.5 h-3.5" />
                                <span>Filtrlash</span>
                            </button>
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
                                                : "Hududiy statistika ma'lumotlari mavjud emas."}
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
                    {regionsList.length > 0 && (
                        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                            <div>
                                Jami <span className="font-semibold text-slate-800">{regionsList.length}</span> ta hududdan{" "}
                                <span className="font-semibold text-slate-800">
                                    {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
                                    {Math.min(currentPage * ITEMS_PER_PAGE, regionsList.length)}
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
