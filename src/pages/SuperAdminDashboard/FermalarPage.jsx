import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
    Plus,
    Search,
    SlidersHorizontal,
    ChevronDown,
    MapPin,
    Phone,
    User,
    Pencil,
    Trash2,
} from "lucide-react"
import { Button } from "@base-ui/react"
import { Card, CardHeader, CardTitle, CardContent, Input, Switch } from "@/ui"
import { Select } from "@mantine/core"
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from "@/ui/breadcrumb"
import { MOCK_FARMS } from "@/mock/farms.mock"
import { useFermaModalStore } from "@/store/modalStore"
import { CreateFermaModal } from "@/components/modal"

const FermalarPage = () => {
    const navigate = useNavigate()
    const { openModal } = useFermaModalStore()
    const [search, setSearch] = useState("")
    const [status, setStatus] = useState("all")
    const [sort, setSort] = useState("newest")
    const [farms, setFarms] = useState(MOCK_FARMS)

    const statusOptions = [
        { value: "all", label: "Barcha statuslar" },
        { value: "active", label: "Faol" },
        { value: "inactive", label: "Nofaol" },
    ]

    const sortOptions = [
        { value: "newest", label: "Yangi qo'shilgan" },
        { value: "oldest", label: "Eski qo'shilgan" },
        { value: "name_asc", label: "Nomi bo'yicha (A-Z)" },
        { value: "name_desc", label: "Nomi bo'yicha (Z-A)" },
    ]

    const handleToggleStatus = (e, farmId) => {
        e.stopPropagation()
        e.preventDefault()
        setFarms((prev) =>
            prev.map((farm) =>
                farm.id === farmId
                    ? { ...farm, status: farm.status === "active" ? "inactive" : "active" }
                    : farm
            )
        )
    }

    const handleEdit = (e, farmId) => {
        e.stopPropagation()
        e.preventDefault()
        // Tahrirlash logikasi (Modal yoki alohida forma)
        console.log("Tahrirlash bosildi:", farmId)
    }

    const handleDelete = (e, farmId) => {
        e.stopPropagation()
        e.preventDefault()
        // O'chirish logikasi (hozircha kartochka o'chirilmaydi)
        console.log("O'chirish bosildi:", farmId)
    }

    const filteredFarms = farms
        .filter((f) => {
            const matchSearch =
                f.name.toLowerCase().includes(search.toLowerCase()) ||
                f.address.toLowerCase().includes(search.toLowerCase()) ||
                f.bossFullName.toLowerCase().includes(search.toLowerCase())
            const matchStatus = status === "all" || f.status === status
            return matchSearch && matchStatus
        })
        .sort((a, b) => {
            if (sort === "newest") return new Date(b.createdAt) - new Date(a.createdAt)
            if (sort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt)
            if (sort === "name_asc") return a.name.localeCompare(b.name)
            if (sort === "name_desc") return b.name.localeCompare(a.name)
            return 0
        })

    return (
        <section className="space-y-6">
            {/* Breadcrumb qismi */}
            <div>
                <Breadcrumb className="mb-4">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink
                                className="capitalize decoration-blue-500"
                                render={<Link to="/super-admin" />}
                            >
                                bosh sahifa
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="capitalize text-blue-600">
                                fermalar
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* Sarlavha va Ferma qo'shish tugmasi */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold capitalize tracking-tight text-slate-900">
                        fermalar
                    </h1>
                    <p className="text-sm capitalize text-slate-500 mt-1">
                        Barcha fermalar ro'yxati va ularni boshqarish.
                    </p>
                </div>
                <Button
                    onClick={openModal}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-[10px] bg-[#1670FF] hover:bg-blue-700 text-white font-medium text-sm transition-colors cursor-pointer shrink-0"
                >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    <span>Ferma qo'shish</span>
                </Button>
            </div>

            {/* Filtr va Qidiruv Toolbar */}
            <div className="w-full bg-white px-5 py-6 rounded-[12px] border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
                {/* Chap tomon: Qidiruv inputi */}
                <div className="relative w-full sm:w-72 md:w-80 shrink-0">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none"
                        strokeWidth={1.75}
                    />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Ferma nomi yoki manzil..."
                        className="pl-9 h-10 w-full rounded-[10px] border-slate-200 bg-white placeholder:text-slate-400 text-sm focus-visible:border-blue-500 focus-visible:ring-blue-100"
                    />
                </div>

                {/* O'ng tomon: Status, Saralash va Filtrlar */}
                <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-start md:justify-end">
                    {/* Status select */}
                    <Select
                        value={status}
                        onChange={(val) => setStatus(val || "all")}
                        data={statusOptions}
                        allowDeselect={false}
                        rightSection={<ChevronDown className="size-4 text-slate-400 pointer-events-none" />}
                        classNames={{
                            root: "w-full sm:w-44",
                            input:
                                "!h-10 !rounded-[10px] !border-slate-200 !text-slate-800 !text-sm !font-medium !cursor-pointer hover:!bg-slate-50 transition-colors focus:!border-blue-500",
                            dropdown: "!rounded-[12px] !border-slate-200 !shadow-lg !p-1.5 !bg-white",
                            option:
                                "!rounded-[8px] !text-sm !font-medium !py-2 !px-3 !cursor-pointer hover:!bg-slate-100 data-[checked=true]:!bg-blue-50 data-[checked=true]:!text-blue-600",
                        }}
                    />

                    {/* Saralash (Sort) select */}
                    <Select
                        value={sort}
                        onChange={(val) => setSort(val || "newest")}
                        data={sortOptions}
                        allowDeselect={false}
                        rightSection={<ChevronDown className="size-4 text-slate-400 pointer-events-none" />}
                        classNames={{
                            root: "w-full sm:w-48",
                            input:
                                "!h-10 !rounded-[10px] !border-slate-200 !text-slate-800 !text-sm !font-medium !cursor-pointer hover:!bg-slate-50 transition-colors focus:!border-blue-500",
                            dropdown: "!rounded-[12px] !border-slate-200 !shadow-lg !p-1.5 !bg-white",
                            option:
                                "!rounded-[8px] !text-sm !font-medium !py-2 !px-3 !cursor-pointer hover:!bg-slate-100 data-[checked=true]:!bg-blue-50 data-[checked=true]:!text-blue-600",
                        }}
                    />

                    {/* Filtrlar tugmasi */}
                    <button
                        type="button"
                        className="flex items-center gap-2 px-4 h-10 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-[10px] transition-colors cursor-pointer shrink-0"
                    >
                        <SlidersHorizontal className="h-4 w-4 text-slate-500" />
                        <span>Filtrlar</span>
                    </button>
                </div>
            </div>

            {/* Kartochkalar (2-rasmdagi zamonaviy dizayn: Katta Banner Rasm + Tahrirlash va O'chirish tugmalari) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFarms.map((farm) => (
                    <div
                        key={farm.id}
                        onClick={() => navigate(`/super-admin/fermalar/${farm.id}`)}
                        className="group bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer"
                    >
                        {/* 1. Katta Rasm (Cover/Banner Image) */}
                        <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-slate-100">
                            <img
                                src={farm.logoUrl || farm.bannerUrl}
                                alt={farm.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>

                        {/* 2. Kartochka Tanasi: Sarlavha va Ma'lumotlar */}
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                            <div className="space-y-3">
                                <h3 className="text-lg font-bold text-slate-900 line-clamp-1">
                                    {farm.name}
                                </h3>

                                <div className="space-y-2 text-sm text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="size-4 text-slate-400 shrink-0" />
                                        <span className="truncate">{farm.address}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Phone className="size-4 text-slate-400 shrink-0" />
                                        <span>{farm.phone}</span>
                                    </div>

                                    <div className="flex items-center gap-2 pt-2.5 border-t border-slate-100 text-xs sm:text-sm">
                                        <User className="size-4 text-slate-400 shrink-0" />
                                        <span className="font-medium text-slate-800 truncate">
                                            {farm.bossFullName}
                                        </span>
                                        <span className="text-slate-400 truncate">
                                            ({farm.bossPhone})
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Pastki Tugmalar (Read o'rniga 2 ta flex tugma: Tahrirlash va O'chirish) */}
                            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={(e) => handleEdit(e, farm.id)}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#1670FF] hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-xs"
                                >
                                    <Pencil className="size-3.5" />
                                    <span>Tahrirlash</span>
                                </button>
                                <button

                                    type="button"
                                    onClick={(e) => handleDelete(e, farm.id)}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-xs"
                                >
                                    <Trash2 className="size-3.5 text-white" />
                                    <span>O'chirish</span>
                                </button>
                            </div>
                        </div>
                    </div>


                ))}
            </div>
            <CreateFermaModal />

        </section>
    )
}

export default FermalarPage 