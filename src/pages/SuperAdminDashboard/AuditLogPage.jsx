import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { Button, Card, CardContent, CardHeader, CardTitle, Input, TablePagination, Spinner } from "@/shared/ui"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/shared/ui/table"
import { ChevronDown, Upload, RotateCw, Calendar, History, ListFilter, ShieldAlert, Search, User, Phone } from "lucide-react"
import { toast } from "sonner"
import {
  useAuditLogs,
  useAuditLogStats,
  useAuditLogFilters,
  useExportAuditLogs,
  useDebounce,
} from "@/shared/hooks"
import { formatDate, exportToCsv } from "@/shared/lib"
import {
  buildPeriodOptions,
  buildActionOptions,
  buildObjectOptions,
  buildAdminOptions,
  mapAuditLogItem,
  calculateAuditStats,
  resolveTotalPages,
} from "./auditLog.utils"

const CustomDropdown = ({ value, onChange, options = [], icon: Icon, prefix = "", className = "" }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && open) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [open])

  const selectedOption =
    options.find((o) => String(o.value) === String(value)) ||
    options[0] ||
    { label: "Tanlang" }

  const rawLabel = selectedOption?.label || "Tanlang"
  const displayLabel = !prefix
    ? rawLabel
    : rawLabel.toLowerCase().startsWith(prefix.toLowerCase())
    ? rawLabel
    : `${prefix}: ${rawLabel}`

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="h-9 sm:h-10 px-3 sm:px-3.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between gap-2 shadow-xs transition-colors cursor-pointer w-full lg:w-auto min-w-[130px]"
      >
        <span className="flex items-center gap-1.5 sm:gap-2 truncate">
          {Icon && <Icon className="size-3.5 sm:size-4 text-blue-600 shrink-0" />}
          <span className="truncate">{displayLabel}</span>
        </span>
        <ChevronDown
          className={`size-3.5 sm:size-4 text-slate-400 shrink-0 transition-transform duration-200 ${
            open ? "rotate-180 text-blue-600" : ""
          }`}
        />
      </button>

      {open && options.length > 0 && (
        <div
          role="listbox"
          aria-label="Tanlov ro'yxati"
          className="absolute right-0 md:left-0 mt-1.5 max-h-60 overflow-y-auto w-56 bg-white rounded-xl border border-slate-200 shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
        >
          {options.map((opt) => (
            <div
              key={String(opt.value)}
              role="option"
              aria-selected={String(value) === String(opt.value)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  onChange(opt.value)
                  setOpen(false)
                }
              }}
              onClick={() => {
                onChange(opt.value)
                setOpen(false)
              }}
              className={`px-3 py-2 text-xs font-medium rounded-lg cursor-pointer transition-colors flex items-center justify-between outline-none focus-visible:bg-blue-50 focus-visible:text-blue-600 ${
                String(value) === String(opt.value)
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span className="truncate">{opt.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const AuditLogPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearch = useDebounce(searchTerm, 400)
  const [selectedPeriod, setSelectedPeriod] = useState("")
  const [selectedAction, setSelectedAction] = useState("all")
  const [selectedObject, setSelectedObject] = useState("all")
  const [selectedAdmin, setSelectedAdmin] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [isExporting, setIsExporting] = useState(false)
  const itemsPerPage = 10

  // 1. Fetch Dynamic Filters from API
  const {
    data: filtersResponse,
    isLoading: isLoadingFilters,
    isError: isFiltersError,
    refetch: refetchFilters,
  } = useAuditLogFilters()
  const filtersData = filtersResponse?.data || filtersResponse
  const isFiltersSettled = !isLoadingFilters || Boolean(isFiltersError)

  const periodOptions = useMemo(() => {
    return buildPeriodOptions(filtersData?.periods)
  }, [filtersData])

  // Derive the active period without cascading setState in useEffect
  const activePeriod = useMemo(() => {
    if (selectedPeriod && periodOptions.some((p) => p.value === selectedPeriod)) {
      return selectedPeriod
    }
    return periodOptions[0]?.value || ""
  }, [selectedPeriod, periodOptions])

  const actionOptions = useMemo(() => {
    return buildActionOptions(filtersData?.actionTypes)
  }, [filtersData])

  const objectOptions = useMemo(() => {
    return buildObjectOptions(filtersData?.objectTypes)
  }, [filtersData])

  const adminOptions = useMemo(() => {
    return buildAdminOptions(filtersData?.superAdmins)
  }, [filtersData])

  // 2. Fetch KPI Stats from API (waits until filters settle to avoid double request)
  const statsParams = useMemo(() => {
    return activePeriod && activePeriod !== "ALL" ? { period: activePeriod } : {}
  }, [activePeriod])

  const { data: statsResponse, refetch: refetchStats } = useAuditLogStats(statsParams, {
    enabled: isFiltersSettled,
  })
  const statsData = statsResponse?.data || statsResponse

  // 3. Fetch Audit Logs Query (waits until filters settle to avoid double request)
  const queryParams = useMemo(() => {
    const params = {
      page: currentPage - 1,
      size: itemsPerPage,
    }
    if (activePeriod && activePeriod !== "ALL") params.period = activePeriod
    if (selectedAction && selectedAction !== "all") params.action = selectedAction
    if (selectedObject && selectedObject !== "all") params.entityType = selectedObject
    if (selectedAdmin && selectedAdmin !== "all") params.actorId = selectedAdmin
    if (debouncedSearch.trim()) params.search = debouncedSearch.trim()
    return params
  }, [currentPage, itemsPerPage, activePeriod, selectedAction, selectedObject, selectedAdmin, debouncedSearch])

  const {
    data: auditData,
    isPending,
    isFetching,
    error: logsError,
    refetch: refetchLogs,
  } = useAuditLogs(queryParams, {
    enabled: isFiltersSettled,
  })

  // 4. Export Mutation
  const exportMutation = useExportAuditLogs()

  const handleRefreshAll = useCallback(async () => {
    await Promise.all([refetchLogs(), refetchStats(), refetchFilters()])
  }, [refetchLogs, refetchStats, refetchFilters])

  const rawLogs = useMemo(() => {
    if (Array.isArray(auditData?.data?.content)) return auditData.data.content
    if (Array.isArray(auditData?.content)) return auditData.content
    if (Array.isArray(auditData?.data)) return auditData.data
    if (Array.isArray(auditData)) return auditData
    return []
  }, [auditData])

  const logsList = useMemo(() => {
    return rawLogs.map(mapAuditLogItem)
  }, [rawLogs])

  const stats = useMemo(() => {
    const totalElements = auditData?.data?.totalElements ?? auditData?.totalElements ?? null
    return calculateAuditStats(statsData, rawLogs, totalElements)
  }, [statsData, rawLogs, auditData])

  const auditStatsCards = useMemo(() => {
    return [
      {
        id: "total-actions",
        title: "JAMI QAYDLAR",
        value: stats.totalLogs.toLocaleString("uz-UZ"),
        unit: "ta qayd",
        badge: "REAL-TIME",
        subtitle: "Tizimdagi jami audit jurnali",
        icon: History,
      },
      {
        id: "farm-actions",
        title: "FERMA AMALLARI",
        value: stats.farmActions.toLocaleString("uz-UZ"),
        unit: "amaliyot",
        badge: null,
        subtitle: "Ferma status va sozlamalari",
        icon: ListFilter,
      },
      {
        id: "user-actions",
        title: "RAHBAR & USER AMALLARI",
        value: stats.userActions.toLocaleString("uz-UZ"),
        unit: "amaliyot",
        badge: null,
        subtitle: "Rahbarlar va foydalanuvchilar",
        icon: ShieldAlert,
      },
    ]
  }, [stats])

  const totalPages = useMemo(() => {
    const serverPages = auditData?.data?.totalPages ?? auditData?.totalPages
    const totalElements = auditData?.data?.totalElements ?? auditData?.totalElements
    return resolveTotalPages(serverPages, totalElements, logsList.length, itemsPerPage)
  }, [auditData, logsList.length, itemsPerPage])

  const handleExport = async () => {
    if (isExporting) return
    const toastId = "audit-export-action"
    try {
      setIsExporting(true)
      toast.loading("Audit log eksport qilinmoqda...", { id: toastId })

      const exportParams = {
        ...(activePeriod && activePeriod !== "ALL" ? { period: activePeriod } : {}),
        ...(selectedAction !== "all" ? { action: selectedAction } : {}),
        ...(selectedObject !== "all" ? { entityType: selectedObject } : {}),
        ...(selectedAdmin !== "all" ? { actorId: selectedAdmin } : {}),
        ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
      }

      const response = await exportMutation.mutateAsync(exportParams)
      const blob = response?.data instanceof Blob ? response.data : new Blob([response?.data || response])

      let filename = `audit-logs-${formatDate(new Date()).replace(/\./g, "-")}.csv`
      const disposition = response?.headers?.["content-disposition"]
      if (disposition && disposition.includes("filename=")) {
        const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
        if (match?.[1]) {
          filename = match[1].replace(/['"]/g, "")
        }
      }

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", filename)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success("Audit log muvaffaqiyatli yuklab olindi!", { id: toastId })
    } catch (err) {
      if (logsList.length > 0) {
        const headers = ["Sana va vaqt", "SuperAdmin", "Boss", "Nomer", "Ta'sir etilgan obyekt", "Tavsif"]
        const rows = logsList.map((log) => [
          `${log.date} ${log.time}`,
          log.admin.name,
          log.boss.name,
          log.phone,
          log.target.name,
          log.description,
        ])
        exportToCsv(`audit-logs-${formatDate(new Date()).replace(/\./g, "-")}`, headers, rows)
        toast.success("Audit log jadval ma'lumotlari CSV formatida yuklab olindi!", { id: toastId })
      } else {
        toast.error(err?.message || "Audit log eksport qilishda xatolik yuz berdi", { id: toastId })
      }
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <section className="space-y-6">
      <div>
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center pt-2 sm:pt-3 gap-3 sm:gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Audit Log va Xavfsizlik Jurnali</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Faqat SuperAdmin amallari va tizim darajasidagi xavfsizlik hodisalari qaydnomasi.
            </p>
          </div>

          <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 sm:gap-2.5">
            {periodOptions.length > 0 && (
              <CustomDropdown
                value={activePeriod}
                onChange={(val) => {
                  setSelectedPeriod(val)
                  setCurrentPage(1)
                }}
                options={periodOptions}
                icon={Calendar}
              />
            )}

            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting}
              className="h-9 sm:h-10 px-3 sm:px-3.5 flex items-center gap-1.5 sm:gap-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-700 shadow-xs hover:bg-slate-50 disabled:opacity-60 transition-colors whitespace-nowrap cursor-pointer"
            >
              <Upload className="size-3.5 sm:size-4 text-slate-500" />
              <span>{isExporting ? "Yuklanmoqda..." : "Eksport"}</span>
            </button>

            <Button
              type="button"
              onClick={handleRefreshAll}
              disabled={isFetching || isLoadingFilters}
              className="h-9 sm:h-10 px-3 sm:px-3.5 flex items-center gap-1.5 sm:gap-2 rounded-xl bg-blue-600 text-white text-xs sm:text-sm font-medium shadow-xs hover:bg-blue-700 disabled:opacity-70 transition-colors whitespace-nowrap cursor-pointer shrink-0"
            >
              <RotateCw className={`size-3.5 sm:size-4 ${isFetching ? "animate-spin" : ""}`} />
              <span>Yangilash</span>
            </Button>
          </div>
        </div>

        {/* 3 ta Metrika Card */}
        <div className="pt-4 sm:pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {auditStatsCards.map((audit) => {
            const Icon = audit.icon
            return (
              <Card key={audit.id} className="bg-white border border-slate-200/80 shadow-xs rounded-xl">
                <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-5 pb-2 space-y-0">
                  <CardTitle className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                    {audit.title}
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-5 pt-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl sm:text-2xl font-bold text-slate-900">{audit.value}</span>
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
        <div className="mt-4 sm:mt-6 bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">
          <div className="relative w-full lg:w-72 xl:w-80 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <Input
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Obyekt yoki amal bo'yicha qidirish..."
              className="pl-9 h-10 w-full rounded-xl border-slate-200 bg-white placeholder:text-slate-400 text-xs font-medium focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-100"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:flex lg:flex-nowrap items-center gap-2.5 w-full lg:w-auto">
            <CustomDropdown
              prefix="Amal turi"
              value={selectedAction}
              onChange={(val) => {
                setSelectedAction(val)
                setCurrentPage(1)
              }}
              options={actionOptions}
            />

            <CustomDropdown
              prefix="Obyekt"
              value={selectedObject}
              onChange={(val) => {
                setSelectedObject(val)
                setCurrentPage(1)
              }}
              options={objectOptions}
            />

            <CustomDropdown
              prefix="SuperAdmin"
              value={selectedAdmin}
              onChange={(val) => {
                setSelectedAdmin(val)
                setCurrentPage(1)
              }}
              options={adminOptions}
            />
          </div>
        </div>

        {/* Table */}
        <div className="mt-4 bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden min-h-96">
          <div className="overflow-x-auto w-full">
            <Table className="w-full text-left min-w-[750px] lg:min-w-full">
              <TableHeader className="bg-slate-50 border-b border-slate-100">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap w-36">
                    Sana va vaqt
                  </TableHead>
                  <TableHead className="py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap w-44">
                    SuperAdmin
                  </TableHead>
                  <TableHead className="py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap w-40">
                    Boss
                  </TableHead>
                  <TableHead className="py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap w-36">
                    Nomer
                  </TableHead>
                  <TableHead className="py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap w-40">
                    Ta'sir etilgan obyekt
                  </TableHead>
                  <TableHead className="py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap min-w-56">
                    Tavsif
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isPending ? (
                  <TableRow>
                    <TableCell colSpan={6} className="p-0 py-16 text-center">
                      <div className="sticky left-0 sm:static w-[calc(100vw-2rem)] sm:w-full flex flex-col items-center justify-center gap-3 px-4 whitespace-normal">
                        <Spinner size="md" />
                        <p className="text-sm font-medium text-slate-500">Audit loglari yuklanmoqda...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : logsError ? (
                  <TableRow>
                    <TableCell colSpan={6} className="p-0 py-16 text-center">
                      <div className="sticky left-0 sm:static w-[calc(100vw-2rem)] sm:w-full flex flex-col items-center justify-center gap-2 text-rose-600 px-4 whitespace-normal">
                        <p className="text-sm font-semibold">Ma'lumotlarni yuklashda xatolik yuz berdi</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => refetchLogs()}
                          className="mt-2 text-xs"
                        >
                          Qayta urinish
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : logsList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="p-0 py-16 text-center text-sm text-slate-500">
                      <div className="sticky left-0 sm:static w-[calc(100vw-2rem)] sm:w-full flex flex-col items-center justify-center gap-2 px-4 whitespace-normal">
                        <span>Qaydlar topilmadi</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  logsList.map((log) => (
                    <TableRow
                      key={log.id}
                      className="hover:bg-slate-50/70 transition-colors border-b border-slate-100 last:border-b-0 h-16"
                    >
                      <TableCell className="py-4 px-4 whitespace-nowrap w-36 align-middle">
                        <div className="text-xs font-semibold text-slate-800">
                          {log.date}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                          {log.time}
                        </div>
                      </TableCell>

                      <TableCell className="py-4 px-4 whitespace-nowrap w-44 align-middle">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                            {log.admin.avatarText}
                          </div>
                          <span className="text-xs font-semibold text-slate-800">
                            {log.admin.name}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="py-4 px-4 whitespace-nowrap w-40 align-middle">
                        {log.boss.name && log.boss.name !== "—" ? (
                          <div className="flex items-center gap-2">
                            <User className="size-3.5 text-slate-400 shrink-0" />
                            <span className="text-xs font-semibold text-slate-800 truncate max-w-[140px]" title={log.boss.name}>
                              {log.boss.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 font-mono">—</span>
                        )}
                      </TableCell>

                      <TableCell className="py-4 px-4 whitespace-nowrap w-36 align-middle">
                        {log.phone && log.phone !== "—" ? (
                          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700 font-mono">
                            <Phone className="size-3.5 text-slate-400 shrink-0" />
                            <span>{log.phone}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 font-mono">—</span>
                        )}
                      </TableCell>

                      <TableCell className="py-4 px-4 whitespace-nowrap w-40 align-middle">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                          {log.target.name}
                        </span>
                      </TableCell>

                      <TableCell className="py-4 px-4 align-middle min-w-56">
                        <p className="text-xs text-slate-700 font-medium truncate max-w-xs xl:max-w-md" title={log.description}>
                          {log.description}
                        </p>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="pt-6 pb-2"
          />
        )}
      </div>
    </section>
  )
}

export default AuditLogPage
