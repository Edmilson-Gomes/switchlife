import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { MoreHorizontal, X } from 'lucide-react'
import { primaryNavItems, secondaryNavItems } from './navigation'
import { cn } from '../../lib/utils/cn'

export function BottomNav() {
  const [moreOpen, setMoreOpen] = useState(false)

  return (
    <>
      {moreOpen ? (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 sm:hidden"
          role="presentation"
          onClick={() => setMoreOpen(false)}
        >
          <div
            className="absolute inset-x-0 bottom-16 rounded-t-xl bg-white p-2 shadow-lg dark:bg-slate-900"
            onClick={(event) => event.stopPropagation()}
          >
            {secondaryNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMoreOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <item.icon className="size-5" aria-hidden="true" />
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      ) : null}
      <nav
        aria-label="Navegação principal"
        className="fixed inset-x-0 bottom-0 z-50 flex h-16 items-center justify-around border-t border-slate-200 bg-white sm:hidden dark:border-slate-800 dark:bg-slate-950"
      >
        {primaryNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center gap-1 py-2 text-xs',
                isActive
                  ? 'text-brand-600 dark:text-brand-400'
                  : 'text-slate-500 dark:text-slate-400',
              )
            }
          >
            <item.icon className="size-5" aria-hidden="true" />
            {item.label}
          </NavLink>
        ))}
        <button
          type="button"
          onClick={() => setMoreOpen((open) => !open)}
          aria-expanded={moreOpen}
          className="flex flex-1 flex-col items-center gap-1 py-2 text-xs text-slate-500 dark:text-slate-400"
        >
          {moreOpen ? <X className="size-5" /> : <MoreHorizontal className="size-5" />}
          Mais
        </button>
      </nav>
    </>
  )
}
