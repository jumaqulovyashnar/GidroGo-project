import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false, // Xato berganda takroriy (double) request yuborilmasligi uchun
      staleTime: 1000 * 60 * 5, // 5 daqiqa kesh
      gcTime: 1000 * 60 * 10, // 10 daqiqa xotirada saqlash
    },
    mutations: {
      retry: false, // POST/PUT/DELETE mutatsiyalarda qayta takroriy so'rov yubormaslik
    },
  },
})

export const QueryProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

export default QueryProvider
