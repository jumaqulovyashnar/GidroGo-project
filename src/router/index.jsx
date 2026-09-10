import { createBrowserRouter, Navigate } from "react-router-dom"
import AuthLayout from "../layout/AuthLayout"
import { LoginPage, RegisterPage, ForgotPasswordPage } from "@/pages/authentication"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
      },
    ],
  },
])

export default router