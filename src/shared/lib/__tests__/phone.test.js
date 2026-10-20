import { describe, it, expect } from "vitest"
import { formatPhoneInput, cleanPhoneForBackend } from "../phoneUtils"

describe("phoneUtils", () => {
  describe("formatPhoneInput", () => {
    it("returns +998 for empty, null, or undefined values", () => {
      expect(formatPhoneInput("")).toBe("+998")
      expect(formatPhoneInput(null)).toBe("+998")
      expect(formatPhoneInput(undefined)).toBe("+998")
    })

    it("adds +998 prefix and removes spaces", () => {
      expect(formatPhoneInput("90 123 45 67")).toBe("+998901234567")
      expect(formatPhoneInput("+998 90 123 45 67")).toBe("+998901234567")
    })

    it("truncates at 13 characters (+998XXXXXXXXX)", () => {
      expect(formatPhoneInput("+998901234567999")).toBe("+998901234567")
    })
  })

  describe("cleanPhoneForBackend", () => {
    it("returns empty string for invalid or short phone numbers", () => {
      expect(cleanPhoneForBackend("")).toBe("")
      expect(cleanPhoneForBackend(null)).toBe("")
      expect(cleanPhoneForBackend("12345")).toBe("")
    })

    it("formats 9-digit local numbers with +998", () => {
      expect(cleanPhoneForBackend("901234567")).toBe("+998901234567")
      expect(cleanPhoneForBackend("90 123 45 67")).toBe("+998901234567")
    })

    it("formats 12-digit numbers starting with 998 with leading +", () => {
      expect(cleanPhoneForBackend("998901234567")).toBe("+998901234567")
      expect(cleanPhoneForBackend("+998901234567")).toBe("+998901234567")
    })
  })
})
