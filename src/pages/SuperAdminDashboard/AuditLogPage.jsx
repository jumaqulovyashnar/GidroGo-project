import { useState, useRef, useEffect, useMemo } from "react"
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis, Spinner } from "@/shared/ui"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/shared/ui/table"
import { ChevronDown, Upload, RotateCw, Calendar, History, ShieldCheck, ListFilter, ShieldAlert, Search } from "lucide-react"
import { useAuditLogs } from "@/shared/hooks"

const ACTION_OPTIONS = [
    { value: "all", label: "Amal turi: Barchasi" },
    { value: "tasdiqlash", label: "Fermani tasdiqlash" },
    { value: "bloklash", label: "Fermani bloklash" },
    { value: "boss tasdiqlash", label: "Bossni tasdiqlash" },
    { value: "rad etish", label: "Bossni rad etish" },
    { value: "sozlama", label: "Sozlamani o'zgartirish" },
    { value: "api", label: "API kalit yangilash" },
]

const OBJECT_OPTIONS = [
    { value: "all", label: "Obyekt: Barchasi" },
    { value: "ferma", label: "Ferma" },
    { value: "boss", label: "Boss" },
    { value: "tizim", label: "Tizim" },
    { value: "xavfsizlik", label: "Xavfsizlik" },
]

const ADMIN_OPTIONS = [
    { value: "all", label: "SuperAdmin: Barchasi" },
    { value: "azizbek", label: "Azizbek Rahimov (ROOT)" },
    { value: "sardor", label: "Sardor Aliyev (Security)" },
]

