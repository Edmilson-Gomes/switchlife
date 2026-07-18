import { Navigate } from 'react-router-dom'
import { useAuth } from '../features/auth/context/AuthContext'
import { FullScreenSpinner } from '../components/feedback/FullScreenSpinner'

export function RootRedirect() {
  const { status } = useAuth()

  if (status === 'loading') {
    return <FullScreenSpinner label="Carregando…" />
  }

  return <Navigate to={status === 'authenticated' ? '/app/inicio' : '/login'} replace />
}
