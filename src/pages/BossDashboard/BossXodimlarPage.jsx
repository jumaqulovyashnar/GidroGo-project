import { useState, useMemo } from "react"
import { Plus, Download } from "lucide-react"
import { Button } from "@/shared/ui"
import { useStaff } from "@/shared"
import { XodimlarStats } from "./components/XodimlarStats"
import { XodimlarTable } from "./components/XodimlarTable"
import { AddXodimModal } from "./components/AddXodimModal"
import { EditXodimModal } from "./components/EditXodimModal"

export function BossXodimlarPage() {
  // 1. FAQAT GET So'rovi: Serverdan kelgan xodimlar ro'yxati
  const { data, isLoading, isError, refetch } = useStaff()

  // API dan kelgan xom ma'lumotlarni massivga aylantirish
  const rawList = useMemo(() => {
    if (Array.isArray(data?.data)) return data.data
    if (Array.isArray(data)) return data
    return []
  }, [data])

  // FAQAT backenddan kelgan ma'lumotlar (hech qanday mock yoki local sun'iy ro'yxat yo'q!)
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

      return {
        id: item.id,
        name: item.fullName || item.name || "Noma'lum xodim",
        initials: initials || "XD",
        phone: item.phone || "—",
        roleType,
        roleTitle,
        sector: item.sector || (isManager ? "Boshqaruv shtabi" : "Markaziy sektor"),
        stats: isManager ? "Boshqaruv shtabi" : "0 buyurtma",
        subStats: isManager ? "Nazorat va koordinatsiya" : "Smena tayyor",
        status: isBlocked ? "blocked" : "active_online",
        statusText: isBlocked ? "Bloklangan" : "Faol (Online)",
      }
    })
  }, [rawList])

  // 2. Tab, qidiruv va paginatsiya holatlari
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  const handleSearchChange = (val) => {
    setSearchQuery(val)
    setCurrentPage(1)
  }

  // 3. Modallar holati
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)

  // 4. Statistika (KPI lar) faqat real kelgan ma'lumotlardan hisoblanadi
  const stats = useMemo(() => {
    const total = employees.length
    const managersCount = employees.filter((e) => e.roleType === "manager").length
    const couriersCount = employees.filter((e) => e.roleType === "courier").length
    const activeCount = employees.filter((e) => e.status !== "blocked").length

    return {
      total,
      managersCount,
      couriersCount,
      activeCount,
    }
  }, [employees])

  // 5. Qidiruv va Tab bo'yicha saralash
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      // Tab filtri
      if (activeTab === "couriers" && emp.roleType !== "courier") return false
      if (activeTab === "managers" && emp.roleType !== "manager") return false

      // Qidiruv filtri
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase()
        const matchName = emp.name.toLowerCase().includes(query)
        const matchPhone = emp.phone.toLowerCase().includes(query)
        const matchSector = emp.sector.toLowerCase().includes(query)
        const matchRole = emp.roleTitle.toLowerCase().includes(query)
        return matchName || matchPhone || matchSector || matchRole
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

  // 7. Modallar uchun callbacklar (POST / PATCH ni o'zingiz ulashingiz uchun toza qoldirildi)
  const handleAddEmployee = (newEmpForm) => {
    // Siz o'zingiz POST API ni shu yerga ulaysiz!
    // Hech qanday soxta data ro'yxatga qo'shilmaydi.
    console.log("Yangi xodim yuborish uchun form:", newEmpForm)
    setIsAddModalOpen(false)
  }

  const handleOpenEditModal = (emp) => {
    setEditingEmployee(emp)
    setIsEditModalOpen(true)
  }

  const handleSaveEditEmployee = (updatedEmpForm) => {
    // Siz o'zingiz PATCH/PUT API ni shu yerga ulaysiz!
    console.log("Tahrirlangan xodim form:", updatedEmpForm)
    setIsEditModalOpen(false)
  }

  const handleToggleBlock = (emp) => {
    // Siz o'zingiz Status PATCH API ni shu yerga ulaysiz!
    console.log("Status o'zgarishi kerak bo'lgan xodim:", emp)
  }

  const handleExportCSV = () => {
    // CSV export
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
      <XodimlarStats stats={stats} isLoading={isLoading} />

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
        onEditEmployee={handleOpenEditModal}
        onToggleBlock={handleToggleBlock}
      />

      {/* 4. Yangi Xodim Qo'shish Modali */}
      <AddXodimModal
        opened={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddEmployee={handleAddEmployee}
      />

      {/* 5. Xodimni Tahrirlash Modali */}
      <EditXodimModal
        opened={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingEmployee(null)
        }}
        employee={editingEmployee}
        onSaveEmployee={handleSaveEditEmployee}
      />
    </div>
  )
}

export default BossXodimlarPage