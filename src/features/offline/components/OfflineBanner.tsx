import { WifiOff } from 'lucide-react'
import { useOnlineStatus } from '../hooks/useOnlineStatus'

export function OfflineBanner() {
  const isOnline = useOnlineStatus()

  if (isOnline) return null

  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2 bg-amber-500 px-4 py-2 text-center text-sm font-medium text-amber-950"
    >
      <WifiOff className="size-4" aria-hidden="true" />
      Sem conexão — você está vendo o último conteúdo salvo. Novas ações ficam bloqueadas
      até reconectar.
    </div>
  )
}
