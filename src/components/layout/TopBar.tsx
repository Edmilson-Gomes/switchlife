import { LogOut } from 'lucide-react'
import { useAuth } from '../../features/auth/context/AuthContext'
import { signOut } from '../../features/auth/api/authApi'
import { Button } from '../ui/Button'

export function TopBar() {
  const { profile } = useAuth()

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 px-4 sm:px-6 dark:border-slate-800">
      <span className="text-sm font-medium text-slate-500 dark:text-slate-400 sm:hidden">
        SwitchLife
      </span>
      <span className="hidden text-sm text-slate-500 dark:text-slate-400 sm:inline">
        {profile ? `Olá, ${profile.display_name}` : ''}
      </span>
      <Button variant="ghost" size="sm" onClick={() => void signOut()}>
        <LogOut className="size-4" aria-hidden="true" />
        Sair
      </Button>
    </header>
  )
}
