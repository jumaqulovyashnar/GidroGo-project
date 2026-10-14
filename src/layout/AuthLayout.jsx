import { Outlet } from "react-router-dom"

function AuthLayout() {
  return (
    <div className="h-full w-full overflow-y-auto flex items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md bg-background border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout