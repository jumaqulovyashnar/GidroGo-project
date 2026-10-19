import React, { useState, useMemo } from "react"
import { Button, TablePagination, Table, TableHeader, TableBody, TableHead, TableRow, TableCell, Spinner, StatCard } from "@/shared/ui"
import { ClipboardClock, RefreshCw, ShieldCheck, SquareExclamationPointIcon, CheckCheck, X, FolderArchive, Archive, Building2, Calendar } from "lucide-react"
import { Modal as MantineModal } from "@mantine/core"
import { useActivationRequests, useRequest } from "@/shared/hooks/useRequest"

const TasdiqlashPage = () => {
  const [activeTab, setActiveTab] = useState("barcha") // "barcha" | "arxiv"
  const [currentPage, setCurrentPage] = useState(1)
  const [rejectModalApp, setRejectModalApp] = useState(null)
  const [rejectReason, setRejectReason] = useState("")

  const { data: responseData, isPending: isLoadingRequests, isFetching, refetch } = useActivationRequests()
  const { mutate, isPending: isDeciding } = useRequest()

  const allRequests = useMemo(() => {
    if (Array.isArray(responseData?.data?.content)) return responseData.data.content
    if (Array.isArray(responseData?.data)) return responseData.data
    if (Array.isArray(responseData)) return responseData
    return []
  }, [responseData])

  // Metrika hisob-kitoblari
  const pendingCount = useMemo(
    () => allRequests.filter((r) => r.status === "PENDING" || !r.status).length,
    [allRequests]
  )
  const approvedCount = useMemo(
    () => allRequests.filter((r) => r.status === "APPROVED").length,
    [allRequests]
  )
  const rejectedCount = useMemo(
    () => allRequests.filter((r) => r.status === "REJECTED").length,
    [allRequests]
  )

  const itemsPerPage = 8

  // Tab bo'yicha filtrlash
  const filteredList = useMemo(() => {
    if (activeTab === "arxiv") {
      return allRequests.filter((r) => r.status === "APPROVED" || r.status === "REJECTED")
    }
    return allRequests
  }, [allRequests, activeTab])

  const totalPages = Math.ceil(filteredList.length / itemsPerPage) || 1
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredList.slice(start, start + itemsPerPage)
  }, [filteredList, currentPage, itemsPerPage])

  const handleRefresh = () => {
    refetch()
  }

  const handleApprove = (id) => {
    mutate({
      id,
      payload: {
        status: "APPROVED",
      },
    })
  }

  const handleOpenReject = (app) => {
    setRejectModalApp(app)
    setRejectReason("")
  }

  const handleConfirmReject = () => {
    if (!rejectModalApp) return

    mutate({
      id: rejectModalApp.id,
      payload: {
        status: "REJECTED",
        rejectReason: rejectReason.trim() || "Talablarga javob bermaydi",
      },
    })
    setRejectModalApp(null)
    setRejectReason("")
  }

  return (
    <section className="space-y-6 w-full pb-10">
      {/* 1. Sarlavha */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 capitalize">
            Tasdiqlash so'rovlari
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Yangi ferma rahbarlarining tizimga kirish va faollashtirish arizalarini ko'rib chiqish.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isFetching}
            className="gap-2 text-xs font-medium border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs cursor-pointer"
          >
            <RefreshCw
              className={`size-3.5 text-slate-500 transition-transform ${
                isFetching ? "animate-spin" : ""
              }`}
            />
            <span>Yangilash</span>
          </Button>
        </div>
      </div>

      {/* 2. Metrika Kartochkalari */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
        <StatCard
          title="Navbatda kutilayotgan"
          value={`${pendingCount} ta`}
          subText="Ko'rib chiqilishi kerak bo'lgan yangi arizalar"
          badge="Kutilmoqda"
          icon={ClipboardClock}
          percentage={allRequests.length > 0 ? Math.round((pendingCount / allRequests.length) * 100) : 0}
        />
        <StatCard
          title="Tasdiqlangan"
          value={`${approvedCount} ta`}
          subText="Muvaffaqiyatli faollashtirilgan hisoblar"
          badge="Faol"
          icon={ShieldCheck}
          percentage={allRequests.length > 0 ? Math.round((approvedCount / allRequests.length) * 100) : 0}
        />
        <StatCard
          title="Rad etilgan"
          value={`${rejectedCount} ta`}
          subText="Kamchiliklar sababli rad etilgan"
          badge="Rad etildi"
          icon={SquareExclamationPointIcon}
          percentage={allRequests.length > 0 ? Math.round((rejectedCount / allRequests.length) * 100) : 0}
        />
      </div>

      {/* 3. Tabs */}
      <div className="flex items-center gap-2.5 pt-2">
        <button
          type="button"
          onClick={() => {
            setActiveTab("barcha")
            setCurrentPage(1)
          }}
          className={`h-10 px-4 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
            activeTab === "barcha"
              ? "bg-[#2563EB] text-white shadow-blue-500/20"
              : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80"
          }`}
        >
          <FolderArchive className="size-4" />
          <span>Barcha arizalar</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === "barcha"
                ? "bg-white/20 text-white"
                : "bg-blue-50 text-blue-600"
            }`}
          >
            {allRequests.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("arxiv")
            setCurrentPage(1)
          }}
          className={`h-10 px-4 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
            activeTab === "arxiv"
              ? "bg-[#2563EB] text-white shadow-blue-500/20"
              : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80"
          }`}
        >
          <Archive className="size-4" />
          <span>Arxivlanganlar (Tasdiqlangan/Rad etilgan)</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === "arxiv"
                ? "bg-white/20 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {approvedCount + rejectedCount}
          </span>
        </button>
      </div>

      {/* 4. Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden w-full">
        <Table className="w-full table-fixed" containerClassName="overflow-hidden">
          <TableHeader>
            <TableRow className="border-b border-slate-200/80 bg-slate-50/80 hover:bg-slate-50/80">
              <TableHead className="w-[28%] pl-6 pr-2 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                FERMA NOMI & ID
              </TableHead>
              <TableHead className="w-[24%] px-2 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                ARIZA TOPSHIRGAN BOSS
              </TableHead>
              <TableHead className="w-[18%] px-2 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                SANA
              </TableHead>
              <TableHead className="w-[12%] px-2 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 text-center">
                HOLATI
              </TableHead>
              <TableHead className="w-[18%] pl-2 pr-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 text-center">
                AMALLAR
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoadingRequests ? (
              <TableRow>
                <TableCell colSpan={5} className="px-4 py-14 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Spinner size="md" />
                    <p className="text-xs font-medium text-slate-500">Arizalar yuklanmoqda...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedList.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="px-4 py-12 text-center text-slate-400 text-sm"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Building2 className="size-8 text-slate-300" />
                    <span>Hozircha arizalar mavjud emas.</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedList.map((app) => (
                <TableRow
                  key={app.id}
                  className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors"
                >
                  {/* 1. FERMA NOMI & ID */}
                  <TableCell className="pl-6 pr-2 py-3.5 align-middle whitespace-normal">
                    <div className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                      {app.farmName || "Noma'lum ferma"}
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50/70 border border-blue-100/60 text-[11px] font-medium text-slate-700 mt-1">
                      <span className="text-slate-500">Ariza ID:</span>
                      <span className="font-semibold text-slate-900">#{app.id}</span>
                    </div>
                  </TableCell>

                  {/* 2. ARIZA TOPSHIRGAN BOSS */}
                  <TableCell className="px-2 py-3.5 align-middle whitespace-normal">
                    <div className="font-semibold text-xs text-slate-900 leading-tight">
                      {app.bossFullName || "-"}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium mt-1">
                      {app.bossPhone || "-"}
                    </div>
                  </TableCell>

                  {/* 3. SANA */}
                  <TableCell className="px-2 py-3.5 align-middle whitespace-normal">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Calendar className="size-3.5 text-slate-400 shrink-0" />
                      <span>
                        {app.requestedAt
                          ? new Date(app.requestedAt).toLocaleDateString("uz-UZ", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "-"}
                      </span>
                    </div>
                  </TableCell>

                  {/* 4. HOLATI */}
                  <TableCell className="px-2 py-3.5 align-middle text-center whitespace-normal">
                    <span
                      className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-center leading-tight whitespace-nowrap ${
                        app.status === "APPROVED"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : app.status === "REJECTED"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {app.status === "APPROVED"
                        ? "Tasdiqlangan"
                        : app.status === "REJECTED"
                        ? "Rad etilgan"
                        : "Kutilmoqda"}
                    </span>
                  </TableCell>

                  {/* 5. AMALLAR */}
                  <TableCell className="pl-2 pr-6 py-3.5 align-middle text-center whitespace-normal">
                    {app.status === "PENDING" || !app.status ? (
                      <div className="flex items-center justify-center gap-1.5">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(app.id)}
                          disabled={isDeciding}
                          className="h-8 px-2.5 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white text-[11px] font-semibold gap-1 shadow-xs cursor-pointer whitespace-nowrap shrink-0"
                        >
                          <CheckCheck className="size-3.5" />
                          <span>Tasdiqlash</span>
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenReject(app)}
                          disabled={isDeciding}
                          className="h-8 px-2.5 rounded-lg border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 text-[11px] font-semibold gap-1 shadow-xs cursor-pointer whitespace-nowrap shrink-0"
                        >
                          <X className="size-3.5" />
                          <span>Rad etish</span>
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium italic">
                        {app.status === "APPROVED" ? "Ko'rib chiqilgan" : app.rejectReason || "Rad etilgan"}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 5. Pagination */}
      {totalPages > 1 && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* 6. Rad etish dialogi */}
      <MantineModal
        opened={Boolean(rejectModalApp)}
        onClose={() => setRejectModalApp(null)}
        title={
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
              <X className="size-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Arizani rad etish</h3>
              <p className="text-xs text-slate-500">#{rejectModalApp?.id} - {rejectModalApp?.farmName}</p>
            </div>
          </div>
        }
        centered
        radius="xl"
      >
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              Rad etish sababi (ixtiyoriy)
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Masalan: Litsenziya ma'lumotlari mos kelmadi yoki hujjatlar to'liq emas..."
              rows={3}
              className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setRejectModalApp(null)}
              className="h-9 px-3.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
            >
              Bekor qilish
            </Button>
            <Button
              type="button"
              onClick={handleConfirmReject}
              disabled={isDeciding}
              className="h-9 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
            >
              Rad etishni tasdiqlash
            </Button>
          </div>
        </div>
      </MantineModal>
    </section>
  )
}

export default TasdiqlashPage