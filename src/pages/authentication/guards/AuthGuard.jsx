export const AuthGuard = () => {
  const { isAuthenticated, isInitializing } = useAuth()

  if (isInitializing) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default AuthGuard;