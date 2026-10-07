import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { LineColumn } from "@/widgets"
import { Button, Card, CardContent, CardHeader, CardTitle, TablePagination } from "@/shared/ui"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/shared/ui/table"
import { Filter, Tractor, Users, BadgeCheck, Gauge, Star, ChevronRight, RefreshCw } from "lucide-react"
import { useRegionalStatistics, useSuperAdminDashboard } from "@/shared/hooks"


export const MOCK_AUDIT_METRICS_CARDS = [
    {
        id: 1,
        title: "YANGI QO'SHILGAN FERMALAR",
        value: "+4 ta",
        badge: "+25%",
        description: "O'tgan oyga nisbatan barqaror",
        icon: Tractor,
    },
    {
        id: 2,
        title: "FAOL MIJOZLAR OYLIK BAZASI",
        value: "68,420",
        unit: "nafar",
        badge: "+12%",
        description: "Faol buyurtma beruvchi iste'molchilar",
        icon: Users,
    },
    {
        id: 3,
        title: "MUVAFFAQIYATLI YETKAZISH",
        value: "97.8%",
        badge: "SLA Norm",
        description: "O'rtacha yetkazish vaqti: 38 min",
        icon: BadgeCheck,
    },
    {
        id: 4,
        title: "TIZIM TALAB DARAJASI (PEAK)",
        value: "1,840",
        unit: "buyurtma/soat",
        description: "Server hisoblash yuklanishi: 45%",
        icon: Gauge,
    },
];

export const MOCK_HUDUDIY_TAQSIMOT = [
    {
        id: "tsh",
        code: "TSH",
        name: "Toshkent shahri",
        subtitle: "Markaziy Aglomeratsiya",
        farmsActive: 18,
        farmsBackup: 3,
        monthlyOrders: "58,240 kapsula",
        rating: 4.9,
        reviewCount: "18.4k baho",
        growthRate: "+18%",
        leadFarm: "Toshkent Eko Gidro",
    },
    {
        id: "sam",
        code: "SAM",
        name: "Samarqand viloyati",
        subtitle: "G'arbiy Hub",
        farmsActive: 12,
        farmsBackup: 2,
        monthlyOrders: "32,910 kapsula",
        rating: 4.8,
        reviewCount: "9.1k baho",
        growthRate: "+24%",
        leadFarm: "Zarafshon Agro Gidro",
    },
    {
        id: "far",
        code: "FAR",
        name: "Farg'ona viloyati",
        subtitle: "Sharqiy Voha",
        farmsActive: 10,
        farmsBackup: 1,
        monthlyOrders: "24,180 kapsula",
        rating: 4.8,
        reviewCount: "7.4k baho",
        growthRate: "+22%",
        leadFarm: "Vodiy Yashil Agro",
    },
    {
        id: "and",
        code: "AND",
        name: "Andijon viloyati",
        subtitle: "Aholi Zich Hudud",
        farmsActive: 9,
        farmsBackup: 2,
        monthlyOrders: "19,850 kapsula",
        rating: 4.9,
        reviewCount: "6.2k baho",
        growthRate: "+16%",
        leadFarm: "Andijon Fresh Plant",
    },
    {
        id: "qas",
        code: "QAS",
        name: "Qashqadaryo viloyati",
        subtitle: "Janubiy Sektor",
        farmsActive: 7,
        farmsBackup: 1,
        monthlyOrders: "14,320 kapsula",
        rating: 4.7,
        reviewCount: "4.1k baho",
        growthRate: "+12%",
        leadFarm: "Oazis Gidroponika",
    },
    {
        id: "bux",
        code: "BUX",
        name: "Buxoro viloyati",
        subtitle: "Ekoturizm & Sanoat",
        farmsActive: 6,
        farmsBackup: 1,
        monthlyOrders: "11,200 kapsula",
        rating: 4.8,
        reviewCount: "3.8k baho",
        growthRate: "+14%",
        leadFarm: "Buxoro Sahro Yashilzor",
    },
    {
        id: "nam",
        code: "NAM",
        name: "Namangan viloyati",
        subtitle: "Gullarning Makoni",
        farmsActive: 6,
        farmsBackup: 1,
        monthlyOrders: "10,840 kapsula",
        rating: 4.8,
        reviewCount: "3.5k baho",
        growthRate: "+15%",
        leadFarm: "Namangan AgroSmart",
    },
    {
        id: "xor",
        code: "XOR",
        name: "Xorazm viloyati",
        subtitle: "Shimoliy Voha",
        farmsActive: 5,
        farmsBackup: 1,
        monthlyOrders: "9,450 kapsula",
        rating: 4.7,
        reviewCount: "2.9k baho",
        growthRate: "+11%",
        leadFarm: "Xorazm Oltin Gidro",
    },
];

