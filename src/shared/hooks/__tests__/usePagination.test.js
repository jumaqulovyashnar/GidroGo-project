import { describe, it, expect } from "vitest"
import { calculatePaginationRange, range, ELLIPSIS } from "../usePagination"

describe("calculatePaginationRange", () => {
  it("generates correct numeric range", () => {
    expect(range(1, 5)).toEqual([1, 2, 3, 4, 5])
    expect(range(3, 3)).toEqual([3])
  })

  it("returns full range when totalPages is small (<= 7)", () => {
    const res = calculatePaginationRange({
      totalPages: 5,
      currentPage: 1,
      siblingCount: 1,
    })
    expect(res).toEqual([1, 2, 3, 4, 5])
  })

  it("handles right ellipsis when near start of large page count", () => {
    const res = calculatePaginationRange({
      totalPages: 10,
      currentPage: 2,
      siblingCount: 1,
    })
    expect(res).toEqual([1, 2, 3, 4, 5, ELLIPSIS, 10])
  })

  it("handles left ellipsis when near end of large page count", () => {
    const res = calculatePaginationRange({
      totalPages: 10,
      currentPage: 9,
      siblingCount: 1,
    })
    expect(res).toEqual([1, ELLIPSIS, 6, 7, 8, 9, 10])
  })

  it("handles both left and right ellipses when in middle of large page count", () => {
    const res = calculatePaginationRange({
      totalPages: 15,
      currentPage: 8,
      siblingCount: 1,
    })
    expect(res).toEqual([1, ELLIPSIS, 7, 8, 9, ELLIPSIS, 15])
  })

  it("handles edge case when totalPages is 1", () => {
    const res = calculatePaginationRange({
      totalPages: 1,
      currentPage: 1,
      siblingCount: 1,
    })
    expect(res).toEqual([1])
  })
})
