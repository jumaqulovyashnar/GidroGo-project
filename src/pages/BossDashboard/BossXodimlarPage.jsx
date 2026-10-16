import { useState, useMemo } from "react"
import { toast } from "sonner"
import { Plus, Download } from "lucide-react"
import { Button } from "@/shared/ui"
import { exportToCsv } from "@/shared/lib"
import { useStaff, useStaffSummary } from "@/shared/hooks"
import { XodimlarStats, XodimlarTable, AddXodimModal } from "@/components"

export function BossXodimlarPage() {
  // 1. Dinamik API Hook: GET, POST (create), PATCH (status), DELETE
  const {
    data,
    isLoading,
    isError,
    refetch,
    createStaff,
    isCreating,
    updateStaffStatus,
    isUpdatingStatus,
    deleteStaff,
    isDeleting,
  } = useStaff()

  // Real API: GET /api/boss/staff/summary
  const { data: summaryRes, isLoading: isSummaryLoading } = useStaffSummary()
  const summaryData = useMemo(() => summaryRes?.data || summaryRes || {}, [summaryRes])

  // API dan kelgan xom ma'lumotlarni massivga aylantirish
  const rawList = useMemo(() => {
    if (Array.isArray(data?.data)) return data.data
    if (Array.isArray(data)) return data
    return []
  }, [data])

  // Backend ma'lumotlarini toza ko'rinishga keltirish (ortiqcha sun'iy fildlarsiz)
  const employees = useMemo(() => {
    return rawList.map((item) => {
      const isManager = item.role === "MANAGER"
      const roleType = isManager ? "manager" : "courier"
      const roleTitle = isManager ? "Menejer" : "Dastavkachi"

      const initials = (item.fullName || item.name || "XD")
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)

      const isBlocked =
        item.status === "BLOCKED" ||
        item.status === "blocked" ||
        item.status === "INACTIVE"

      let createdAtText = "—"
      if (item.createdAt) {
        try {
          const date = new Date(item.createdAt)
          createdAtText = date.toLocaleDateString("uz-UZ", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        } catch {
          createdAtText = "—"
        }
      }

      return {
        id: item.id,
        name: item.fullName || item.name || "Noma'lum xodim",
        initials: initials || "XD",
        phone: item.phone || "—",
        roleType,
        roleTitle,
        createdAtText,
        status: isBlocked ? "blocked" : "active",
      }
    })
  }, [rawList])

  // 2. Tab, qidiruv va paginatsiya holatlari
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  const handleSearchChange = (val) => {
    setSearchQuery(val)
    setCurrentPage(1)
  }

  // 3. Yangi xodim qo'shish modali
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // 4. Statistika (KPI lar) - Faqat backend ma'lumotlaridan (GET /api/boss/staff/summary)
  const stats = useMemo(() => {
    if (summaryData.totalStaffCount != null) {
      return {
        total: Number(summaryData.totalStaffCount),
        managersCount: Number(summaryData.managersCount ?? 0),
        couriersCount: Number(summaryData.couriersCount ?? 0),
        activeCount: Number(summaryData.activeOnShiftCount ?? 0),
        blockedCount: employees.filter((e) => e.status === "blocked").length,
        disciplinePercent: summaryData.deliveryDisciplinePercent,
      }
    }

    const total = employees.length
    const managersCount = employees.filter((e) => e.roleType === "manager").length
    const couriersCount = employees.filter((e) => e.roleType === "courier").length
    const activeCount = employees.filter((e) => e.status !== "blocked").length
    const blockedCount = employees.filter((e) => e.status === "blocked").length

    return {
      total,
      managersCount,
      couriersCount,
      activeCount,
      blockedCount,
    }
  }, [employees, summaryData])

  // 5. Qidiruv va Tab bo'yicha saralash
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      // Tab filtri
      if (activeTab === "couriers" && emp.roleType !== "courier") return false
      if (activeTab === "managers" && emp.roleType !== "manager") return false

      // Qidiruv filtri (ism va telefon)
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase()
        const matchName = emp.name.toLowerCase().includes(query)
        const matchPhone = emp.phone.toLowerCase().includes(query)
        return matchName || matchPhone
      }

      return true
    })
  }, [employees, activeTab, searchQuery])

  // 6. Paginatsiya hisobi
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage) || 1
  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredEmployees.slice(start, start + itemsPerPage)
  }, [filteredEmployees, currentPage, itemsPerPage])

  // 7. POST /api/boss/staff - Yangi xodim yaratish (Faqat 1 marta yangilanadi)
  const handleAddEmployee = (payload, onSuccessCallback) => {
    createStaff(payload, {
      onSuccess: () => {
        toast.success("Yangi xodim muvaffaqiyatli yaratildi!")
        if (onSuccessCallback) onSuccessCallback()
        setIsAddModalOpen(false)
        // Diqqat: refetch() bu yerda chaqirilmaydi, chunki useMutation invalidateQueries o'zi aniq 1 marta GET qiladi!
      },
      onError: (err) => {
        toast.error(err.message || "Xodimni yaratishda xatolik yuz berdi!")
      },
    })
  }

  // 8. PATCH /api/boss/staff/{id}/status - Xodim holatini faol/bloklangan qilish (Faqat 1 marta yangilanadi)
  const handleToggleBlock = (emp) => {
    const isCurrentlyBlocked = emp.status === "blocked"
    const nextStatus = isCurrentlyBlocked ? "ACTIVE" : "BLOCKED"

    updateStaffStatus(
      { id: emp.id, status: nextStatus },
      {
        onSuccess: () => {
          toast.success(
            isCurrentlyBlocked
              ? `${emp.name} hisobi faollashtirildi!`
              : `${emp.name} tizimdan bloklandi!`
          )
          // Diqqat: refetch() bu yerda chaqirilmaydi, invalidateQueries o'zi aniq 1 marta GET qiladi!
        },
        onError: (err) => {
          toast.error(err.message || "Holatni o'zgartirishda xatolik yuz berdi!")
        },
      }
    )
  }

  // 9. DELETE /api/boss/staff/{id} - Xodimni o'chirish (Double-request protected)
  const handleDeleteEmployee = (emp) => {
    if (isDeleting) return
    const confirmed = window.confirm(`Haqiqatan ham "${emp.name}" xodimini tizimdan o'chirmoqchimisiz?`)
    if (confirmed) {
      deleteStaff(emp.id)
    }
  }

  const handleExportCSV = () => {
    if (!filteredEmployees || filteredEmployees.length === 0) {
      toast.error("Eksport qilish uchun xodimlar mavjud emas")
      return
    }
    const headers = ["ID", "Ism", "Lavozim", "Telefon", "Holat", "Bugungi buyurtmalar", "Jami yetkazilgan"]
    const rows = filteredEmployees.map((e) => [
      e.id || "",
      e.name || "",
      e.role || "",
      e.phone || "",
      e.status || "",
      e.todayOrders || 0,
      e.totalDelivered || 0,
    ])
    exportToCsv("xodimlar_royxati", headers, rows)
    toast.success("Xodimlar ro'yxati CSV shaklida yuklab olindi!")
  }

  return (
    <div className="space-y-6 pb-10">
      {/* 1. Sarlavha va Amallar Paneli */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Xodimlar va Dastavkachilar Boshqaruvi
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium mt-1.5 max-w-3xl leading-relaxed">
            Menejer va dastavkachilar ro‘yxati hamda faoliyat monitoringi.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="h-9 rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold gap-1.5 shadow-2xs px-3.5 flex items-center cursor-pointer transition-colors"
          >
            <Download className="size-3.5 text-slate-500" />
            <span>Eksport CSV</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="h-9 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold gap-1.5 shadow-2xs px-3.5 flex items-center shrink-0 cursor-pointer transition-colors whitespace-nowrap"
          >
            <Plus className="size-4 stroke-2" />
            <span>Yangi Xodim Qo'shish</span>
          </Button>
        </div>
      </div>

      {/* 2. Top Asosiy KPI Kartalari */}
      <XodimlarStats stats={stats} isLoading={isLoading || isSummaryLoading} />

      {/* 3. Asosiy Jadval, Filtrlash va Pagination */}
      <XodimlarTable
        employees={employees}
        paginatedEmployees={paginatedEmployees}
        totalFilteredCount={filteredEmployees.length}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        counts={stats}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onToggleBlock={handleToggleBlock}
        isUpdatingStatus={isUpdatingStatus}
        onDeleteEmployee={handleDeleteEmployee}
        isDeleting={isDeleting}
      />

      {/* 4. Yangi Xodim Qo'shish Modali */}
      <AddXodimModal
        opened={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddEmployee={handleAddEmployee}
        isSubmitting={isCreating}
      />
    </div>
  )
}

export default BossXodimlarPage