const StatistikaPage = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 4

    const { data: regData, isFetching: isFetchingReg, refetch: refetchReg } = useRegionalStatistics()
    const { data: dashData } = useSuperAdminDashboard()

    const regResponse = regData?.data || regData
    const dashboard = useMemo(() => dashData?.data || dashData || {}, [dashData])

    const regionsList = useMemo(() => {
        if (Array.isArray(regResponse?.regions) && regResponse.regions.length > 0) {
            return regResponse.regions.map((r, idx) => ({
                id: `reg-${idx}`,
                code: (r.regionName || r.name || "HUD").slice(0, 3).toUpperCase(),
                name: r.regionName || r.name || "Hudud",
                subtitle: r.formattedText || `${r.count ?? r.value ?? 0} ta ferma`,
                farmsActive: r.count ?? r.value ?? 0,
                farmsBackup: 0,
                monthlyOrders: `${r.percentage ?? 0}% ulush`,
                rating: 4.8,
                reviewCount: "baho",
                growthRate: `${r.percentage ?? 0}%`,
                leadFarm: r.regionName || "Hududiy ferma",
            }))
        }
        return MOCK_HUDUDIY_TAQSIMOT
    }, [regResponse])

    const auditMetrics = useMemo(() => {
        return [
            {
                id: 1,
                title: "JAMI FERMALAR",
                value: regResponse?.totalFarms ?? dashboard?.totalFarms ?? 24,
                badge: `${dashboard?.activeFarms ?? 0} ta faol`,
                description: "Viloyatlar kesimida faoliyat yurituvchi",
                icon: Tractor,
            },
            {
                id: 2,
                title: "FAOL MIJOZLAR BAZASI",
                value: dashboard?.totalClients ? Number(dashboard.totalClients).toLocaleString("uz-UZ") : "48,620",
                unit: "nafar",
                badge: "+12%",
                description: "Ro'yxatdan o'tgan iste'molchilar",
                icon: Users,
            },
            {
                id: 3,
                title: "UMUMIY BUYURTMALAR",
                value: dashboard?.totalOrders ? Number(dashboard.totalOrders).toLocaleString("uz-UZ") : "14,850",
                badge: "Faol",
                description: "Barcha fermalar bo'yicha",
                icon: BadgeCheck,
            },
            {
                id: 4,
                title: "JAMI KURYERLAR",
                value: dashboard?.totalCouriers ?? 18,
                unit: "nafar",
                badge: "Tizimda",
                description: "Mahsulot yetkazib beruvchilar",
                icon: Gauge,
            },
        ]
    }, [regResponse, dashboard])

    const totalPages = Math.ceil(regionsList.length / itemsPerPage)
    const paginatedData = regionsList.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )



    return (
        <section>
            <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-900 leading-normal">Statistika va Platforma Tahlili</h2>
                        <p className="text-sm text-slate-500 mt-1">GidroGo tarmog'idagi fermalar, buyurtmalar oqimi va mijozlar dinamikasining umumiy tahliliy ko'rsatkichlari.</p>
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

                {/* 4 ta card */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-6">
                    {auditMetrics.map((audit) => {
                        const Icon = audit.icon

                        return (
                            <Card key={audit.id} className="shadow-xs border border-slate-200/80 rounded-2xl p-5 bg-white">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 pb-2">
                                    <CardTitle className="text-xs font-medium uppercase tracking-wider text-slate-500">
                                        {audit.title}
                                    </CardTitle>
                                    <div className="size-9 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200/80 text-slate-600 shrink-0">
                                        <Icon className="size-4.5" />
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
                                    <p className="mt-1 text-xs text-gray-500">
                                        {audit.description}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
                {/*diagramma section */}
                <div className="mt-8">
                    <LineColumn dashboard={dashboard} />
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

                    {/* Table Container - toza, standart va overflow-x-auto bilan himoyalangan */}
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
                                        O'RTACHA REYTING
                                    </TableHead>
                                    <TableHead className="py-3.5 px-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                                        O'SISH KO'RSATKICHI
                                    </TableHead>
                                    <TableHead className="py-3.5 px-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                                        AMALLAR
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedData.map((item) => (
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
                                                <span className="text-xs text-slate-400">
                                                    / {item.farmsBackup} zaxira
                                                </span>
                                            </div>
                                        </TableCell>

                                        {/* 3. Oylik buyurtmalar hajmi */}
                                        <TableCell className="py-3.5 px-4 text-left whitespace-nowrap align-middle">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                                                {item.monthlyOrders}
                                            </span>
                                        </TableCell>

                                        {/* 4. O'rtacha reyting */}
                                        <TableCell className="py-3.5 px-4 text-left whitespace-nowrap align-middle">
                                            <div className="flex items-center gap-1.5 text-xs">
                                                <Star className="size-3.5 text-amber-500 fill-amber-500 shrink-0" />
                                                <span className="font-bold text-slate-900">
                                                    {item.rating}
                                                </span>
                                                <span className="text-slate-400">
                                                    ({item.reviewCount})
                                                </span>
                                            </div>
                                        </TableCell>

                                        {/* 5. O'sish ko'rsatkichi */}
                                        <TableCell className="py-3.5 px-4 text-left whitespace-nowrap align-middle">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                {item.growthRate}
                                            </span>
                                        </TableCell>

                                        {/* 6. Amallar */}
                                        <TableCell className="py-3.5 px-4 text-center whitespace-nowrap align-middle">
                                            <Link
                                                to="/super-admin/fermalar"
                                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 transition-colors cursor-pointer shadow-2xs"
                                            >
                                                <span>Fermalar</span>
                                                <ChevronRight className="size-3" />
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                        <div>
                            Jami <span className="font-semibold text-slate-800">{regionsList.length}</span> ta hududdan{" "}
                            <span className="font-semibold text-slate-800">
                                {(currentPage - 1) * itemsPerPage + 1} -{" "}
                                {Math.min(currentPage * itemsPerPage, regionsList.length)}
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
                </div>
            </div>
        </section>
    )
}

export default StatistikaPage