// Chiroyli zamonaviy dizayndagi ochiladigan Dropdown komponenti
const CustomDropdown = ({ value, onChange, options }) => {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const selectedOption = options.find((o) => o.value === value) || options[0]

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between gap-2.5 shadow-xs transition-colors cursor-pointer w-full md:w-auto min-w-42.5"
            >
                <span className="truncate">{selectedOption.label}</span>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${open ? "rotate-180 text-blue-600" : ""}`} />
            </button>

            {open && (
                <div className="absolute right-0 md:left-0 mt-1.5 w-56 bg-white rounded-xl border border-slate-200 shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    {options.map((opt) => (
                        <div
                            key={opt.value}
                            onClick={() => {
                                onChange(opt.value)
                                setOpen(false)
                            }}
                            className={`px-3 py-2 text-xs font-medium rounded-lg cursor-pointer transition-colors flex items-center justify-between ${
                                value === opt.value
                                    ? "bg-blue-50 text-blue-600 font-semibold"
                                    : "text-slate-700 hover:bg-slate-100"
                            }`}
                        >
                            <span>{opt.label}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

const MOCK_AUDIT_METRICS_CARDS = [
    {
        id: "total-actions",
        title: "JAMI AMALLAR",
        value: "1,428",
        unit: "ta qayd",
        badge: "+8.4%",
        subtitle: "oxirgi 30 kunda",
        icon: History,
    },
    {
        id: "security-risks",
        title: "XAVFSIZLIK XAVFI",
        value: "0",
        unit: "kritik hodisa",
        badge: "STABLE",
        subtitle: "Tizim holati barqaror",
        icon: ShieldCheck,
    },
    {
        id: "approvals",
        title: "TASDIQLASHLAR",
        value: "14",
        unit: "amaliyot",
        badge: null,
        subtitle: "Farm & Boss verifikatsiyalari",
        icon: ListFilter,
    },
    {
        id: "settings-permissions",
        title: "SOZLAMALAR & HUQUQ",
        value: "6",
        unit: "o'zgarish",
        badge: null,
        subtitle: "SMS Gateway & API rotatsiyasi",
        icon: ShieldAlert,
    },
]

const MOCK_AUDIT_LOGS = [
    {
        id: "log-001",
        time: "15:42:10",
        date: "24-Apr-2025",
        dayLabel: "Bugun",
        admin: {
            name: "Azizbek Rahimov",
            role: "ROOT",
            avatarText: "AR",
        },
        action: {
            label: "Ferma tasdiqlandi",
            badgeClass: "bg-blue-600 text-white",
        },
        target: {
            name: "Chashma Pure Water MCHJ",
            code: "#FRM-9021",
            codeClass: "text-blue-600",
        },
        clientInfo: {
            ip: "195.158.24.12",
            device: "Chrome / macOS",
        },
        description: "Sanitariya litsenziyasi to'liq tekshirildi va tasdiqlandi",
    },
    {
        id: "log-002",
        time: "11:20:05",
        date: "24-Apr-2025",
        dayLabel: "Bugun",
        admin: {
            name: "Azizbek Rahimov",
            role: "ROOT",
            avatarText: "AR",
        },
        action: {
            label: "Ferma bloklandi",
            badgeClass: "bg-red-600 text-white",
        },
        target: {
            name: "Andijon Vodiy Bulog'i",
            code: "#FRM-7704",
            codeClass: "text-red-600",
        },
        clientInfo: {
            ip: "195.158.24.12",
            device: "Chrome / macOS",
        },
        description: "Mijoz shikoyatlari 5% dan oshgani sababli bloklandi",
    },
    {
        id: "log-003",
        time: "18:04:12",
        date: "23-Apr-2025",
        dayLabel: "Kecha",
        admin: {
            name: "Sardor Aliyev",
            role: "SECURITY",
            avatarText: "SA",
        },
        action: {
            label: "Boss arizasi rad etildi",
            badgeClass: "bg-red-600 text-white",
        },
        target: {
            name: "Ilhom Karimov",
            code: "#BOS-104",
            codeClass: "text-blue-600",
        },
        clientInfo: {
            ip: "84.54.72.10",
            device: "Firefox / Linux",
        },
        description: "STIR va shartnoma ma'lumotlarida nomuvofiqlik aniqlandi",
    },
    {
        id: "log-004",
        time: "09:15:30",
        date: "18-Apr-2025",
        dayLabel: "18-Apr",
        admin: {
            name: "Azizbek Rahimov",
            role: "ROOT",
            avatarText: "AR",
        },
        action: {
            label: "Tizim sozlamasi yangilandi",
            badgeClass: "bg-blue-600 text-white",
        },
        target: {
            name: "SMS Gateway konfiguratsiyasi",
            code: "#SYS-SMS-CONF",
            codeClass: "text-blue-600",
        },
        clientInfo: {
            ip: "195.158.24.12",
            device: "Chrome / macOS",
        },
        description: "Kesh tozalash va zaxira nusxa yaratildi",
    },
    {
        id: "log-005",
        time: "22:40:11",
        date: "17-Apr-2025",
        dayLabel: "17-Apr",
        admin: {
            name: "Sardor Aliyev",
            role: "SECURITY",
            avatarText: "SA",
        },
        action: {
            label: "API kaliti yangilandi",
            badgeClass: "bg-blue-600 text-white",
        },
        target: {
            name: "To'lov Klasteri Payme / Click",
            code: "#SEC-API-ROT",
            codeClass: "text-blue-600",
        },
        clientInfo: {
            ip: "84.54.72.10",
            device: "Firefox / Linux",
        },
        description: "90 kunlik rejaviy kalitlar rotatsiyasi",
    },
    {
        id: "log-006",
        time: "14:10:48",
        date: "15-Apr-2025",
        dayLabel: "15-Apr",
        admin: {
            name: "Azizbek Rahimov",
            role: "ROOT",
            avatarText: "AR",
        },
        action: {
            label: "Boss tasdiqlandi",
            badgeClass: "bg-blue-600 text-white",
        },
        target: {
            name: "Farrux Saidov",
            code: "#BOS-089",
            codeClass: "text-blue-600",
        },
        clientInfo: {
            ip: "195.158.24.12",
            device: "Chrome / macOS",
        },
        description: "Barcha rasmiy litsenziya va shartnomalar tasdiqlandi",
    },
]

const AuditLogPage = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedAction, setSelectedAction] = useState("all")
    const [selectedObject, setSelectedObject] = useState("all")
    const [selectedAdmin, setSelectedAdmin] = useState("all")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5

    const queryParams = useMemo(() => {
        const params = {
            page: currentPage - 1,
            size: itemsPerPage,
        }
        if (selectedAction !== "all") params.action = selectedAction
        if (searchTerm.trim()) params.search = searchTerm.trim()
        return params
    }, [currentPage, itemsPerPage, selectedAction, searchTerm])

    const { data: auditData, isPending, isFetching, refetch } = useAuditLogs(queryParams)

    const isServerPaginated = Boolean(
        auditData?.data?.content ||
        auditData?.data?.totalElements !== undefined ||
        auditData?.totalElements !== undefined
    )

    const rawLogs = useMemo(() => {
        if (Array.isArray(auditData?.data?.content)) return auditData.data.content
        if (Array.isArray(auditData?.content)) return auditData.content
        if (Array.isArray(auditData?.data)) return auditData.data
        if (Array.isArray(auditData)) return auditData
        return []
    }, [auditData])

    const logsList = useMemo(() => {
        if (Array.isArray(rawLogs) && rawLogs.length > 0) {
            return rawLogs.map((log, index) => {
                const dateObj = log.createdAt ? new Date(log.createdAt) : new Date()
                return {
                    id: log.id || `log-${index}`,
                    time: dateObj.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
                    date: dateObj.toLocaleDateString("ru-RU", { day: "2-digit", month: "short", year: "numeric" }),
                    dayLabel: dateObj.toLocaleDateString("ru-RU", { day: "2-digit", month: "short" }),
                    admin: {
                        name: `SuperAdmin #${log.actorId || 1}`,
                        role: "ROOT",
                        avatarText: "SA",
                    },
                    action: {
                        label: log.action || "Amal bajarildi",
                        badgeClass: "bg-blue-600 text-white",
                    },
                    target: {
                        name: `${log.entityType || "Obyekt"} #${log.entityId || ""}`,
                        code: `#${log.entityType || "AUD"}-${log.entityId || log.id || ""}`,
                        codeClass: "text-blue-600",
                    },
                    clientInfo: {
                        ip: "127.0.0.1",
                        device: log.metadata || "Web Client",
                    },
                    description: log.metadata || log.action || "Amal muvaffaqiyatli qayd etildi",
                }
            })
        }
        return MOCK_AUDIT_LOGS
    }, [rawLogs])

    // Filterlash mantiqi (agar serverda filter qilinmagan bo'lsa)
    const filteredLogs = useMemo(() => {
        if (isServerPaginated) return logsList

        return logsList.filter((log) => {
            const term = (searchTerm || "").toLowerCase().trim()
            const targetName = (log.target?.name || "").toLowerCase()
            const targetCode = (log.target?.code || "").toLowerCase()
            const ip = log.clientInfo?.ip || ""
            const actionLabel = (log.action?.label || "").toLowerCase()

            const matchesSearch =
                !term ||
                targetName.includes(term) ||
                targetCode.includes(term) ||
                ip.includes(term) ||
                actionLabel.includes(term)

            const matchesAction = selectedAction === "all" || actionLabel.includes((selectedAction || "").toLowerCase())
            const matchesAdmin = selectedAdmin === "all" || (log.admin?.name || "").toLowerCase().includes((selectedAdmin || "").toLowerCase())

            return matchesSearch && matchesAction && matchesAdmin
        })
    }, [logsList, searchTerm, selectedAction, selectedAdmin, isServerPaginated])

    const totalServerPages = auditData?.data?.totalPages ?? auditData?.totalPages ?? null
    const totalServerItems = auditData?.data?.totalElements ?? auditData?.totalElements ?? null

    const totalPages = isServerPaginated && totalServerPages
        ? totalServerPages
        : isServerPaginated && totalServerItems
        ? Math.ceil(totalServerItems / itemsPerPage) || 1
        : Math.ceil(filteredLogs.length / itemsPerPage) || 1

    const paginatedLogs = isServerPaginated
        ? filteredLogs
        : filteredLogs.slice(
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
        <section className="space-y-6">
            <div>
                {/* Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center pt-3 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Audit Log va Xavfsizlik Jurnali</h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Faqat SuperAdmin amallari va tizim darajasidagi xavfsizlik hodisalari qaydnomasi.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5 flex-nowrap">
                        {/* 1. Sana filtri tugmasi */}
                        <button
                            type="button"
                            className="h-10 px-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-xs hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer"
                        >
                            <Calendar className="h-4 w-4 text-blue-600" />
                            <span>So'nggi 30 kun</span>
                            <ChevronDown className="h-4 w-4 text-slate-400" />
                        </button>

                        {/* 2. Eksport tugmasi */}
                        <button
                            type="button"
                            className="h-10 px-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-xs hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer"
                        >
                            <Upload className="h-4 w-4 text-slate-500" />
                            <span>Eksport</span>
                            <ChevronDown className="h-4 w-4 text-slate-400" />
                        </button>

                        {/* 3. Qayta yangilash tugmasi */}
                        <Button
                            type="button"
                            onClick={() => refetch()}
                            disabled={isFetching}
                            className="h-10 px-4 flex items-center gap-2 rounded-xl bg-blue-600 text-white text-sm font-medium shadow-xs hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
                        >
                            <RotateCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                            <span>Qayta yangilash</span>
                        </Button>
                    </div>
                </div>

                {/* 4 ta Metrika Card */}
                <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {MOCK_AUDIT_METRICS_CARDS.map((audit) => {
                        const Icon = audit.icon
                        return (
                            <Card key={audit.id} className="bg-white border border-slate-200/80 shadow-xs rounded-xl">
                                <CardHeader className="flex flex-row items-center justify-between p-5 pb-2 space-y-0">
                                    <CardTitle className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                                        {audit.title}
                                    </CardTitle>
                                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                        <Icon className="h-4 w-4" />
                                    </div>
                                </CardHeader>
                                <CardContent className="p-5 pt-0">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-2xl font-bold text-slate-900">{audit.value}</span>
                                        <span className="text-xs font-medium text-blue-600">{audit.unit}</span>
                                    </div>
                                    <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                                        {audit.badge && (
                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-600 border border-blue-100">
                                                {audit.badge}
                                            </span>
                                        )}
                                        <span>{audit.subtitle}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                {/* Filter Bar */}
                <div className="mt-6 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                    {/* Chap tomon: Qidiruv input */}
                    <div className="relative w-full md:w-80 shrink-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        <Input
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value)
                                setCurrentPage(1)
                            }}
                            placeholder="obyekt yoki IP-manzil bo'yicha..."
                            className="pl-9 h-10 w-full rounded-xl border-slate-200 bg-white placeholder:text-slate-400 text-xs font-medium focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-100"
                        />
                    </div>

                    {/* O'ng tomon: Dropdown filtrlar guruhi */}
                    <div className="flex flex-wrap md:flex-nowrap items-center gap-2.5">
                        {/* Amal turi filter */}
                        <CustomDropdown
                            value={selectedAction}
                            onChange={(val) => {
                                setSelectedAction(val)
                                setCurrentPage(1)
                            }}
                            options={ACTION_OPTIONS}
                        />

                        {/* Obyekt filter */}
                        <CustomDropdown
                            value={selectedObject}
                            onChange={(val) => {
                                setSelectedObject(val)
                                setCurrentPage(1)
                            }}
                            options={OBJECT_OPTIONS}
                        />

                        {/* SuperAdmin filter */}
                        <CustomDropdown
                            value={selectedAdmin}
                            onChange={(val) => {
                                setSelectedAdmin(val)
                                setCurrentPage(1)
                            }}
                            options={ADMIN_OPTIONS}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="mt-4 bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden min-h-96">
                    <div className="overflow-x-auto w-full">
                        <Table className="w-full text-left">
                            <TableHeader className="bg-slate-50 border-b border-slate-100">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap w-36">
                                        Sana va vaqt
                                    </TableHead>
                                    <TableHead className="py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap w-44">
                                        SuperAdmin
                                    </TableHead>
                                    <TableHead className="py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap w-48">
                                        Ta'sir etilgan obyekt
                                    </TableHead>
                                    <TableHead className="py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap w-40">
                                        IP & Qurilma
                                    </TableHead>
                                    <TableHead className="py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap w-48">
                                        Tavsif va sabab
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isPending ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-14 text-center">
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <Spinner size="md" />
                                                <p className="text-sm font-medium text-slate-500">Audit loglari yuklanmoqda...</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : paginatedLogs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-14 text-center text-sm text-slate-500">
                                            Qaydlar topilmadi
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedLogs.map((log) => (
                                        <TableRow
                                            key={log.id}
                                            className="hover:bg-slate-50/70 transition-colors border-b border-slate-100 last:border-b-0"
                                        >
                                        {/* 1. Sana va vaqt */}
                                        <TableCell className="py-3.5 px-4 whitespace-nowrap w-36">
                                            <div className="text-xs font-semibold text-slate-800">
                                                {log.dayLabel}, {log.time}
                                            </div>
                                            <div className="text-[11px] text-slate-400 mt-0.5">
                                                {log.date}
                                            </div>
                                        </TableCell>

                                        {/* 2. SuperAdmin */}
                                        <TableCell className="py-3.5 px-4 whitespace-nowrap w-44">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full bg-blue-700 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                                                    {log.admin.avatarText}
                                                </div>
                                                <span className="text-xs font-semibold text-slate-800">
                                                    {log.admin.name}
                                                </span>
                                            </div>
                                        </TableCell>

                                        {/* 3. Ta'sir etilgan obyekt */}
                                        <TableCell className="py-3.5 px-4 whitespace-nowrap w-48">
                                            <div className="text-xs font-semibold text-slate-900">
                                                {log.target.name}
                                            </div>
                                            <div className={`text-[11px] font-medium mt-0.5 ${log.target.codeClass}`}>
                                                {log.target.code}
                                            </div>
                                        </TableCell>

                                        {/* 4. IP & Qurilma */}
                                        <TableCell className="py-3.5 px-4 whitespace-nowrap w-40">
                                            <div className="text-xs font-medium text-slate-700 font-mono">
                                                {log.clientInfo.ip}
                                            </div>
                                            <div className="text-[11px] text-slate-400 mt-0.5">
                                                {log.clientInfo.device}
                                            </div>
                                        </TableCell>

                                        {/* 5. Tavsif va sabab */}
                                        <TableCell className="py-3.5 px-4 w-48 max-w-48">
                                            <p className="text-xs text-slate-600 truncate" title={log.description}>
                                                {log.description}
                                            </p>
                                        </TableCell>
                                    </TableRow>
                                )))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Pagination (Table dan tashqarida alohida) */}
                <div className="pt-4 pb-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                    <div>
                        Jami <span className="font-semibold text-slate-800">{filteredLogs.length}</span> ta yozuvdan{" "}
                        <span className="font-semibold text-slate-800">
                            {filteredLogs.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} -{" "}
                            {Math.min(currentPage * itemsPerPage, filteredLogs.length)}
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
                                                        ? "bg-[#2563EB]! text-white! border-transparent! shadow-xs"
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

export default AuditLogPage;
