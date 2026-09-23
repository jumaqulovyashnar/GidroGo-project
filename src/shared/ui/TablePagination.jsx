import React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/shared/lib"

export const TablePagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className,
}) => {
  if (totalPages <= 0) return null

  const getPageNumbers = () => {
    const pages = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "ellipsis-end", totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "ellipsis-start", totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, "ellipsis-start", currentPage, "ellipsis-end", totalPages)
      }
    }
    return pages
  }

  const pages = getPageNumbers()

  return (
    <div className={cn("pt-4 pb-2 flex items-center justify-end", className)}>
      <nav
        aria-label="Pagination"
        className="bg-white px-3.5 py-1.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-2 sm:gap-3"
      >
        {/* Oldingi tugmasi */}
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => currentPage > 1 && onPageChange?.(currentPage - 1)}
          className={cn(
            "flex items-center gap-1 text-xs sm:text-sm transition-colors cursor-pointer select-none",
            currentPage <= 1
              ? "text-slate-400 cursor-not-allowed opacity-60"
              : "text-slate-600 hover:text-slate-900"
          )}
        >
          <ChevronLeft className="size-4 stroke-[1.75]" />
          <span>Oldingi</span>
        </button>

        {/* Sahifalar */}
        <div className="flex items-center gap-1">
          {pages.map((page, index) => {
            if (page === "ellipsis-start" || page === "ellipsis-end") {
              return (
                <span
                  key={`${page}-${index}`}
                  className="px-1 text-xs text-slate-400 select-none"
                >
                  ...
                </span>
              )
            }

            const isActive = page === currentPage

            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange?.(page)}
                className={cn(
                  "size-7 sm:size-7.5 rounded-full flex items-center justify-center text-xs transition-all cursor-pointer select-none",
                  isActive
                    ? "bg-[#2563EB] text-white font-semibold shadow-xs"
                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-100 font-medium"
                )}
              >
                {page}
              </button>
            )
          })}
        </div>

        {/* Keyingi tugmasi */}
        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => currentPage < totalPages && onPageChange?.(currentPage + 1)}
          className={cn(
            "flex items-center gap-1 text-xs sm:text-sm transition-colors cursor-pointer select-none",
            currentPage >= totalPages
              ? "text-slate-400 cursor-not-allowed opacity-60"
              : "text-slate-800 hover:text-slate-900 font-medium"
          )}
        >
          <span>Keyingi</span>
          <ChevronRight className="size-4 stroke-[1.75]" />
        </button>
      </nav>
    </div>
  )
}

export default TablePagination
