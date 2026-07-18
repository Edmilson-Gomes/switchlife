import { useAuth } from '../../auth/context/AuthContext'

function greetingForHour(hour: number): string {
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

export function Greeting() {
  const { profile } = useAuth()
  const name = profile?.display_name ?? ''
  const greeting = greetingForHour(new Date().getHours())

  return (
    <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
      {greeting}
      {name ? `, ${name}` : ''}
    </h1>
  )
}
