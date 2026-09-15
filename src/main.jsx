import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "@mantine/core/styles.css"
import "./index.css"
import { MantineProvider } from "@mantine/core"
import QueryProvider from "@/provider/QueryProvider"
import AuthProvider from "@/provider/AuthProvider"
import App from "./App.jsx"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryProvider>
      <MantineProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MantineProvider>
    </QueryProvider>
  </StrictMode>
)
