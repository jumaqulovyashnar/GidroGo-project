import { describe, it, expect } from "vitest"
import { calculatePaginationRange, range } from "../usePagination"

describe("calculatePaginationRange", () => {
  it("generates correct numeric range", () => {
    expect(range(1, 3)).toEqual([1, 2, 3])
    expect(range(3, 3)).toEqual([3])
  })

  it("returns [1, 2, 3] on first page for totalPages > 3", () => {
    const res = calculatePaginationRange({
      totalPages: 8,
      currentPage: 1,
      maxVisible: 3,
    })
    expect(res).toEqual([1, 2, 3])
  })

  it("returns [1, 2, 3] on second page for totalPages > 3", () => {
    const res = calculatePaginationRange({
      totalPages: 8,
      currentPage: 2,
      maxVisible: 3,
    })
    expect(res).toEqual([1, 2, 3])
  })

  it("shifts window to [2, 3, 4] when page 3 is selected", () => {
    const res = calculatePaginationRange({
      totalPages: 8,
      currentPage: 3,
      maxVisible: 3,
    })
    expect(res).toEqual([2, 3, 4])
  })

  it("shifts window to [3, 4, 5] when page 4 is selected", () => {
    const res = calculatePaginationRange({
      totalPages: 8,
      currentPage: 4,
      maxVisible: 3,
    })
    expect(res).toEqual([3, 4, 5])
  })

  it("clamps to [6, 7, 8] at the last page", () => {
    const res = calculatePaginationRange({
      totalPages: 8,
      currentPage: 8,
      maxVisible: 3,
    })
    expect(res).toEqual([6, 7, 8])
  })

  it("handles totalPages <= maxVisible", () => {
    expect(
      calculatePaginationRange({ totalPages: 2, currentPage: 1, maxVisible: 3 })
    ).toEqual([1, 2])
    expect(
      calculatePaginationRange({ totalPages: 1, currentPage: 1, maxVisible: 3 })
    ).toEqual([1])
    expect(
      calculatePaginationRange({ totalPages: 0, currentPage: 1, maxVisible: 3 })
    ).toEqual([])
  })
})
