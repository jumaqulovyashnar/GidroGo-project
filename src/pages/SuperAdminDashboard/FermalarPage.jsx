import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Plus, Building2 } from "lucide-react"
import { toast } from "sonner"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/shared/ui/breadcrumb"
import { useFermaModalStore } from "@/entities/farm"
import { Button, CreateFermaModal, EditFermaModal, DeleteFermaModal, TablePagination, Spinner } from "@/shared/ui"
import { FilterBar } from "@/widgets"
import { useFarms, useUpdateFarmStatus, useDeleteFarm } from "@/shared/hooks"
import { FarmCard } from "@/components/common"

const FermalarPage = () => {
    const { data, isPending, isError, error } = useFarms()
    const updateFarmStatusMutation = useUpdateFarmStatus()
    const deleteFarmMutation = useDeleteFarm()
    const navigate = useNavigate()
    const { openModal } = useFermaModalStore()
    const [search, setSearch] = useState("")
    const [status, setStatus] = useState("all")
    const [sort, setSort] = useState("newest")
    const [currentPage, setCurrentPage] = useState(1)

    const [editingFarm, setEditingFarm] = useState(null)
    const [deletingFarm, setDeletingFarm] = useState(null)

    const itemsPerPage = 9
    const farms =
        data?.data?.content ||
        data?.content ||
        (Array.isArray(data?.data) ? data.data : []) ||
        (Array.isArray(data) ? data : [])

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

    const handleEdit = (farm) => {
        setEditingFarm(farm)
    }

    const handleDelete = (farm) => {
        setDeletingFarm(farm)
    }

    const handleConfirmDelete = async (farmToDelete) => {
        try {
            await deleteFarmMutation.mutateAsync(farmToDelete.id)
            toast.success(`${farmToDelete.name} fermasi muvaffaqiyatli o'chirildi!`)
        } catch (err) {
            toast.error(err?.message || "Ferma o'chirishda xatolik yuz berdi")
        } finally {
            setDeletingFarm(null)
        }
    }

    const handleSaveEdit = (updatedFarm) => {
        if (updatedFarm?.id && updatedFarm?.status) {
            updateFarmStatusMutation.mutate(
                {
                    id: updatedFarm.id,
                    status: updatedFarm.status,
                },
                {
                    onSuccess: () => setEditingFarm(null),
                }
            )
        } else {
            setEditingFarm(null)
        }
    }
    const filteredFarms = farms
        .filter((f) => {
            const query = (search || "").toLowerCase().trim()
            const name = (f?.name || "").toLowerCase()
            const address = (f?.address || "").toLowerCase()
            const bossFullName = (f?.bossFullName || f?.bossPhone || f?.phone || "").toLowerCase()

            const matchSearch =
                !query ||
                name.includes(query) ||
                address.includes(query) ||
                bossFullName.includes(query)

            const matchStatus =
                status === "all" || f?.status === status

            return matchSearch && matchStatus
        })
        .sort((a, b) => {
            if (sort === "newest") {
                return new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0)
            }

            if (sort === "oldest") {
                return new Date(a?.createdAt || 0) - new Date(b?.createdAt || 0)
            }

            if (sort === "name_asc") {
                return (a?.name || "").localeCompare(b?.name || "")
            }

            if (sort === "name_desc") {
                return (b?.name || "").localeCompare(a?.name || "")
            }

            return 0
        })

    const totalPages =
        Math.ceil(filteredFarms.length / itemsPerPage) || 1

    const paginatedFarms = filteredFarms.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )


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
                    showFilterButton={false}
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
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setSearch("")
                                    setStatus("all")
                                    setCurrentPage(1)
                                }}
                                className="h-9 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                            >
                                Filtrlarni tozalash
                            </Button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {paginatedFarms.map((farm) => (
                        <FarmCard
                            key={farm.id}
                            farm={farm}
                            onClick={() =>
                                navigate(`/super-admin/fermalar/${farm.id}`)
                            }
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {!isPending && !isError && totalPages > 1 && (
                <TablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    className="pt-6 pb-2"
                />
            )}

            <CreateFermaModal />
            <EditFermaModal
                opened={Boolean(editingFarm)}
                onClose={() => setEditingFarm(null)}
                farm={editingFarm}
                onSave={handleSaveEdit}
                isPending={updateFarmStatusMutation.isPending}
            />
            <DeleteFermaModal
                opened={Boolean(deletingFarm)}
                onClose={() => setDeletingFarm(null)}
                farm={deletingFarm}
                onConfirm={handleConfirmDelete}
            />
        </section>
    )
}

export default FermalarPage;