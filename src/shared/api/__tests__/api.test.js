import { describe, it, expect } from "vitest"
import { isAuthUrl } from "../api"

describe("api helpers", () => {
  describe("isAuthUrl", () => {
    it("returns true for auth URLs", () => {
      expect(isAuthUrl("/auth/login")).toBe(true)
      expect(isAuthUrl("auth/login")).toBe(true)
      expect(isAuthUrl("/auth/register")).toBe(true)
      expect(isAuthUrl("/auth/refresh")).toBe(true)
      expect(isAuthUrl("/auth/logout")).toBe(true)
      expect(isAuthUrl("https://api.example.com/api/auth/login")).toBe(true)
    })

    it("returns false for non-auth URLs", () => {
      expect(isAuthUrl("/api/boss/staff")).toBe(false)
      expect(isAuthUrl("/api/farms")).toBe(false)
      expect(isAuthUrl("/api/manager/orders")).toBe(false)
      expect(isAuthUrl("")).toBe(false)
      expect(isAuthUrl(null)).toBe(false)
      expect(isAuthUrl(undefined)).toBe(false)
    })
  })
})
