export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  BOSS: "BOSS",
  MANAGER: "MANAGER",
  COURIER: "COURIER",
  CLIENT: "CLIENT",
}

export const ROLE_MAP = {
  ROLE_SUPER_ADMIN: ROLES.SUPER_ADMIN,
  SUPER_ADMIN: ROLES.SUPER_ADMIN,

  ROLE_MANAGER: ROLES.MANAGER,
  MANAGER: ROLES.MANAGER,

  ROLE_BOSS: ROLES.BOSS,
  BOSS: ROLES.BOSS,
  ROLE_FERMA_RAHBARI: ROLES.BOSS,
  FERMA_RAHBARI: ROLES.BOSS,

  ROLE_COURIER: ROLES.COURIER,
  COURIER: ROLES.COURIER,

  ROLE_CLIENT: ROLES.CLIENT,
  CLIENT: ROLES.CLIENT,
}

export const getHomePath = (role) => {
  if (!role) return "/login"
  const normalized = ROLE_MAP[role] || role
  switch (normalized) {
    case ROLES.SUPER_ADMIN:
      return "/super-admin"
    case ROLES.BOSS:
      return "/boss"
    case ROLES.MANAGER:
      return "/manager"
    default:
      return "/login"
  }
}

export const decodeJwt = (token) => {
  try {
    const payload = token?.split(".")?.[1]
    if (!payload) return null

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/")
    return JSON.parse(
      decodeURIComponent(
        atob(base64)
          .split("")
          .map((char) => "%" + ("00" + char.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      )
    )
  } catch {
    return null
  }
}

export const getUserIdFromToken = (token) => {
  const decodedToken = decodeJwt(token)
  return decodedToken?.userId || decodedToken?.sub || null
}

export const getAuthTokens = (data) => {
  const root = data?.data || data
  return {
    accessToken:
      root?.accessToken ||
      root?.access?.accessToken ||
      data?.accessToken ||
      data?.access?.accessToken ||
      data?.token ||
      data?.jwt ||
      null,

    refreshToken:
      root?.refreshToken ||
      root?.access?.refreshToken ||
      data?.refreshToken ||
      data?.access?.refreshToken ||
      null,
  }
}

export const createUser = (userData, token) => {
  const root = userData?.data || userData
  const decodedToken = decodeJwt(token)

  const rawRole =
    root?.role ||
    root?.roleName ||
    root?.rawRole ||
    decodedToken?.role ||
    decodedToken?.roleName ||
    decodedToken?.roles?.[0] ||
    null

  const userId =
    root?.userId ||
    root?.id ||
    decodedToken?.userId ||
    decodedToken?.sub ||
    null

  if (!userId) {
    return null
  }

  const role = (rawRole && ROLE_MAP[rawRole]) || rawRole || null

  let roleLabel = userData?.roleLabel
  if (role === ROLES.BOSS) {
    roleLabel = "Ferma rahbari"
  } else if (role === ROLES.COURIER) {
    roleLabel = "Kuryer"
  } else if (!roleLabel) {
    if (role === ROLES.SUPER_ADMIN) roleLabel = "Super Admin"
    else if (role === ROLES.MANAGER) roleLabel = "Menejer"
    else roleLabel = "Viloyat Admin"
  }

  const firstName = userData?.firstName || ""
  const lastName = userData?.lastName || ""

  let fullName =
    userData?.name ||
    [firstName, lastName].filter(Boolean).join(" ").trim() ||
    userData?.fullname ||
    roleLabel

  if (fullName === "Ferma boshlig'i" || fullName === "Ferma boshlig‘i") {
    fullName = "Ferma rahbari"
  }

  return {
    id: String(userId),
    userId: String(userId),
    username: userData?.phone || userData?.username || decodedToken?.sub || "",
    phone: userData?.phone,
    name: fullName,
    fullName,
    firstName: firstName || undefined,
    lastName: lastName || undefined,
    role,
    rawRole,
    roleLabel,
    farmId: userData?.farmId ?? null,
    farmName: userData?.farmName || null,
    email: userData?.email || `${userData?.phone || "admin"}@gidrogo.uz`,
    region: userData?.regionName || userData?.region || undefined,
    regionId: userData?.regionId,
    attachmentPath: userData?.attachmentPath || userData?.avatar,
    avatarUrl:
      userData?.avatarUrl ||
      userData?.avatar ||
      userData?.photoUrl ||
      userData?.attachmentPath ||
      "",
    permissions: userData?.permissions || [],
  }
}
