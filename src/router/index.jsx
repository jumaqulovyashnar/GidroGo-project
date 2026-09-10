import {  createBrowserRouter } from "react-router-dom"
import LoginPage from "../pages/LoginPage";
import AuthLayout from "../layout/AuthLayout";

const router = createBrowserRouter([

  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      }
    ]
  }
])
export default router;  