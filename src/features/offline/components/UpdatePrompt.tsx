import { useRegisterSW } from 'virtual:pwa-register/react'
import { RefreshCw } from 'lucide-react'
import { Button } from '../../../components/ui/Button'

export function UpdatePrompt() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  if (!needRefresh) return null

  return (
    <div className="fixed inset-x-0 bottom-20 z-50 mx-auto flex w-fit items-center gap-3 rounded-lg bg-slate-900 px-4 py-3 text-sm text-white shadow-lg sm:bottom-4 dark:bg-slate-100 dark:text-slate-900">
      <RefreshCw className="size-4" aria-hidden="true" />
      <span>Nova versão disponível.</span>
      <Button size="sm" onClick={() => void updateServiceWorker(true)}>
        Atualizar
      </Button>
    </div>
  )
}
