import React from "react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "./pagination"
import { cn } from "@/shared/lib"

export const TablePagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className,
}) => {
  if (totalPages <= 1) return null

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
      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent className="bg-white p-1 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-0.5">
          <PaginationItem>
            <PaginationPrevious
              text="Oldingi"
              onClick={(e) => {
                e.preventDefault()
                if (currentPage > 1) {
                  onPageChange?.(currentPage - 1)
                }
              }}
              className={cn(
                "cursor-pointer rounded-xl font-medium text-xs sm:text-sm h-9 px-3 text-slate-700 transition-colors",
                currentPage <= 1
                  ? "pointer-events-none opacity-40 select-none"
                  : "hover:bg-slate-100 hover:text-slate-900"
              )}
            />
          </PaginationItem>

          {pages.map((pageItem, index) => {
            if (pageItem === "ellipsis-start" || pageItem === "ellipsis-end") {
              return (
                <PaginationItem key={`${pageItem}-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              )
            }

            const isActive = currentPage === pageItem

            return (
              <PaginationItem key={pageItem}>
                <PaginationLink
                  isActive={isActive}
                  onClick={(e) => {
                    e.preventDefault()
                    onPageChange?.(pageItem)
                  }}
                  className={cn(
                    "cursor-pointer rounded-xl font-medium min-w-9 h-9 px-3 flex items-center justify-center text-xs sm:text-sm transition-all",
                    isActive
                      ? "bg-[#2563EB] text-white hover:bg-blue-700 hover:text-white shadow-xs font-semibold"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  {pageItem}
                </PaginationLink>
              </PaginationItem>
            )
          })}

          <PaginationItem>
            <PaginationNext
              text="Keyingi"
              onClick={(e) => {
                e.preventDefault()
                if (currentPage < totalPages) {
                  onPageChange?.(currentPage + 1)
                }
              }}
              className={cn(
                "cursor-pointer rounded-xl font-medium text-xs sm:text-sm h-9 px-3 text-slate-700 transition-colors",
                currentPage >= totalPages
                  ? "pointer-events-none opacity-40 select-none"
                  : "hover:bg-slate-100 hover:text-slate-900"
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

export default TablePagination
