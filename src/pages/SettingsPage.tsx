import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from '../app/providers/ThemeProvider'
import { InstallPrompt } from '../features/offline/components/InstallPrompt'
import { cn } from '../lib/utils/cn'

const themeOptions = [
  { value: 'light' as const, label: 'Claro', icon: Sun },
  { value: 'dark' as const, label: 'Escuro', icon: Moon },
  { value: 'system' as const, label: 'Sistema', icon: Monitor },
]

export function SettingsPage() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
        Configurações
      </h1>

      <InstallPrompt />

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Tema</h2>
        <div className="flex gap-2">
          {themeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setTheme(option.value)}
              aria-pressed={theme === option.value}
              className={cn(
                'flex flex-1 flex-col items-center gap-1.5 rounded-lg border px-3 py-3 text-sm',
                theme === option.value
                  ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
                  : 'border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-300',
              )}
            >
              <option.icon className="size-5" aria-hidden="true" />
              {option.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
