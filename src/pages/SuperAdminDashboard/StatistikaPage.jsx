import { useState } from "react"
import { Link } from "react-router-dom"
import { LineColumn } from "@/widgets"
import { Button, Card, CardContent, CardHeader, CardTitle, Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from "@/shared/ui"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/shared/ui/table"
import { Download, Tractor, Users, BadgeCheck, Gauge, Filter, Star, ChevronRight } from "lucide-react"


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

    const totalPages = Math.ceil(MOCK_HUDUDIY_TAQSIMOT.length / itemsPerPage)
    const paginatedData = MOCK_HUDUDIY_TAQSIMOT.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const getPageNumbers = () => {
        const pages = []
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, "ellipsis-end", totalPages)
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, "ellipsis-start", totalPages - 2, totalPages - 1, totalPages)
            } else {
                pages.push(1, "ellipsis-start", currentPage, "ellipsis-end", totalPages)
            }
        }
        return pages
    }

    return (
        <section>
            <div>
                <div className="flex items-center  justify-between">
                    <div>
                        <h2 className="font-bold  leading-normal">Statistika va Platforma Tahlili.</h2>
                        <p>GidroGo tarmog'idagi fermalar, buyurtmalar oqimi va mijozlar dinamikasining umumiy tahliliy ko'rsatkichlari.</p>
                    </div>
                    <div>
                        <Button type="button">
                            <span><Download /></span> hisobotni yuklash
                        </Button>
                    </div>
                </div>
                {/* mock data 4 ta card uchun  */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-12">
                    {MOCK_AUDIT_METRICS_CARDS.map((audit) => {
                        const Icon = audit.icon;

                        return (
                            <Card key={audit.id} className="shadow-sm">
                                {/* Sarlavha va ikonkani yonma-yon qilish uchun flex va justify-between */}
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-xs font-medium uppercase tracking-wider text-gray-500">
                                        {audit.title}
                                    </CardTitle>
                                    <div className="flex items-center justify-center rounded-full bg-blue-50 p-2 text-blue-600 shrink-0">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                </CardHeader>

                                <CardContent className="pt-2">
                                    {/* Qiymat va Badge */}
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-bold text-gray-900">{audit.value}</span>
                                        {audit.badge && (
                                            <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600">
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
                    <LineColumn />
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

                    {/* Table Container - to'liq sig'adigan va qimirlamaydigan fixed jadval */}
                    <div className="w-full overflow-hidden">
                        <Table className="w-full table-fixed">
                            <TableHeader className="bg-slate-50/80 border-y border-slate-200/80">
                                <TableRow className="hover:bg-transparent border-none">
                                    <TableHead className="py-3.5 px-3 text-xs font-semibold text-slate-700 uppercase tracking-wider text-center w-[22%] align-middle">
                                        HUDUD / VILOYAT
                                    </TableHead>
                                    <TableHead className="py-3.5 px-2 text-xs font-semibold text-slate-700 uppercase tracking-wider text-center w-[20%] align-middle leading-tight">
                                        <div>FERMALAR SONI</div>
                                        <div className="text-[10px] text-slate-400 font-normal mt-0.5">(FAOL / ZAXIRA)</div>
                                    </TableHead>
                                    <TableHead className="py-3.5 px-2 text-xs font-semibold text-slate-700 uppercase tracking-wider text-center w-[18%] align-middle leading-tight">
                                        <div>OYLIK BUYURTMALAR</div>
                                        <div className="text-[10px] text-slate-400 font-normal mt-0.5">HAJMI</div>
                                    </TableHead>
                                    <TableHead className="py-3.5 px-2 text-xs font-semibold text-slate-700 uppercase tracking-wider text-center w-[14%] align-middle leading-tight">
                                        O'RTACHA REYTING
                                    </TableHead>
                                    <TableHead className="py-3.5 px-2 text-xs font-semibold text-slate-700 uppercase tracking-wider text-center w-[12%] align-middle leading-tight">
                                        O'SISH KO'RSATKICHI
                                    </TableHead>
                                    <TableHead className="py-3.5 px-3 text-xs font-semibold text-slate-700 uppercase tracking-wider text-center w-[14%] align-middle">
                                        AMALLAR
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedData.map((item) => (
                                    <TableRow
                                        key={item.id}
                                        className="hover:bg-slate-50/70 transition-colors border-b border-slate-100 last:border-b-0"
                                    >
                                        {/* 1. Hudud / Viloyat */}
                                        <TableCell className="py-3.5 px-3 text-center">
                                            <div className="flex items-center justify-center gap-2.5">
                                                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                                                    {item.code}
                                                </div>
                                                <div className="text-left min-w-0">
                                                    <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                                                        {item.name}
                                                    </div>
                                                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                                                        {item.subtitle}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* 2. Fermalar soni (Faol / Zaxira) */}
                                        <TableCell className="py-3.5 px-3 text-center">
                                            <div className="flex items-center justify-center gap-1.5 whitespace-nowrap">
                                                <span className="text-xs font-bold text-blue-700">
                                                    {item.farmsActive} ta faol
                                                </span>
                                                <span className="text-xs text-slate-400">
                                                    / {item.farmsBackup} zaxira
                                                </span>
                                            </div>
                                        </TableCell>

                                        {/* 3. Oylik buyurtmalar hajmi */}
                                        <TableCell className="py-3.5 px-3 text-center">
                                            <div className="flex items-center justify-center">
                                                <span className="inline-block bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-md text-xs whitespace-nowrap">
                                                    {item.monthlyOrders}
                                                </span>
                                            </div>
                                        </TableCell>

                                        {/* 4. O'rtacha reyting */}
                                        <TableCell className="py-3.5 px-3 text-center">
                                            <div className="flex items-center justify-center gap-1 text-xs whitespace-nowrap">
                                                <Star className="w-3.5 h-3.5 text-blue-600 fill-blue-600 shrink-0" />
                                                <span className="font-bold text-slate-800">
                                                    {item.rating}
                                                </span>
                                                <span className="text-slate-400 text-[11px]">
                                                    ({item.reviewCount})
                                                </span>
                                            </div>
                                        </TableCell>

                                        {/* 5. O'sish ko'rsatkichi */}
                                        <TableCell className="py-3.5 px-3 text-center">
                                            <div className="flex items-center justify-center">
                                                <span className="text-xs font-bold text-blue-700 whitespace-nowrap">
                                                    {item.growthRate}
                                                </span>
                                            </div>
                                        </TableCell>

                                        {/* 6. Amallar (Haqiqiy ferma va havola) */}
                                        <TableCell className="py-3.5 px-3 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <span className="text-xs font-semibold text-slate-800 truncate max-w-full block" title={item.leadFarm}>
                                                    {item.leadFarm}
                                                </span>
                                                <Link
                                                    to="/super-admin/fermalar"
                                                    className="text-[11px] font-medium text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-0.5 mt-0.5 cursor-pointer"
                                                >
                                                    <span>Fermalar</span>
                                                    <ChevronRight className="w-3 h-3" />
                                                </Link>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Pagination (Table dan tashqarida alohida) */}
                <div className="pt-4 pb-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                    <div>
                        Jami <span className="font-semibold text-slate-800">{MOCK_HUDUDIY_TAQSIMOT.length}</span> ta hududdan{" "}
                        <span className="font-semibold text-slate-800">
                            {(currentPage - 1) * itemsPerPage + 1} -{" "}
                            {Math.min(currentPage * itemsPerPage, MOCK_HUDUDIY_TAQSIMOT.length)}
                        </span> ko'rsatilmoqda
                    </div>

                    {totalPages > 1 && (
                        <Pagination className="mx-0 w-auto justify-end">
                            <PaginationContent className="bg-white p-1 rounded-2xl border border-slate-200/80 shadow-xs">
                                <PaginationItem>
                                    <PaginationPrevious
                                        text="Oldingi"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            if (currentPage > 1) setCurrentPage((p) => p - 1)
                                        }}
                                        className={`cursor-pointer ${
                                            currentPage === 1 ? "pointer-events-none opacity-40" : "hover:bg-slate-100"
                                        }`}
                                    />
                                </PaginationItem>

                                {getPageNumbers().map((pageItem, index) => {
                                    if (pageItem === "ellipsis-start" || pageItem === "ellipsis-end") {
                                        return (
                                            <PaginationItem key={`${pageItem}-${index}`}>
                                                <PaginationEllipsis />
                                            </PaginationItem>
                                        )
                                    }
                                    return (
                                        <PaginationItem key={pageItem}>
                                            <PaginationLink
                                                isActive={currentPage === pageItem}
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    setCurrentPage(pageItem)
                                                }}
                                                className={`cursor-pointer rounded-xl font-medium ${
                                                    currentPage === pageItem
                                                        ? "bg-[#1670FF]! text-white! border-transparent! shadow-xs"
                                                        : "hover:bg-slate-100 text-slate-700"
                                                }`}
                                            >
                                                {pageItem}
                                            </PaginationLink>
                                        </PaginationItem>
                                    )
                                })}

                                <PaginationItem>
                                    <PaginationNext
                                        text="Keyingi"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            if (currentPage < totalPages) setCurrentPage((p) => p + 1)
                                        }}
                                        className={`cursor-pointer ${
                                            currentPage === totalPages ? "pointer-events-none opacity-40" : "hover:bg-slate-100"
                                        }`}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}
                </div>
            </div>
        </section>
    )
}

export default StatistikaPage
