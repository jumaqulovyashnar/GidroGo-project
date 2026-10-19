import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true,
      interval: 100,
    },
    proxy: {
      "/api": {
        target: "http://169.58.215.170:8080",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  build: {
    target: "esnext",
    cssCodeSplit: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react-apexcharts") || id.includes("apexcharts")) {
              return "vendor-charts"
            }
            if (id.includes("@mantine")) {
              return "vendor-mantine"
            }
            if (id.includes("@base-ui")) {
              return "vendor-base-ui"
            }
            if (id.includes("@tanstack")) {
              return "vendor-query"
            }
            if (id.includes("lucide-react")) {
              return "vendor-icons"
            }
            if (id.includes("react-router")) {
              return "vendor-router"
            }
            if (id.includes("react") || id.includes("react-dom")) {
              return "vendor-react"
            }
          }
        },
      },
    },
  },
})
