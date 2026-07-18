import { useState } from 'react'
import { Download, X } from 'lucide-react'
import { useInstallPrompt } from '../hooks/useInstallPrompt'
import { Button } from '../../../components/ui/Button'

export function InstallPrompt() {
  const { canInstall, promptInstall } = useInstallPrompt()
  const [dismissed, setDismissed] = useState(false)

  if (!canInstall || dismissed) return null

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2">
        <Download className="size-4 text-brand-600" aria-hidden="true" />
        <span>Instale o SwitchLife na sua tela inicial para acesso rápido.</span>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={() => void promptInstall()}>
          Instalar
        </Button>
        <button
          type="button"
          aria-label="Dispensar"
          onClick={() => setDismissed(true)}
          className="rounded-full p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  )
}
