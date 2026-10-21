import { useMemo } from "react"
import { useSearchParams } from "react-router-dom"

export const ELLIPSIS = "..."

/**
 * Helper to generate an integer range [start, end]
 */
export const range = (start, end) => {
  const length = end - start + 1
  return Array.from({ length }, (_, idx) => idx + start)
}

/**
 * Pure calculation logic for pagination range:
 * Compact sliding window showing at most maxVisible (default 3) numbers.
 * Example with maxVisible=3:
 * - page 1: [1, 2, 3]
 * - page 2: [1, 2, 3]
 * - page 3: [2, 3, 4] -> shifts so next number is always accessible
 * - page 4: [3, 4, 5]
 * - page 8 (end): [6, 7, 8]
 */
export const calculatePaginationRange = ({
  totalPages = 1,
  currentPage = 1,
  maxVisible = 3,
}) => {
  if (totalPages <= 0) return []
  if (totalPages <= maxVisible) {
    return range(1, totalPages)
  }

  const half = Math.floor(maxVisible / 2)
  let start = currentPage - half

  if (start < 1) {
    start = 1
  } else if (start + maxVisible - 1 > totalPages) {
    start = totalPages - maxVisible + 1
  }

  return range(start, start + maxVisible - 1)
}

/**
 * Calculates page numbers for compact pagination UI.
 */
export const usePagination = ({
  totalPages = 1,
  currentPage = 1,
  totalItems = 0,
  pageSize = 10,
  maxVisible = 3,
}) => {
  const paginationRange = useMemo(
    () => calculatePaginationRange({ totalPages, currentPage, maxVisible }),
    [totalPages, currentPage, maxVisible]
  )

  const isFirstPage = currentPage <= 1
  const isLastPage = currentPage >= totalPages

  const startItemIndex = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endItemIndex = Math.min(currentPage * pageSize, totalItems)

  return {
    paginationRange,
    isFirstPage,
    isLastPage,
    startItemIndex,
    endItemIndex,
  }
}

/**
 * Synchronizes page & pageSize with React Router URL Search Params
 */
export const useUrlPagination = (defaultPage = 1, defaultPageSize = 10) => {
  const [searchParams, setSearchParams] = useSearchParams()

  const currentPage = Math.max(1, Number(searchParams.get("page")) || defaultPage)
  const pageSize = Math.max(1, Number(searchParams.get("pageSize")) || defaultPageSize)

  const setPage = (page) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev)
      if (page <= 1) {
        params.delete("page")
      } else {
        params.set("page", String(page))
      }
      return params
    })
  }

  const setPageSize = (newPageSize) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev)
      params.set("pageSize", String(newPageSize))
      params.delete("page") // Reset to page 1 on pageSize change
      return params
    })
  }

  return { currentPage, pageSize, setPage, setPageSize }
}

export default usePagination
