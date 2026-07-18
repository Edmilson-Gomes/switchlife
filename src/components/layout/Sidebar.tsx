import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ChevronsLeft, ChevronsRight } from 'lucide-react'
import { primaryNavItems, secondaryNavItems } from './navigation'
import { cn } from '../../lib/utils/cn'

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'hidden shrink-0 flex-col border-r border-slate-200 bg-white transition-all sm:flex dark:border-slate-800 dark:bg-slate-950',
        collapsed ? 'w-16' : 'w-60',
      )}
    >
      <div className="flex h-16 items-center gap-2 px-4">
        <span className="text-lg font-semibold text-brand-600">
          {collapsed ? 'SL' : 'SwitchLife'}
        </span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-2" aria-label="Navegação principal">
        {[...primaryNavItems, ...secondaryNavItems].map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium',
                isActive
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900',
              )
            }
          >
            <item.icon className="size-5 shrink-0" aria-hidden="true" />
            {!collapsed && item.label}
          </NavLink>
        ))}
      </nav>
      <button
        type="button"
        onClick={() => setCollapsed((value) => !value)}
        aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
        className="m-2 flex items-center justify-center rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900"
      >
        {collapsed ? (
          <ChevronsRight className="size-4" />
        ) : (
          <ChevronsLeft className="size-4" />
        )}
      </button>
    </aside>
  )
}
