import { useState, useMemo } from "react"
import { toast } from "sonner"
import { Modal as MantineModal } from "@mantine/core"
import { Users, Truck, CheckCircle2, UserPlus, Plus, Download, Search, MapPin, Pencil, Eye, EyeOff, Phone, KeyRound, Briefcase } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, Button, TablePagination } from "@/shared/ui"
import { useStaff } from "@/shared"

export function BossXodimlarPage() {
  const [employees, setEmployees] = useState([])
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

  // Yangi xodim qo'shish modal holati
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    phone: "+998 ",
    password: "",
    roleType: "courier",
    roleTitle: "Dastavkachi",
    sector: "Markaziy sektor",
    vehicle: "Labo",
  })
  const [showPassword, setShowPassword] = useState(false)

  // Xodimni tahrirlash modal holati (Edit icon bosilganda ochiladi)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [showEditPassword, setShowEditPassword] = useState(false)

  // 1. Hisob-kitoblar (Top KPI lar)
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

  // 2. Qidiruv va Tab bo'yicha filtrlash
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

  // Paginatsiya hisob-kitoblari
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage) || 1
  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredEmployees.slice(start, start + itemsPerPage)
  }, [filteredEmployees, currentPage, itemsPerPage])

  // 3. Yangi xodim qo'shish
  const handleAddEmployee = (e) => {
    e.preventDefault()

    if (!newEmployee.name.trim()) {
      toast.error("Iltimos, xodimning to'liq ism-familiyasini kiriting!")
      return
    }

    if (newEmployee.phone.trim().length < 9) {
      toast.error("Iltimos, to'liq telefon raqamini kiriting!")
      return
    }

    if (!newEmployee.password.trim() || newEmployee.password.length < 4) {
      toast.error("Tizimga kirish paroli kamida 4 ta belgidan iborat bo'lishi kerak!")
      return
    }

    const initials = newEmployee.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)

    const createdEmp = {
      id: Date.now(),
      name: newEmployee.name,
      initials: initials || "XD",
      phone: newEmployee.phone,
      roleType: newEmployee.roleType,
      roleTitle:
        newEmployee.roleType === "manager"
          ? newEmployee.roleTitle || "Menejer"
          : newEmployee.roleTitle || "Dastavkachi",
      sector: newEmployee.sector || "Umumiy sektor",
      stats: newEmployee.roleType === "manager" ? "Boshqaruv shtabi" : "0 buyurtma (Yangi)",
      subStats: newEmployee.roleType === "manager" ? "Nazorat va koordinatsiya" : "Smena tayyor",
      rating: newEmployee.roleType === "manager" ? "—" : "5.00",
      status: "active_online",
      statusText: "Faol (Online)",
      password: newEmployee.password,
      vehicle: newEmployee.vehicle || "Biriktirilmagan",
    }

    setEmployees((prev) => [createdEmp, ...prev])
    setIsAddModalOpen(false)

    // Formani tozalash
    setNewEmployee({
      name: "",
      phone: "+998 ",
      password: "",
      roleType: "courier",
      roleTitle: "Dastavkachi",
      sector: "Markaziy sektor",
      vehicle: "Labo",
    })

    toast.success(
      `Yangi xodim qo'shildi! Login: ${createdEmp.phone} | Parol: ${createdEmp.password}`,
      { duration: 6000 }
    )
  }

  // 4. Xodimni tahrirlash modalini ochish
  const handleOpenEditModal = (emp) => {
    setEditingEmployee({ ...emp })
    setShowEditPassword(false)
    setIsEditModalOpen(true)
  }

  // 5. Tahrirlangan xodimni saqlash
  const handleSaveEditEmployee = (e) => {
    e.preventDefault()

    if (!editingEmployee.name.trim()) {
      toast.error("Iltimos, ism-familiyani kiriting!")
      return
    }

    if (!editingEmployee.phone.trim()) {
      toast.error("Iltimos, telefon raqamini kiriting!")
      return
    }

    if (!editingEmployee.password.trim()) {
      toast.error("Iltimos, parolni kiriting!")
      return
    }

    setEmployees((prev) =>
      prev.map((item) => (item.id === editingEmployee.id ? { ...editingEmployee } : item))
    )

    setIsEditModalOpen(false)
    toast.success(`${editingEmployee.name} ma'lumotlari muvaffaqiyatli yangilandi!`)
  }

  // 6. Switch Toggle orqali bloklash / faollashtirish
  const handleToggleBlock = (emp) => {
    setEmployees((prev) =>
      prev.map((item) => {
        if (item.id === emp.id) {
          const isCurrentlyBlocked = item.status === "blocked"
          const newStatus = isCurrentlyBlocked ? "active_online" : "blocked"
          const newStatusText = isCurrentlyBlocked ? "Faol (Online)" : "Bloklangan"

          if (isCurrentlyBlocked) {
            toast.success(`${item.name} hisobi muvaffaqiyatli faollashtirildi!`)
          } else {
            toast.warning(`${item.name} tizimdan bloklandi.`)
          }

          return {
            ...item,
            status: newStatus,
            statusText: newStatusText,
          }
        }
        return item
      })
    )
  }

  // 7. CSV eksport
  const handleExportCSV = () => {
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Karta 1: Jami shtat birligi */}
        <Card className="border border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-xs transition-all duration-200 rounded-2xl flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0 p-4">
            <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              JAMI SHTAT BIRLIGI
            </CardTitle>
            <div className="size-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-blue-600">
              <Users className="size-4 stroke-2" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                {stats.total}
              </span>
              <span className="text-xs font-medium text-slate-500">nafar</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-2.5 pt-2 border-t border-slate-100">
              <span>{stats.managersCount} ta Manager</span>
              <span>{stats.couriersCount} ta Dastavkachi</span>
            </div>
          </CardContent>
        </Card>

        {/* Karta 2: Faol smenada */}
        <Card className="border border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-xs transition-all duration-200 rounded-2xl flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0 p-4">
            <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              FAOL SMENADA
            </CardTitle>
            <div className="size-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-blue-600">
              <Truck className="size-4 stroke-2" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                {stats.activeCount}
              </span>
              <span className="text-xs font-medium text-slate-500">nafar</span>
            </div>
            <div className="mt-2.5">
              <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                Yo'nalishda &amp; Navbatchi
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Karta 3: Yetkazish intizomi */}
        <Card className="border border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-xs transition-all duration-200 rounded-2xl flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0 p-4">
            <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              YETKAZISH INTIZOMI
            </CardTitle>
            <div className="size-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-blue-600">
              <CheckCircle2 className="size-4 stroke-2" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl  font-extrabold tracking-tight text-slate-900">
                0
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2.5 leading-tight">
              Ma'lumot mavjud emas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Filtrlash, Qidiruv va Tablar */}
      <Card className="border border-slate-200/90 bg-white shadow-xs rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Qidiruv inputi */}
          <div className="relative flex-1 max-w-md">
            <Search className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Ism, telefon yoki hudud bo'yicha qidiruv..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full h-9.5 pl-9.5 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Filtrlash tugmalari (Tabs) */}
          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl self-start md:self-auto">
            <button
              type="button"
              onClick={() => handleTabChange("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                activeTab === "all"
                  ? "bg-white text-blue-600 shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Barchasi ({employees.length})
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("couriers")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                activeTab === "couriers"
                  ? "bg-white text-blue-600 shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Dastavkachilar ({stats.couriersCount})
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("managers")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                activeTab === "managers"
                  ? "bg-white text-blue-600 shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Managerlar ({stats.managersCount})
            </button>
          </div>
        </div>

        {/* 4. Asosiy Xodimlar Jadvali */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <colgroup>
              <col className="w-[18%]" />
              <col className="w-[15%]" />
              <col className="w-[14%]" />
              <col className="w-[15%]" />
              <col className="w-[17%]" />
              <col className="w-[11%]" />
              <col className="w-[10%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4 font-semibold">Xodim</th>
                <th className="py-3.5 px-4 font-semibold">Telefon Raqami</th>
                <th className="py-3.5 px-4 font-semibold">Roli</th>
                <th className="py-3.5 px-4 font-semibold">Hudud</th>
                <th className="py-3.5 px-4 font-semibold">Bugungi Natija / Yuklama</th>
                <th className="py-3.5 px-4 font-semibold">Holati</th>
                <th className="py-3.5 px-4 font-semibold text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                    {employees.length === 0
                      ? "Hozircha xodimlar yo'q. «Yangi Xodim Qo'shish» tugmasi orqali qo'shing."
                      : "Qidiruv bo'yicha hech qanday xodim topilmadi."}
                  </td>
                </tr>
              ) : (
                paginatedEmployees.map((emp) => {
                  const isBlocked = emp.status === "blocked"

                  return (
                    <tr
                      key={emp.id}
                      className="hover:bg-blue-50/30 transition-colors group"
                    >
                      {/* Xodim */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="size-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-xs text-blue-700 shrink-0">
                            {emp.initials}
                          </div>
                          <span className="font-bold text-slate-900 block leading-tight truncate">
                            {emp.name}
                          </span>
                        </div>
                      </td>

                      {/* Telefon Raqami */}
                      <td className="py-3.5 px-4">
                        <span className="text-xs font-semibold text-slate-700 font-mono tracking-tight block">
                          {emp.phone}
                        </span>
                      </td>

                      {/* Roli */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800 block truncate">
                          {emp.roleTitle}
                        </span>
                        <span className="text-[11px] text-slate-400 block mt-0.5 font-medium">
                          {emp.roleType === "manager" ? "Boshqaruv" : "Kuryerlik"}
                        </span>
                      </td>

                      {/* Hudud */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <MapPin className="size-3.5 text-slate-400 shrink-0" />
                          <span className="font-medium text-slate-800 truncate">{emp.sector}</span>
                        </div>
                      </td>

                      {/* Bugungi Natija / Yuklama */}
                      <td className="py-3.5 px-4">
                        <div>
                          <span className="font-bold text-slate-900 block truncate">
                            {emp.stats}
                          </span>
                          <span className="text-[11px] text-slate-400 block mt-0.5 truncate">
                            {emp.subStats}
                          </span>
                        </div>
                      </td>

                      {/* Holati */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border whitespace-nowrap ${
                            isBlocked
                              ? "bg-rose-50 text-rose-700 border-rose-100"
                              : "bg-blue-50 text-blue-700 border-blue-100"
                          }`}
                        >
                          <span
                            className={`size-1.5 rounded-full shrink-0 ${
                              isBlocked ? "bg-rose-500" : "bg-blue-600"
                            }`}
                          ></span>
                          <span>{isBlocked ? "Bloklangan" : emp.statusText}</span>
                        </span>
                      </td>

                      {/* Amallar: Faqat Tahrirlash (Pencil) va Switch Toggle */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          {/* Tahrirlash (Edit Icon) */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(emp)}
                            title="Xodimni tahrirlash"
                            className="size-8 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/50 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Pencil className="size-3.5" />
                          </button>

                          {/* Switch toggle (Faol / Bloklangan) */}
                          <button
                            type="button"
                            role="switch"
                            aria-checked={!isBlocked}
                            onClick={() => handleToggleBlock(emp)}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              !isBlocked ? "bg-blue-600" : "bg-slate-300"
                            }`}
                            title={
                              !isBlocked
                                ? "Faol (Bloklash uchun bosing)"
                                : "Bloklangan (Faollashtirish uchun bosing)"
                            }
                          >
                            <span
                              aria-hidden="true"
                              className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                !isBlocked ? "translate-x-4" : "translate-x-0"
                              }`}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 5. Jadval Pagination Tashqarida */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 px-1 pt-1">
        <div>
          Jami {filteredEmployees.length} xodimdan {paginatedEmployees.length} tasi ko'rsatilmoqda
        </div>
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          className="p-0"
        />
      </div>


      {/* 7. MODAL: Yangi Xodim Qo'shish (Manager yoki Dastavkachi) */}
      <MantineModal
        opened={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
              <UserPlus className="size-5 stroke-2" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Yangi Xodim Qo'shish
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Manager yoki Dastavkachi uchun tizimga kirish akkaunti ochish
              </p>
            </div>
          </div>
        }
        size="620px"
        centered
        radius="xl"
        styles={{
          content: {
            borderRadius: "24px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 25px 60px -15px rgba(15, 23, 42, 0.2)",
            minHeight: "560px",
          },
          header: {
            borderBottom: "1px solid #f1f5f9",
            padding: "20px 28px",
            backgroundColor: "#ffffff",
          },
          body: {
            padding: "24px 28px 28px",
          },
        }}
      >
        <form onSubmit={handleAddEmployee} className="space-y-4.5">
          {/* Xodim roli tanlash (Manager yoki Dastavkachi) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Xodim Lavozimi / Roli *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  setNewEmployee((prev) => ({
                    ...prev,
                    roleType: "courier",
                    roleTitle: "Dastavkachi",
                    vehicle: "Labo",
                  }))
                }
                className={`p-3.5 rounded-xl border-2 flex items-center gap-3 transition-all cursor-pointer text-left ${
                  newEmployee.roleType === "courier"
                    ? "border-blue-600 bg-blue-50/70 text-blue-900 shadow-2xs ring-2 ring-blue-500/10"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/60"
                }`}
              >
                <div
                  className={`size-9 rounded-xl flex items-center justify-center shrink-0 ${
                    newEmployee.roleType === "courier"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <Truck className="size-4.5" />
                </div>
                <div>
                  <span className="text-sm font-bold block text-slate-900">Dastavkachi</span>
                  <span className="text-xs text-slate-500 font-medium">Haydovchi / Kuryer</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  setNewEmployee((prev) => ({
                    ...prev,
                    roleType: "manager",
                    roleTitle: "Logistika Menejeri",
                    vehicle: "Boshqaruv shtabi",
                  }))
                }
                className={`p-3.5 rounded-xl border-2 flex items-center gap-3 transition-all cursor-pointer text-left ${
                  newEmployee.roleType === "manager"
                    ? "border-blue-600 bg-blue-50/70 text-blue-900 shadow-2xs ring-2 ring-blue-500/10"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/60"
                }`}
              >
                <div
                  className={`size-9 rounded-xl flex items-center justify-center shrink-0 ${
                    newEmployee.roleType === "manager"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <Briefcase className="size-4.5" />
                </div>
                <div>
                  <span className="text-sm font-bold block text-slate-900">Menejer</span>
                  <span className="text-xs text-slate-500 font-medium">Dispetcher / Nazorat</span>
                </div>
              </button>
            </div>
          </div>

          {/* Ism va familiya */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Ism va Familiya *
            </label>
            <input
              type="text"
              placeholder="Masalan: Anvar Qodirov"
              value={newEmployee.name}
              onChange={(e) =>
                setNewEmployee((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
              required
            />
          </div>

          {/* Telefon Raqami (Login) va Kirish Paroli */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Telefon (Login) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Phone className="size-3.5 text-blue-600" />
                <span>Telefon Raqam (Login) *</span>
              </label>
              <input
                type="text"
                placeholder="+998 90 123 45 67"
                value={newEmployee.phone}
                onChange={(e) =>
                  setNewEmployee((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                required
              />
            </div>

            {/* Parol */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <KeyRound className="size-3.5 text-blue-600" />
                <span>Kirish Paroli *</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masalan: oazis#2026"
                  value={newEmployee.password}
                  onChange={(e) =>
                    setNewEmployee((prev) => ({ ...prev, password: e.target.value }))
                  }
                  className="w-full h-11 pl-4 pr-11 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Hudud va Transport */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Hudud / Bo'lim */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Biriktirilgan Hudud / Bo'lim *
              </label>
              <select
                value={newEmployee.sector}
                onChange={(e) =>
                  setNewEmployee((prev) => ({ ...prev, sector: e.target.value }))
                }
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer font-medium"
              >
                <option value="Markaziy sektor">Markaziy sektor</option>
                <option value="Shimoliy mikrorayon">Shimoliy mikrorayon</option>
                <option value="Janubiy sanoat zonasi">Janubiy sanoat zonasi</option>
                <option value="G'arbiy daha">G'arbiy daha</option>
                <option value="Omborxona & Zaxira">Omborxona &amp; Zaxira</option>
                <option value="Dispetcherlik shtabi">Dispetcherlik shtabi</option>
              </select>
            </div>

            {/* Transport vositasi (Dastavkachi uchun) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                {newEmployee.roleType === "courier"
                  ? "Avtomobil Rusumi"
                  : "Ish Joyi / Xona"}
              </label>
              <input
                type="text"
                placeholder={
                  newEmployee.roleType === "courier"
                    ? "Masalan: Labo (70 A 123 AA)"
                    : "Masalan: 2-boshqaruv xonasi"
                }
                value={newEmployee.vehicle}
                onChange={(e) =>
                  setNewEmployee((prev) => ({ ...prev, vehicle: e.target.value }))
                }
                className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
              />
            </div>
          </div>

          {/* Tugmalar */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 mt-5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
              className="h-10.5 px-5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 text-sm font-semibold transition-all cursor-pointer"
            >
              Bekor qilish
            </Button>
            <Button
              type="submit"
              variant="default"
              size="sm"
              className="h-10.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer active:scale-[0.99]"
            >
              <CheckCircle2 className="size-4" />
              <span>Saqlash va Ruxsat Berish</span>
            </Button>
          </div>
        </form>
      </MantineModal>

      {/* 8. MODAL: Xodim Ma'lumotlarini Tahrirlash (Edit Icon bosilganda ochiladi) */}
      <MantineModal
        opened={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
              <Pencil className="size-5 stroke-2" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Xodimni Tahrirlash
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Ma'lumotlar, login, parol va biriktirilgan hududni o'zgartirish
              </p>
            </div>
          </div>
        }
        size="620px"
        centered
        radius="xl"
        styles={{
          content: {
            borderRadius: "24px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 25px 60px -15px rgba(15, 23, 42, 0.2)",
            minHeight: "560px",
          },
          header: {
            borderBottom: "1px solid #f1f5f9",
            padding: "20px 28px",
            backgroundColor: "#ffffff",
          },
          body: {
            padding: "24px 28px 28px",
          },
        }}
      >
        {editingEmployee && (
          <form onSubmit={handleSaveEditEmployee} className="space-y-4.5">
            {/* Ism va Familiya */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Ism va Familiya *
              </label>
              <input
                type="text"
                value={editingEmployee.name}
                onChange={(e) =>
                  setEditingEmployee((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                required
              />
            </div>

            {/* Roli va Lavozimi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Xodim Turi *
                </label>
                <select
                  value={editingEmployee.roleType}
                  onChange={(e) =>
                    setEditingEmployee((prev) => ({
                      ...prev,
                      roleType: e.target.value,
                      roleTitle:
                        e.target.value === "manager"
                          ? "Logistika Menejeri"
                          : "Dastavkachi",
                    }))
                  }
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer font-medium"
                >
                  <option value="courier">Dastavkachi (Kuryer)</option>
                  <option value="manager">Menejer (Dispetcher)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Lavozim Nomi
                </label>
                <input
                  type="text"
                  value={editingEmployee.roleTitle}
                  onChange={(e) =>
                    setEditingEmployee((prev) => ({ ...prev, roleTitle: e.target.value }))
                  }
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                />
              </div>
            </div>

            {/* Telefon (Login) va Parol */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Phone className="size-3.5 text-blue-600" />
                  <span>Telefon (Login) *</span>
                </label>
                <input
                  type="text"
                  value={editingEmployee.phone}
                  onChange={(e) =>
                    setEditingEmployee((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <KeyRound className="size-3.5 text-blue-600" />
                  <span>Kirish Paroli *</span>
                </label>
                <div className="relative">
                  <input
                    type={showEditPassword ? "text" : "password"}
                    value={editingEmployee.password}
                    onChange={(e) =>
                      setEditingEmployee((prev) => ({ ...prev, password: e.target.value }))
                    }
                    className="w-full h-11 pl-4 pr-11 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPassword(!showEditPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  >
                    {showEditPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Biriktirilgan Hudud va Transport */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Biriktirilgan Hudud / Bo'lim *
                </label>
                <select
                  value={editingEmployee.sector}
                  onChange={(e) =>
                    setEditingEmployee((prev) => ({ ...prev, sector: e.target.value }))
                  }
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer font-medium"
                >
                  <option value="Markaziy sektor">Markaziy sektor</option>
                  <option value="Shimoliy mikrorayon">Shimoliy mikrorayon</option>
                  <option value="Janubiy sanoat zonasi">Janubiy sanoat zonasi</option>
                  <option value="G'arbiy daha">G'arbiy daha</option>
                  <option value="Omborxona & Zaxira">Omborxona &amp; Zaxira</option>
                  <option value="Dispetcherlik shtabi">Dispetcherlik shtabi</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Transport / Xona
                </label>
                <input
                  type="text"
                  value={editingEmployee.vehicle}
                  onChange={(e) =>
                    setEditingEmployee((prev) => ({ ...prev, vehicle: e.target.value }))
                  }
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                />
              </div>
            </div>

            {/* Tugmalar */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 mt-5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditModalOpen(false)}
                className="h-10.5 px-5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 text-sm font-semibold transition-all cursor-pointer"
              >
                Bekor qilish
              </Button>
              <Button
                type="submit"
                variant="default"
                size="sm"
                className="h-10.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer active:scale-[0.99]"
              >
                <CheckCircle2 className="size-4" />
                <span>O'zgarishlarni Saqlash</span>
              </Button>
            </div>
          </form>
        )}
      </MantineModal>
    </div>
  )
}

export default BossXodimlarPage;