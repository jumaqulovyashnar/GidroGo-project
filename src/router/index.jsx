import { createBrowserRouter, Navigate } from "react-router-dom"
import AuthLayout from "../layout/AuthLayout"
import {
  LoginPage,
  ForgotPasswordPage,
  OtpVerificationPage,
  ResetPasswordPage,
} from "@/pages/authentication"

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
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "/verify-otp",
        element: <OtpVerificationPage />,
      },
      {
        path: "/reset-password",
        element: <ResetPasswordPage />,
      },
    ],
  },
])

export default router