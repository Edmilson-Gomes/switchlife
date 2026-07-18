import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FullScreenSpinner } from '../../../components/feedback/FullScreenSpinner'

export function RequireAuth() {
  const { status } = useAuth()

  if (status === 'loading') {
    return <FullScreenSpinner label="Carregando sua sessão…" />
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
