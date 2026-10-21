import { useState, useMemo, useCallback } from "react"
import { FilterBar } from "@/widgets"
import {
  Button,
  Spinner,
  EditBossModal,
  DeleteBossModal,
  TablePagination,
} from "@/shared/ui"
import { RefreshCw } from "lucide-react"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/shared/ui/table"
import {
  useBosses,
  useUpdateBossStatus,
  useUpdateBoss,
  useDeleteBoss,
} from "@/shared/hooks"
import { normalizeBoss, calculateBossStats } from "@/entities/boss"
import {
  useBossesTable,
  FermaEgalariStats,
  BossTableRow,
  BOSS_TABLE_COLUMNS,
  STATUS_OPTIONS,
} from "@/components"

const ITEMS_PER_PAGE = 8

export const FermaEgalariPage = () => {
  const [editingBoss, setEditingBoss] = useState(null)
  const [deletingBoss, setDeletingBoss] = useState(null)

  // API hooks
  const { data, isPending, isError, error, isFetching, refetch } = useBosses()
  const toggleStatusMutation = useUpdateBossStatus()
  const updateBossMutation = useUpdateBoss()
  const deleteBossMutation = useDeleteBoss()

  // 1. Data normalizatsiyasi
  const bosses = useMemo(() => {
    const list =
      data?.data?.bosses ||
      data?.data?.content ||
      (Array.isArray(data?.data) ? data?.data : [])
    if (!Array.isArray(list)) return []
    return list.map(normalizeBoss).filter(Boolean)
  }, [data])

  // 2. Statistika hisob-kitobi (Domain util)
  const stats = useMemo(() => calculateBossStats(bosses), [bosses])

  // 3. Filtrlash, qidiruv va sahifalash logikasi (Custom hook)
  const {
    filters,
    updateFilter,
    resetFilters,
    farmOptions,
    paginatedBosses,
    totalPages,
    currentPage,
    setCurrentPage,
    totalFilteredCount,
  } = useBossesTable(bosses, ITEMS_PER_PAGE)

  // 4. Mutations handlers
  const handleToggleStatus = useCallback(
    (id) => {
      toggleStatusMutation.mutate(id)
    },
    [toggleStatusMutation]
  )

  const handleSaveBoss = useCallback(
    ({ id, data: bossPayload }) => {
      updateBossMutation.mutate(
        { id, data: bossPayload },
        {
          onSuccess: () => setEditingBoss(null),
        }
      )
    },
    [updateBossMutation]
  )

  const handleConfirmDeleteBoss = useCallback(
    (boss) => {
      deleteBossMutation.mutate(boss.id, {
        onSuccess: () => setDeletingBoss(null),
      })
    },
    [deleteBossMutation]
  )

  return (
    <section className="space-y-6">
      {/* Sarlavha va Yangilash tugmasi */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Ferma egalari
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Fermalar egalari va asosiy rahbarlar monitoringi hamda hisob holati.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="h-9 px-3.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold gap-2 cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <RefreshCw
            className={`size-3.5 text-slate-500 transition-transform ${
              isFetching ? "animate-spin" : ""
            }`}
          />
          <span>Yangilash</span>
        </Button>
      </div>

      {/* KPI Kartochkalar */}
      <FermaEgalariStats stats={stats} isLoading={isPending} />

      {/* Filtrlash paneli */}
      <div className="pt-2">
        <FilterBar
          search={filters.search}
          setSearch={(val) => updateFilter("search", val)}
          status={filters.status}
          setStatus={(val) => updateFilter("status", val)}
          statusOptions={STATUS_OPTIONS}
          farm={filters.farm}
          setFarm={(val) => updateFilter("farm", val)}
          farmOptions={farmOptions}
          onReset={resetFilters}
          showStatus={true}
          showFarm={true}
          showReset={true}
          showSort={false}
          showFilterButton={false}
          placeholder="Rahbar yoki ferma qidirish..."
        />
      </div>

      {/* Jadval va Yuklanish holati */}
      {isPending ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl py-14 px-6 text-center flex flex-col items-center justify-center gap-3.5 shadow-xs">
          <Spinner size="md" />
          <p className="text-sm font-medium text-slate-500">
            Ferma egalari yuklanmoqda...
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <Table className="w-full min-w-[700px] lg:min-w-full">
            <TableHeader className="bg-slate-50/80">
              <TableRow className="border-b border-slate-200/80 hover:bg-transparent">
                {BOSS_TABLE_COLUMNS.map((col) => (
                  <TableHead
                    key={col.key}
                    className={`py-3.5 text-left font-semibold text-slate-700 text-xs uppercase tracking-wider ${
                      col.className || ""
                    }`}
                  >
                    {col.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {totalFilteredCount === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={BOSS_TABLE_COLUMNS.length}
                    className="text-center py-12 text-slate-500 text-sm"
                  >
                    {isError
                      ? `Xatolik yuz berdi: ${error?.message || "Yuklab bo'lmadi"}`
                      : "Ferma egalari topilmadi."}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedBosses.map((boss) => (
                  <BossTableRow
                    key={boss.id}
                    boss={boss}
                    isToggling={
                      toggleStatusMutation.isPending &&
                      toggleStatusMutation.variables === boss.id
                    }
                    onToggleStatus={handleToggleStatus}
                    onEdit={setEditingBoss}
                    onDelete={setDeletingBoss}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Sahifalash (Pagination) */}
      {!isPending && !isError && totalPages > 1 && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Tahrirlash va O'chirish modallari */}
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

export default FermaEgalariPage;
