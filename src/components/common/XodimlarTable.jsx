import { Link } from "react-router-dom"
import {
  Search,
  AlertCircle,
  RotateCw,
  Trash2,
  ShieldCheck,
  Truck,
} from "lucide-react"
import { Card, TablePagination, Button } from "@/shared/ui"
import { formatDisplayPhone } from "@/shared/lib"

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
  onToggleBlock,
  isUpdatingStatus,
  onDeleteEmployee,
  isDeleting,
}) {
  return (
    <>
      <Card className="border border-slate-200/90 bg-white shadow-xs rounded-2xl overflow-hidden">
        {/* Filtrlash, Qidiruv va Tablar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          {/* Qidiruv inputi */}
          <div className="relative flex-1 max-w-md w-full">
            <Search className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Ism yoki telefon bo'yicha qidiruv..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full h-10 sm:h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Filtrlash tugmalari (Tabs) */}
          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-xl w-full sm:w-auto overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => onTabChange("all")}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold cursor-pointer transition-all whitespace-nowrap shrink-0 ${
                activeTab === "all"
                  ? "bg-white text-blue-600 shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Barchasi ({counts.total})
            </button>
            <button
              type="button"
              onClick={() => onTabChange("couriers")}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold cursor-pointer transition-all whitespace-nowrap shrink-0 ${
                activeTab === "couriers"
                  ? "bg-white text-blue-600 shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Dastavkachilar ({counts.couriersCount})
            </button>
            <button
              type="button"
              onClick={() => onTabChange("managers")}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold cursor-pointer transition-all whitespace-nowrap shrink-0 ${
                activeTab === "managers"
                  ? "bg-white text-blue-600 shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Menejerlar ({counts.managersCount})
            </button>
          </div>
        </div>

        {/* Asosiy Xodimlar Jadvali */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[780px] lg:min-w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                <th className="py-4 pl-6 pr-1 w-14 text-center">Rasm</th>
                <th className="py-4 pl-2 pr-4 font-bold">Xodim</th>
                <th className="py-4 px-4 font-bold">Telefon Raqami</th>
                <th className="py-4 px-4 font-bold">Roli</th>
                <th className="py-4 px-4 font-bold">Qo'shilgan Sana</th>
                <th className="py-4 px-4 font-bold text-center">Holati</th>
                <th className="py-4 pr-6 pl-4 font-bold text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {/* 1. Yuklanish holati */}
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={`skeleton-${idx}`} className="animate-pulse">
                    <td className="py-4 pl-6 pr-1 text-center">
                      <div className="size-9 rounded-xl bg-slate-200 mx-auto" />
                    </td>
                    <td className="py-4 pl-2 pr-4">
                      <div className="h-4 bg-slate-200 rounded w-32" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 bg-slate-200 rounded w-28" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-7 bg-slate-200 rounded-xl w-24" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 bg-slate-200 rounded w-24" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="h-7 bg-slate-200 rounded-full w-20 mx-auto" />
                    </td>
                    <td className="py-4 pr-6 pl-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <div className="h-6 w-11 bg-slate-200 rounded-full" />
                        <div className="size-8 bg-slate-200 rounded-xl" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : isError ? (
                /* 2. Xatolik holati */
                <tr>
                  <td colSpan={7} className="p-0 py-14 text-center">
                    <div className="sticky left-0 sm:static w-[calc(100vw-2rem)] sm:w-full flex flex-col items-center justify-center gap-3 max-w-sm mx-auto px-4 whitespace-normal">
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
                          className="h-9 rounded-xl border-slate-200 text-xs font-semibold gap-1.5 px-3.5 mt-1 cursor-pointer hover:bg-slate-50"
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
                  <td colSpan={7} className="p-0 py-14 text-center text-slate-400 text-xs">
                    <div className="sticky left-0 sm:static w-[calc(100vw-2rem)] sm:w-full flex flex-col items-center justify-center gap-2 px-4 whitespace-normal">
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
                      className="hover:bg-blue-50/30 transition-colors group h-16 whitespace-nowrap"
                    >
                      {/* Rasm (Avatar) */}
                      <td className="py-3.5 pl-6 pr-1 text-center whitespace-nowrap w-14">
                        <div className="size-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-xs text-blue-700 mx-auto shadow-2xs">
                          {emp.initials}
                        </div>
                      </td>

                      {/* Xodim nomi */}
                      <td className="py-3.5 pl-2 pr-4 whitespace-nowrap">
                        <Link
                          to={`/boss/xodimlar/${emp.id}`}
                          className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors"
                        >
                          {emp.name}
                        </Link>
                      </td>

                      {/* Telefon Raqami */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-slate-800 font-mono tracking-tight block">
                          {formatDisplayPhone(emp.phone)}
                        </span>
                      </td>

                      {/* Roli */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {emp.roleType === "manager" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/70">
                            <ShieldCheck className="size-4 text-blue-600 shrink-0" />
                            <span>Menejer</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                            <Truck className="size-4 text-emerald-600 shrink-0" />
                            <span>Dastavkachi</span>
                          </span>
                        )}
                      </td>

                      {/* Sana */}
                      <td className="py-3.5 px-4 text-slate-600 font-medium font-mono text-sm whitespace-nowrap">
                        {emp.createdAtText}
                      </td>

                      {/* Holati */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap ${
                            isBlocked
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}
                        >
                          <span
                            className={`size-2 rounded-full shrink-0 ${
                              isBlocked ? "bg-rose-500" : "bg-blue-600"
                            }`}
                          />
                          <span>{isBlocked ? "Bloklangan" : "Faol"}</span>
                        </span>
                      </td>

                      {/* Amallar */}
                      <td className="py-3.5 pr-6 pl-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-3">
                          {/* Switch toggle */}
                          <button
                            type="button"
                            role="switch"
                            disabled={isUpdatingStatus}
                            aria-checked={!isBlocked}
                            onClick={() => onToggleBlock(emp)}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
                              !isBlocked ? "bg-blue-600" : "bg-slate-300"
                            }`}
                            aria-label={
                              !isBlocked
                                ? "Faol (Bloklash uchun bosing)"
                                : "Bloklangan (Faollashtirish uchun bosing)"
                            }
                          >
                            <span
                              aria-hidden="true"
                              className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                !isBlocked ? "translate-x-5" : "translate-x-0"
                              }`}
                            />
                          </button>

                          {/* Delete button (DELETE /api/boss/staff/{id}) */}
                          <button
                            type="button"
                            disabled={isDeleting}
                            onClick={() => onDeleteEmployee && onDeleteEmployee(emp)}
                            className="size-8.5 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all cursor-pointer disabled:opacity-50"
                            title="Xodimni o'chirish"
                          >
                            <Trash2 className="size-4" />
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
      {!isLoading && !isError && totalPages > 1 && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          className="pt-4 pb-1"
        />
      )}
    </>
  )
}
