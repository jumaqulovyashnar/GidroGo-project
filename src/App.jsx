import { RouterProvider } from "react-router-dom"
import { Toaster } from "sonner"
import router from "./router"


function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        duration={2500}
        toastOptions={{
          style: {
            background: "#2563eb",
            color: "#ffffff",
            border: "1px solid #1d4ed8",
            fontSize: "12px",
            padding: "8px 12px",
            borderRadius: "12px",
            boxShadow: "0 8px 20px -4px rgba(37, 99, 235, 0.35)",
            maxWidth: "300px",
          },
          classNames: {
            toast: "!bg-blue-600 !text-white !border-blue-700 !text-xs !py-2 !px-3 !rounded-xl !shadow-md",
            title: "!text-white !text-xs !font-medium",
            icon: "!text-white",
          },
        }}
      />
    </>
  )
}

export default App
