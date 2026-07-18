import { Link } from 'react-router-dom'
import { NotebookPen, ListPlus, ShoppingCart, Users } from 'lucide-react'

const actions = [
  { to: '/app/anotacoes/nova', label: 'Nova anotação', icon: NotebookPen },
  { to: '/app/listas/nova', label: 'Nova lista', icon: ListPlus },
  { to: '/app/listas', label: 'Lista de compras', icon: ShoppingCart },
  { to: '/app/compartilhados', label: 'Ver compartilhados', icon: Users },
]

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {actions.map((action) => (
        <Link
          key={action.to}
          to={action.to}
          className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-4 text-center text-sm font-medium text-slate-700 hover:border-brand-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
        >
          <action.icon className="size-6 text-brand-600" aria-hidden="true" />
          {action.label}
        </Link>
      ))}
    </div>
  )
}
