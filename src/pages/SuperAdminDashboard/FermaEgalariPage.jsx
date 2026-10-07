import { useState, useMemo } from "react"
import { FilterBar } from "@/widgets"
import { Card, CardHeader, Switch, Button, Spinner, EditBossModal, DeleteBossModal, Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from "@/shared/ui"
import { User, ShieldCheck, TrendingUpIcon, Hammer, RefreshCw } from "lucide-react"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/shared/ui/table"
import { useBosses, useUpdateBossStatus, useUpdateBoss, useDeleteBoss } from "@/shared/hooks"

const statusOptions = [
    { value: "all", label: "Barcha statuslar" },
    { value: "active", label: "Faol" },
    { value: "blocked", label: "Bloklangan" },
]

const farmOptions = [
    { value: "all", label: "Barcha fermalar" },
    { value: "qarshi", label: "Qarshi Markaziy" },
    { value: "oazis", label: "Oazis Toshkent" },
    { value: "zilol", label: "Zilol Aqua" },
    { value: "sano", label: "Sano Crystal" },
    { value: "kristall", label: "Kristall Buxoro" },
    { value: "tog", label: "Tog' Chashmasi" },
]

const OwnerAvatar = ({ image, name }) => {
    const [hasError, setHasError] = useState(false)
    const initials = useMemo(() => {
        if (!name) return "FE"
        const parts = name.trim().split(/\s+/)
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase()
        }
        return name.slice(0, 2).toUpperCase()
    }, [name])

    if (image && !hasError) {
        return (
            <img
                src={image}
                alt={name}
                onError={() => setHasError(true)}
                className="w-10 h-10 rounded-full object-cover object-center border border-slate-200 shrink-0 shadow-2xs"
            />
        )
    }

    return (
        <div className="w-10 h-10 rounded-full bg-[#0284c7] text-white flex items-center justify-center font-bold text-xs border border-sky-600/30 shrink-0 select-none shadow-2xs">
            {initials}
        </div>
    )
}

