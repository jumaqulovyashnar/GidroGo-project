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
 * Pure calculation logic for pagination range with truncation.
 */
export const calculatePaginationRange = ({
  totalPages = 1,
  currentPage = 1,
  siblingCount = 1,
}) => {
  const totalPageNumbers = siblingCount * 2 + 5

  // Case 1: Total pages less than the numbers we want to show
  if (totalPages <= totalPageNumbers) {
    return range(1, Math.max(1, totalPages))
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

  const shouldShowLeftDots = leftSiblingIndex > 2
  const shouldShowRightDots = rightSiblingIndex < totalPages - 2

  const firstPageIndex = 1
  const lastPageIndex = totalPages

  // Case 2: No left dots, but right dots needed -> [1, 2, 3, 4, 5, '...', totalPages]
  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + 2 * siblingCount
    const leftRange = range(1, leftItemCount)
    return [...leftRange, ELLIPSIS, totalPages]
  }

  // Case 3: No right dots, but left dots needed -> [1, '...', 7, 8, 9, 10]
  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2 * siblingCount
    const rightRange = range(totalPages - rightItemCount + 1, totalPages)
    return [firstPageIndex, ELLIPSIS, ...rightRange]
  }

  // Case 4: Both left and right dots needed -> [1, '...', 4, 5, 6, '...', 10]
  if (shouldShowLeftDots && shouldShowRightDots) {
    const middleRange = range(leftSiblingIndex, rightSiblingIndex)
    return [firstPageIndex, ELLIPSIS, ...middleRange, ELLIPSIS, lastPageIndex]
  }

  return range(1, Math.max(1, totalPages))
}

/**
 * Calculates page numbers and ellipsis delimiters for pagination UI.
 */
export const usePagination = ({
  totalPages = 1,
  currentPage = 1,
  totalItems = 0,
  pageSize = 10,
  siblingCount = 1,
}) => {
  const paginationRange = useMemo(
    () => calculatePaginationRange({ totalPages, currentPage, siblingCount }),
    [totalPages, currentPage, siblingCount]
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
