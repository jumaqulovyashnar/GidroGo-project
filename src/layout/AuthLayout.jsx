import { Outlet } from "react-router-dom"

function AuthLayout() {
  return (
    <main className="min-h-screen w-full flex flex-col bg-background">
      <Outlet />
    </main>
  )
}

export default AuthLayout