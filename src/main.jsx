import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "@mantine/core/styles.css"
import "./index.css"
import { MantineProvider, createTheme } from "@mantine/core"
import QueryProvider from "@/provider/QueryProvider"
import AuthProvider from "@/provider/AuthProvider"
import App from "./App.jsx"

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
