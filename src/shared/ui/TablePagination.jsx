import React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { usePagination, ELLIPSIS } from "@/shared/hooks/usePagination"
import { cn } from "@/shared/lib"

const alignStyles = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
  between: "justify-between",
}

export const TablePagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  pageSizeOptions = [10, 20, 50],
  siblingCount = 1,
  align = "right",
  showTotalCount = false,
  showPageSizeSelector = false,
  previousLabel = "Oldingi",
  nextLabel = "Keyingi",
  className = "",
  onPageChange,
  onPageSizeChange,
}) => {
  const {
    paginationRange,
    isFirstPage,
    isLastPage,
    startItemIndex,
    endItemIndex,
  } = usePagination({
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    siblingCount,
  })

  if (totalPages <= 0) return null

  const handlePrev = (e) => {
    e.preventDefault()
    if (!isFirstPage && onPageChange) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = (e) => {
    e.preventDefault()
    if (!isLastPage && onPageChange) {
      onPageChange(currentPage + 1)
    }
  }

  const effectiveAlign = showTotalCount || showPageSizeSelector ? "between" : align

  return (
    <div
      aria-label="Pagination Navigation"
      className={cn(
        "pt-4 pb-2 w-full flex flex-col sm:flex-row items-center gap-3.5 select-none",
        alignStyles[effectiveAlign] || "justify-end",
        className
      )}
    >
      {/* Chap tomon: Jami ma'lumotlar hisobi va sahifa hajmi selektori */}
      {(showTotalCount || showPageSizeSelector) && (
        <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-500">
          {showTotalCount && (
            <span>
              Jami <strong className="font-semibold text-slate-800">{totalItems}</strong> ta yozuvdan{" "}
              <strong className="font-semibold text-slate-800">
                {startItemIndex} - {endItemIndex}
              </strong>{" "}
              ko'rsatilmoqda
            </span>
          )}

          {showPageSizeSelector && onPageSizeChange && (
            <div className="flex items-center gap-1.5 ml-2 border-l border-slate-200 pl-3">
              <span className="text-slate-400">Har sahifada:</span>
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-slate-700 outline-none focus:border-blue-500 cursor-pointer"
              >
                {pageSizeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* O'ng tomon: Pagination tugmalari konteyneri */}
      {totalPages > 1 && (
        <nav
          role="navigation"
          aria-label="Sahifalar navigatsiyasi"
          className="bg-white p-1 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-0.5"
        >
          {/* Oldingi tugmasi */}
          <button
            type="button"
            disabled={isFirstPage}
            onClick={handlePrev}
            aria-disabled={isFirstPage}
            className={cn(
              "flex items-center gap-1 h-9 px-3 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer",
              isFirstPage
                ? "text-slate-400 cursor-not-allowed opacity-40 pointer-events-none"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">{previousLabel}</span>
          </button>

          {/* Sahifa raqamlari va Ellipsis */}
          {paginationRange.map((pageNumber, idx) => {
            if (pageNumber === ELLIPSIS) {
              return (
                <div
                  key={`ellipsis-${idx}`}
                  className="flex h-9 min-w-9 items-center justify-center text-slate-400"
                  aria-hidden="true"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </div>
              )
            }

            const isActive = pageNumber === currentPage

            return (
              <button
                key={`page-${pageNumber}`}
                type="button"
                onClick={() => onPageChange && onPageChange(pageNumber)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex h-9 min-w-9 px-3 items-center justify-center rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer",
                  isActive
                    ? "bg-[#2563EB] text-white font-semibold hover:bg-blue-700 shadow-xs"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                {pageNumber}
              </button>
            )
          })}

          {/* Keyingi tugmasi */}
          <button
            type="button"
            disabled={isLastPage}
            onClick={handleNext}
            aria-disabled={isLastPage}
            className={cn(
              "flex items-center gap-1 h-9 px-3 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer",
              isLastPage
                ? "text-slate-400 cursor-not-allowed opacity-40 pointer-events-none"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            <span className="hidden sm:inline">{nextLabel}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </nav>
      )}
    </div>
  )
}

export default TablePagination
