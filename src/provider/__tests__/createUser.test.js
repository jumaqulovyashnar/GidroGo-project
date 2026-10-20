import { describe, it, expect } from "vitest"
import { createUser, getHomePath, ROLES } from "../../entities/user/model/userUtils"

describe("createUser", () => {
  it("returns null if userId is missing (no fake fallback to usr-1)", () => {
    const user = createUser({ name: "Test User" }, null)
    expect(user).toBeNull()
  })

  it("normalizes ROLE_BOSS to BOSS", () => {
    const user = createUser({ id: 10, role: "ROLE_BOSS", name: "Boss User" })
    expect(user).not.toBeNull()
    expect(user.id).toBe("10")
    expect(user.role).toBe(ROLES.BOSS)
    expect(user.roleLabel).toBe("Ferma rahbari")
  })

  it("normalizes ROLE_FERMA_RAHBARI to BOSS", () => {
    const user = createUser({ userId: "boss-123", role: "ROLE_FERMA_RAHBARI" })
    expect(user).not.toBeNull()
    expect(user.id).toBe("boss-123")
    expect(user.role).toBe(ROLES.BOSS)
  })

  it("normalizes ROLE_MANAGER to MANAGER", () => {
    const user = createUser({ id: "mgr-1", role: "ROLE_MANAGER" })
    expect(user).not.toBeNull()
    expect(user.role).toBe(ROLES.MANAGER)
    expect(user.roleLabel).toBe("Menejer")
  })

  it("normalizes ROLE_COURIER to COURIER", () => {
    const user = createUser({ id: "cur-1", role: "ROLE_COURIER" })
    expect(user).not.toBeNull()
    expect(user.role).toBe(ROLES.COURIER)
    expect(user.roleLabel).toBe("Kuryer")
  })

  it("normalizes ROLE_SUPER_ADMIN to SUPER_ADMIN", () => {
    const user = createUser({ id: "sa-1", role: "ROLE_SUPER_ADMIN" })
    expect(user).not.toBeNull()
    expect(user.role).toBe(ROLES.SUPER_ADMIN)
    expect(user.roleLabel).toBe("Super Admin")
  })
})

describe("getHomePath", () => {
  it("returns correct route for each role", () => {
    expect(getHomePath(ROLES.SUPER_ADMIN)).toBe("/super-admin")
    expect(getHomePath("ROLE_SUPER_ADMIN")).toBe("/super-admin")
    expect(getHomePath(ROLES.BOSS)).toBe("/boss")
    expect(getHomePath("ROLE_FERMA_RAHBARI")).toBe("/boss")
    expect(getHomePath(ROLES.MANAGER)).toBe("/manager")
    expect(getHomePath("ROLE_MANAGER")).toBe("/manager")
    expect(getHomePath(null)).toBe("/login")
    expect(getHomePath("UNKNOWN")).toBe("/login")
  })
})
