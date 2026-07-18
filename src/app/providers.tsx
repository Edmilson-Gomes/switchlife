import { useState, type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { AuthProvider } from '../features/auth/context/AuthContext'
import { ThemeProvider } from './providers/ThemeProvider'
import { ToastProvider } from '../components/feedback/ToastProvider'

function createPersistedQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
        gcTime: 24 * 60 * 60 * 1000,
        retry: 1,
      },
    },
  })

  const persister = createSyncStoragePersister({ storage: window.localStorage })
  void persistQueryClient({
    queryClient,
    persister,
    maxAge: 24 * 60 * 60 * 1000,
  })

  return queryClient
}

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createPersistedQueryClient)

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
