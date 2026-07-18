import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FullScreenSpinner } from '../../../components/feedback/FullScreenSpinner'

export function RedirectIfAuthenticated() {
  const { status } = useAuth()

  if (status === 'loading') {
    return <FullScreenSpinner label="Carregando…" />
  }

  if (status === 'authenticated') {
    return <Navigate to="/app/inicio" replace />
  }

  return <Outlet />
}
