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
            background: "#ffffff",
            border: "1px solid #dbeafe",
            color: "#1e293b",
            boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.1), 0 8px 10px -6px rgba(37, 99, 235, 0.05)",
          },
        }}
      />
    </>
  )
}

export default App
