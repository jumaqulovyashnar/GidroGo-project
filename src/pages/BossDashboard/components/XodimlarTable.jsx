import { Search, MapPin, Pencil, AlertCircle, RotateCw } from "lucide-react"
import { Card, TablePagination, Button } from "@/shared/ui"

export function XodimlarTable({
  employees,
  paginatedEmployees,
  totalFilteredCount,
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  counts,
  isLoading,
  isError,
  onRetry,
  currentPage,
  totalPages,
  onPageChange,
  onEditEmployee,
  onToggleBlock,
}) {
  return (
    <>
      <Card className="border border-slate-200/90 bg-white shadow-xs rounded-2xl overflow-hidden">
        {/* Filtrlash, Qidiruv va Tablar */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Qidiruv inputi */}
          <div className="relative flex-1 max-w-md">
            <Search className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Ism, telefon yoki hudud bo'yicha qidiruv..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full h-9.5 pl-9.5 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Filtrlash tugmalari (Tabs) */}
          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl self-start md:self-auto">
            <button
              type="button"
              onClick={() => onTabChange("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${activeTab === "all"
                ? "bg-white text-blue-600 shadow-2xs font-bold"
                : "text-slate-600 hover:text-slate-900"
                }`}
            >
              Barchasi ({counts.total})
            </button>
            <button
              type="button"
              onClick={() => onTabChange("couriers")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${activeTab === "couriers"
                ? "bg-white text-blue-600 shadow-2xs font-bold"
                : "text-slate-600 hover:text-slate-900"
                }`}
            >
              Dastavkachilar ({counts.couriersCount})
            </button>
            <button
              type="button"
              onClick={() => onTabChange("managers")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${activeTab === "managers"
                ? "bg-white text-blue-600 shadow-2xs font-bold"
                : "text-slate-600 hover:text-slate-900"
                }`}
            >
              Managerlar ({counts.managersCount})
            </button>
          </div>
        </div>

        {/* Asosiy Xodimlar Jadvali */}
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
              {/* 1. Yuklanish holati (Senior Skeleton Rows) */}
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={`skeleton-${idx}`} className="animate-pulse">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full bg-slate-200 shrink-0" />
                        <div className="h-4 bg-slate-200 rounded w-28" />
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-3.5 bg-slate-200 rounded w-24" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-3.5 bg-slate-200 rounded w-20 mb-1" />
                      <div className="h-2.5 bg-slate-100 rounded w-14" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-3.5 bg-slate-200 rounded w-24" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-3.5 bg-slate-200 rounded w-16 mb-1" />
                      <div className="h-2.5 bg-slate-100 rounded w-20" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-5 bg-slate-200 rounded-full w-20" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="size-7 bg-slate-200 rounded-lg" />
                        <div className="h-5 w-8 bg-slate-200 rounded-full" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : isError ? (
                /* 2. Xatolik holati (Retry tugmasi bilan) */
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 max-w-sm mx-auto">
                      <div className="size-10 rounded-full bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center">
                        <AlertCircle className="size-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          Ma'lumotlarni yuklab bo'lmadi
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Server bilan ulanishda xatolik yuz berdi.
                        </p>
                      </div>
                      {onRetry && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={onRetry}
                          className="h-8.5 rounded-xl border-slate-200 text-xs font-semibold gap-1.5 px-3.5 mt-1 cursor-pointer hover:bg-slate-50"
                        >
                          <RotateCw className="size-3.5 text-slate-600" />
                          <span>Qayta urinish</span>
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : totalFilteredCount === 0 ? (
                /* 3. Bo'sh ro'yxat holati */
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="size-10 rounded-full bg-slate-50 text-slate-400 border border-slate-100 flex items-center justify-center">
                        <Search className="size-4" />
                      </div>
                      <span className="font-medium text-slate-600">
                        {employees.length === 0
                          ? "Hozircha xodimlar mavjud emas."
                          : "Qidiruv bo'yicha hech qanday xodim topilmadi."}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                /* 4. Ma'lumotlar ro'yxati */
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
                          <span className="font-medium text-slate-800 truncate">
                            {emp.sector}
                          </span>
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
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border whitespace-nowrap ${isBlocked
                            ? "bg-rose-50 text-rose-700 border-rose-100"
                            : "bg-blue-50 text-blue-700 border-blue-100"
                            }`}
                        >
                          <span
                            className={`size-1.5 rounded-full shrink-0 ${isBlocked ? "bg-rose-500" : "bg-blue-600"
                              }`}
                          />
                          <span>{isBlocked ? "Bloklangan" : emp.statusText}</span>
                        </span>
                      </td>

                      {/* Amallar */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          {/* Tahrirlash (Edit Icon) */}
                          <button
                            type="button"
                            onClick={() => onEditEmployee(emp)}
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
                            onClick={() => onToggleBlock(emp)}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${!isBlocked ? "bg-blue-600" : "bg-slate-300"
                              }`}
                            title={
                              !isBlocked
                                ? "Faol (Bloklash uchun bosing)"
                                : "Bloklangan (Faollashtirish uchun bosing)"
                            }
                          >
                            <span
                              aria-hidden="true"
                              className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${!isBlocked ? "translate-x-4" : "translate-x-0"
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

      {/* Jadval Pagination */}
      {!isLoading && !isError && totalFilteredCount > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 px-1 pt-1">
          <div>
            Jami {totalFilteredCount} xodimdan {paginatedEmployees.length} tasi ko'rsatilmoqda
          </div>
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            className="p-0"
          />
        </div>
      )}
    </>
  )
}