const FermaEgalariPage = () => {
    const [search, setSearch] = useState("")
    const [status, setStatus] = useState("all")
    const [farm, setFarm] = useState("all")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 8
    const [editingBoss, setEditingBoss] = useState(null)
    const [deletingBoss, setDeletingBoss] = useState(null)

    const { data, isPending, isError, error, isFetching, refetch } = useBosses()
    const toggleStatusMutation = useUpdateBossStatus()
    const updateBossMutation = useUpdateBoss()
    const deleteBossMutation = useDeleteBoss()

    const bosses = useMemo(() => {
        const list = data?.data?.bosses || data?.data?.content || (Array.isArray(data?.data) ? data?.data : [])
        if (Array.isArray(list)) return list
        return []
    }, [data])

    const stats = useMemo(() => {
        const summary = data?.data?.summary
        const total = summary?.totalBosses ?? (bosses.length > 0 ? bosses.length : 0)
        const active = summary?.activeBosses ?? bosses.filter((b) => b.active || b.status === "ACTIVE" || b.profile?.status === "active").length
        const recently = summary?.recentlyApproved ?? 0
        const blocked = summary?.blockedBosses ?? bosses.filter((b) => b.active === false || b.status === "BLOCKED" || b.profile?.status === "inactive").length

        return [
            { id: 1, title: "JAMI BOSSlar", value: total, label: "nafar", icon: User },
            { id: 2, title: "FAOL HISOBLAR", value: active, label: "nafar", icon: ShieldCheck },
            { id: 3, title: "YANGI TASDIQLANGAN", value: recently, label: "nafar", icon: TrendingUpIcon },
            { id: 4, title: "BLOKLANGAN", value: blocked, label: "nafar", icon: Hammer },
        ]
    }, [data, bosses])

    const filteredBosses = useMemo(() => {
        return bosses.filter((owner) => {
            const fullName = (owner.fullName || owner.profile?.fullName || "").toLowerCase()
            const farmName = (owner.farmName || owner.farm?.name || "").toLowerCase()
            const phone = (owner.phone || owner.profile?.phone || "").toLowerCase()
            const query = search.toLowerCase().trim()

            const matchesSearch = !query || fullName.includes(query) || farmName.includes(query) || phone.includes(query)

            const isActive = owner.active !== undefined ? owner.active : (owner.status === "ACTIVE" || owner.profile?.status === "active")
            let matchesStatus = true
            if (status === "active") matchesStatus = Boolean(isActive)
            if (status === "blocked") matchesStatus = !isActive

            let matchesFarm = true
            if (farm !== "all") {
                const fId = String(owner.farmId || owner.farm?.id || "")
                matchesFarm = fId.toLowerCase().includes(farm.toLowerCase()) || farmName.includes(farm.toLowerCase())
            }

            return matchesSearch && matchesStatus && matchesFarm
        })
    }, [bosses, search, status, farm])

    const totalPages = Math.ceil(filteredBosses.length / itemsPerPage) || 1

    const paginatedBosses = useMemo(() => {
        return filteredBosses.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        )
    }, [filteredBosses, currentPage, itemsPerPage])

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
                pages.push(
                    1,
                    "ellipsis-start",
                    totalPages - 2,
                    totalPages - 1,
                    totalPages
                )
            } else {
                pages.push(
                    1,
                    "ellipsis-start",
                    currentPage,
                    "ellipsis-end",
                    totalPages
                )
            }
        }

        return pages
    }

    const handleToggleStatus = (id) => {
        toggleStatusMutation.mutate(id)
    }

    const handleSaveBoss = ({ id, data }) => {
        updateBossMutation.mutate(
            { id, data },
            {
                onSuccess: () => setEditingBoss(null),
            }
        )
    }

    const handleConfirmDeleteBoss = (boss) => {
        deleteBossMutation.mutate(boss.id, {
            onSuccess: () => setDeletingBoss(null),
        })
    }

    const handleReset = () => {
        setSearch("")
        setStatus("all")
        setFarm("all")
        setCurrentPage(1)
    }

    return (
        <section className="space-y-6">
            <div>
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-900">Ferma egalari</h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Fermalar egalari va asosiy rahbarlar monitoringi hamda hisob holati.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => refetch()}
                            disabled={isFetching}
                            className="h-9 px-3.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold gap-2 cursor-pointer shadow-xs"
                        >
                            <RefreshCw className={`size-3.5 text-slate-500 transition-transform ${isFetching ? "animate-spin" : ""}`} />
                            <span>Yangilash</span>
                        </Button>
                    </div>
                </div>

                {/* Cardlar qismi */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
                    {stats.map((e) => {
                        const Icon = e.icon
                        return (
                            <Card key={e.id} className="p-5 border border-slate-200/80 rounded-2xl bg-white shadow-xs">
                                <CardHeader className="flex items-center justify-between p-0">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        {e.title}
                                    </span>
                                    <span className="flex size-9 items-center justify-center rounded-xl bg-slate-50 text-slate-600 border border-slate-200/80">
                                        <Icon className="size-4.5" />
                                    </span>
                                </CardHeader>

                                <div className="mt-3 flex items-baseline gap-2">
                                    <span className="text-2xl font-extrabold text-slate-900">
                                        {e.value}
                                    </span>
                                    <span className="text-xs text-slate-500 font-medium">
                                        {e.label}
                                    </span>
                                </div>
                            </Card>
                        )
                    })}
                </div>

                {/* Filter section */}
                <div className="pt-6">
                    <FilterBar
                        search={search}
                        setSearch={(val) => {
                            setSearch(val)
                            setCurrentPage(1)
                        }}
                        status={status}
                        setStatus={(val) => {
                            setStatus(val)
                            setCurrentPage(1)
                        }}
                        statusOptions={statusOptions}
                        farm={farm}
                        setFarm={(val) => {
                            setFarm(val)
                            setCurrentPage(1)
                        }}
                        farmOptions={farmOptions}
                        onReset={handleReset}
                        showStatus={true}
                        showFarm={true}
                        showReset={true}
                        showSort={false}
                        showFilterButton={false}
                        placeholder="Rahbar yoki ferma qidirish..."
                    />
                </div>

                {/* Table qismi */}
                {isPending ? (
                    <div className="bg-white border border-slate-200/80 rounded-2xl py-14 px-6 text-center flex flex-col items-center justify-center gap-3.5 shadow-xs mt-6">
                        <Spinner size="md" />
                        <p className="text-sm font-medium text-slate-500">
                            Ferma egalari yuklanmoqda...
                        </p>
                    </div>
                ) : (
                    <div className="mt-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                        <Table className="w-full">
                            <TableHeader className="bg-slate-50/80">
                                <TableRow className="border-b border-slate-200/80 hover:bg-transparent">
                                    <TableHead className="py-3.5 pl-6 text-left font-semibold text-slate-700 w-16 text-xs uppercase tracking-wider">
                                        Rasm
                                    </TableHead>
                                    <TableHead className="py-3.5 px-4 text-left font-semibold text-slate-700 text-xs uppercase tracking-wider">
                                        Ferma Egasi
                                    </TableHead>
                                    <TableHead className="py-3.5 px-4 text-left font-semibold text-slate-700 text-xs uppercase tracking-wider">
                                        Telefon
                                    </TableHead>
                                    <TableHead className="py-3.5 px-4 text-left font-semibold text-slate-700 text-xs uppercase tracking-wider">
                                        Ferma ID
                                    </TableHead>
                                    <TableHead className="py-3.5 px-4 text-left font-semibold text-slate-700 text-xs uppercase tracking-wider">
                                        Holati
                                    </TableHead>
                                    <TableHead className="py-3.5 px-4 text-left font-semibold text-slate-700 text-xs uppercase tracking-wider">
                                        Ro'yxatdan O'tgan Sanasi
                                    </TableHead>
                                    <TableHead className="py-3.5 px-4 text-center font-semibold text-slate-700 text-xs uppercase tracking-wider">
                                        Amallar
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredBosses.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-12 text-slate-500 text-sm">
                                            {isError
                                                ? `Xatolik yuz berdi: ${error?.message || "Yuklab bo'lmadi"}`
                                                : "Ferma egalari topilmadi."}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedBosses.map((owner) => {
                                        const fullName = owner.fullName || owner.profile?.fullName || "—"
                                        const avatar = owner.avatarUrl || owner.profile?.avatar || ""
                                        const phone = owner.phone || owner.profile?.phone || "—"
                                        const farmImage = owner.farmLogoUrl || owner.logoUrl || avatar || owner.farm?.logoUrl || ""
                                        const farmName = owner.farmName || owner.farm?.name || "Ferma biriktirilmagan"
                                        const farmId = owner.farmId || owner.farm?.id || owner.id
                                        const isActive = owner.active !== undefined
                                            ? Boolean(owner.active)
                                            : (owner.status === "ACTIVE" || owner.profile?.status === "active")
                                        const createdAtStr = owner.formattedCreatedAt || (owner.createdAt
                                            ? new Date(owner.createdAt).toLocaleDateString("ru-RU", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                            })
                                            : "—")
                                        const isToggling = toggleStatusMutation.isPending && toggleStatusMutation.variables === owner.id

                                        return (
                                            <TableRow key={owner.id} className="hover:bg-slate-50/60 transition-colors border-b border-slate-100 last:border-b-0">
                                                {/* 1. Rasm */}
                                                <TableCell className="py-3.5 pl-6 text-left">
                                                    <OwnerAvatar image={farmImage} name={fullName} />
                                                </TableCell>

                                                {/* 2. Ferma Egasi (Ism + Ferma nomi) */}
                                                <TableCell className="py-3.5 px-4 text-left">
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-slate-900 text-sm truncate">
                                                            {fullName}
                                                        </p>
                                                        <p className="text-xs text-slate-500 truncate">
                                                            {farmName}
                                                        </p>
                                                    </div>
                                                </TableCell>

                                                {/* 3. Telefon */}
                                                <TableCell className="py-3.5 px-4 text-left text-slate-600 text-sm font-medium whitespace-nowrap">
                                                    {phone}
                                                </TableCell>

                                                {/* 4. Ferma ID */}
                                                <TableCell className="py-3.5 px-4 text-left whitespace-nowrap">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200/60">
                                                        {farmId}
                                                    </span>
                                                </TableCell>

                                                {/* 5. Holati (Switch + Oddiy Matn) */}
                                                <TableCell className="py-3.5 px-4 text-left whitespace-nowrap">
                                                    <div className="flex items-center gap-2.5">
                                                        <Switch
                                                            checked={isActive}
                                                            disabled={isToggling}
                                                            onCheckedChange={() => handleToggleStatus(owner.id)}
                                                        />
                                                        <span
                                                            className={`w-16 shrink-0 text-xs font-semibold select-none ${
                                                                isActive
                                                                    ? "text-blue-600"
                                                                    : "text-slate-400"
                                                            }`}
                                                        >
                                                            {isToggling ? "O'zgarmoqda..." : isActive ? "Faol" : "Bloklangan"}
                                                        </span>
                                                    </div>
                                                </TableCell>

                                                {/* 6. Ro'yxatdan O'tgan Sanasi */}
                                                <TableCell className="py-3.5 px-4 text-left text-slate-600 text-sm whitespace-nowrap">
                                                    {createdAtStr}
                                                </TableCell>

                                                {/* 7. Amallar */}
                                                <TableCell className="py-3.5 px-4 text-center whitespace-nowrap">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Button
                                                            type="button"
                                                            size="xs"
                                                            onClick={() => setEditingBoss(owner)}
                                                            className="h-8 px-3 rounded-lg text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 transition-colors shadow-xs cursor-pointer capitalize"
                                                        >
                                                            tahrirlash
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            size="xs"
                                                            onClick={() => setDeletingBoss(owner)}
                                                            className="h-8 px-3 rounded-lg text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-xs cursor-pointer capitalize"
                                                        >
                                                            o'chirish
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {/* Pagination */}
                {!isPending && !isError && totalPages > 1 && (
                    <div className="pt-6 pb-2 flex items-center justify-end">
                        <Pagination className="mx-0 w-auto justify-end">
                            <PaginationContent className="bg-white p-1 rounded-2xl border border-slate-200/80 shadow-xs">
                                <PaginationItem>
                                    <PaginationPrevious
                                        text="Oldingi"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            if (currentPage > 1) {
                                                setCurrentPage((p) => p - 1)
                                            }
                                        }}
                                        className={`cursor-pointer ${currentPage === 1
                                            ? "pointer-events-none opacity-40"
                                            : "hover:bg-slate-100"
                                            }`}
                                    />
                                </PaginationItem>

                                {getPageNumbers().map((pageItem, index) => {
                                    if (
                                        pageItem === "ellipsis-start" ||
                                        pageItem === "ellipsis-end"
                                    ) {
                                        return (
                                            <PaginationItem
                                                key={`${pageItem}-${index}`}
                                            >
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
                                                className={`cursor-pointer rounded-xl font-medium ${currentPage === pageItem
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
                                            if (currentPage < totalPages) {
                                                setCurrentPage((p) => p + 1)
                                            }
                                        }}
                                        className={`cursor-pointer ${currentPage === totalPages
                                            ? "pointer-events-none opacity-40"
                                            : "hover:bg-slate-100"
                                            }`}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>

            {/* Modallar */}
            <EditBossModal
                opened={Boolean(editingBoss)}
                onClose={() => setEditingBoss(null)}
                boss={editingBoss}
                onSave={handleSaveBoss}
                isPending={updateBossMutation.isPending}
            />

            <DeleteBossModal
                opened={Boolean(deletingBoss)}
                onClose={() => setDeletingBoss(null)}
                boss={deletingBoss}
                onConfirm={handleConfirmDeleteBoss}
                isPending={deleteBossMutation.isPending}
            />
        </section>
    )
}

export default FermaEgalariPage
