import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
    Plus,
    MapPin,
    Phone,
    User,
    Pencil,
    Trash2,
    Building2,
} from "lucide-react"
import { Button } from "@base-ui/react"
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from "@/shared/ui/breadcrumb"
import { useFermaModalStore } from "@/entities/farm"
import { CreateFermaModal } from "@/shared/ui"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
    Spinner,
} from "@/shared/ui"
import { FilterBar } from "@/widgets"
import { useFarms } from "@/shared/hooks/useFarms"

const FermalarPage = () => {
    const {
        data,
        isPending,
        isError,
        error,
    } = useFarms()

    const navigate = useNavigate()
    const { openModal } = useFermaModalStore()

    const [search, setSearch] = useState("")
    const [status, setStatus] = useState("all")
    const [sort, setSort] = useState("newest")
    const [currentPage, setCurrentPage] = useState(1)

    const itemsPerPage = 9

    const farms = data?.data || []
    console.log(farms);



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
    const handleEdit = (e, farmId) => {
        e.stopPropagation()
        e.preventDefault()

        console.log("Tahrirlash bosildi:", farmId)
    }
    const handleDelete = (e, farmId) => {
        e.stopPropagation()
        e.preventDefault()
        console.log("O'chirish bosildi:", farmId)
    }
    const filteredFarms = farms
        .filter((f) => {
            const matchSearch =
                f.name.toLowerCase().includes(search.toLowerCase()) ||
                f.address.toLowerCase().includes(search.toLowerCase()) ||
                f.bossFullName.toLowerCase().includes(search.toLowerCase())

            const matchStatus =
                status === "all" || f.status === status

            return matchSearch && matchStatus
        })
        .sort((a, b) => {
            if (sort === "newest") {
                return new Date(b.createdAt) - new Date(a.createdAt)
            }

            if (sort === "oldest") {
                return new Date(a.createdAt) - new Date(b.createdAt)
            }

            if (sort === "name_asc") {
                return a.name.localeCompare(b.name)
            }

            if (sort === "name_desc") {
                return b.name.localeCompare(a.name)
            }

            return 0
        })

    const totalPages =
        Math.ceil(filteredFarms.length / itemsPerPage) || 1

    const paginatedFarms = filteredFarms.slice(
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

    return (
        <section className="space-y-6">
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
                    className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-[10px] bg-[#2563EB] hover:bg-blue-700 text-white font-medium text-sm transition-colors cursor-pointer shrink-0"
                >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    <span>Ferma qo'shish</span>
                </Button>
            </div>

            <div>
                <FilterBar
                    search={search}
                    setSearch={setSearch}
                    status={status}
                    setStatus={setStatus}
                    statusOptions={statusOptions}
                    sort={sort}
                    setSort={setSort}
                    sortOptions={sortOptions}
                    setCurrentPage={setCurrentPage}
                />
            </div>

            {isPending ? (
                <div className="bg-white border border-slate-200/80 rounded-2xl py-14 px-6 text-center flex flex-col items-center justify-center gap-3.5 shadow-xs my-4">
                    <Spinner size="md" />
                    <p className="text-sm font-medium text-slate-500">
                        Fermalar yuklanmoqda...
                    </p>
                </div>
            ) : isError ? (
                <div className="bg-white border border-rose-200 rounded-2xl p-10 text-center my-4">
                    <div className="space-y-2">
                        <h3 className="text-base font-bold text-slate-900">
                            Fermalarni yuklashda xatolik
                        </h3>
                        <p className="text-sm text-rose-500">
                            {error?.response?.data?.message || error?.message || "Noma'lum xatolik yuz berdi"}
                        </p>
                    </div>
                </div>
            ) : filteredFarms.length === 0 ? (
                <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center space-y-4 shadow-xs my-4">
                    <div className="size-16 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto border border-blue-100">
                        <Building2 className="size-8" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold text-slate-900">
                            Hozircha ferma mavjud emas.
                        </h3>

                        <p className="text-sm text-slate-500 max-w-sm mx-auto">
                            Qidiruv yoki filtr bo'yicha mos fermalar topilmadi.
                            Yangi ferma qo'shishingiz yoki filtrlarni
                            tozalashingiz mumkin.
                        </p>
                    </div>

                    <div className="pt-2 flex items-center justify-center gap-3">
                        {(search || status !== "all") && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch("")
                                    setStatus("all")
                                    setCurrentPage(1)
                                }}
                                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                            >
                                Filtrlarni tozalash
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedFarms.map((farm) => (
                        <div
                            key={farm.id}
                            onClick={() =>
                                navigate(`/super-admin/fermalar/${farm.id}`)
                            }
                            className="group bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer"
                        >
                            <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-slate-100">
                                <img
                                    src={farm.logoUrl || farm.bannerUrl}
                                    alt={farm.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>

                            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-slate-900 line-clamp-1">
                                        {farm.name}
                                    </h3>

                                    <div className="space-y-2 text-sm text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="size-4 text-slate-400 shrink-0" />

                                            <span className="truncate">
                                                {farm.address}
                                            </span>
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

                                <div className="flex items-center gap-2.5 pt-3 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={(e) =>
                                            handleEdit(e, farm.id)
                                        }
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-[10px] bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-medium transition-colors cursor-pointer shadow-xs"
                                    >
                                        <Pencil className="size-3.5" />
                                        <span>Tahrirlash</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={(e) =>
                                            handleDelete(e, farm.id)
                                        }
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-[10px] bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium transition-colors cursor-pointer shadow-xs"
                                    >
                                        <Trash2 className="size-3.5 text-white" />
                                        <span>O'chirish</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

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
                                            isActive={
                                                currentPage === pageItem
                                            }
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

            <CreateFermaModal />
        </section>
    )
}

export default FermalarPage;