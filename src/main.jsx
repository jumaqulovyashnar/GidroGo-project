import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "@mantine/core/styles.css"
import "./index.css"
import { MantineProvider, createTheme } from "@mantine/core"
import QueryProvider from "@/provider/QueryProvider"
import AuthProvider from "@/provider/AuthProvider"
import App from "./App.jsx"

// Yangi versiya deploy bo'lganda brauzer keshidagi eski chunklarni avtomatik yangilash
if (typeof window !== "undefined") {
  window.addEventListener("vite:preloadError", () => {
    const hasReloaded = window.sessionStorage.getItem("vite_preload_lock")
    if (!hasReloaded) {
      window.sessionStorage.setItem("vite_preload_lock", "true")
      window.location.reload()
    }
  })
}

const theme = createTheme({
  fontFamily: '"Google Sans", "Plus Jakarta Sans", "Open Sans", "Inter", system-ui, sans-serif',
  headings: {
    fontFamily: '"Google Sans", "Plus Jakarta Sans", sans-serif',
  },
})

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryProvider>
      <MantineProvider theme={theme}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MantineProvider>
    </QueryProvider>
  </StrictMode>
)
