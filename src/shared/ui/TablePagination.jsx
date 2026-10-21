import React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
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
          className="bg-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-2xl border border-slate-200/80 shadow-xs inline-flex items-center gap-3 sm:gap-4"
        >
          {/* Oldingi tugmasi */}
          <button
            type="button"
            disabled={isFirstPage}
            onClick={handlePrev}
            aria-disabled={isFirstPage}
            className={cn(
              "inline-flex items-center gap-1.5 text-xs sm:text-sm font-normal transition-colors cursor-pointer select-none",
              isFirstPage
                ? "text-slate-300 cursor-not-allowed pointer-events-none"
                : "text-slate-700 hover:text-blue-600"
            )}
          >
            <ChevronLeft className="h-4 w-4 stroke-[1.75]" />
            <span>{previousLabel}</span>
          </button>

          {/* Sahifa raqamlari va Ellipsis */}
          {paginationRange.map((pageNumber, idx) => {
            if (pageNumber === ELLIPSIS) {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-8 h-8 flex items-center justify-center text-xs sm:text-sm text-slate-400 select-none"
                  aria-hidden="true"
                >
                  ...
                </span>
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
                  "w-8 h-8 rounded-full text-xs sm:text-sm font-normal flex items-center justify-center transition-all cursor-pointer select-none",
                  isActive
                    ? "bg-[#2563EB] text-white font-medium shadow-xs"
                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/70"
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
              "inline-flex items-center gap-1.5 text-xs sm:text-sm font-normal transition-colors cursor-pointer select-none",
              isLastPage
                ? "text-slate-300 cursor-not-allowed pointer-events-none"
                : "text-slate-700 hover:text-blue-600"
            )}
          >
            <span>{nextLabel}</span>
            <ChevronRight className="h-4 w-4 stroke-[1.75]" />
          </button>
        </nav>
      )}
    </div>
  )
}

export default TablePagination
