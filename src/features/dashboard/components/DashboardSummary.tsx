import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useNotes } from '../../notes/hooks/useNotes'
import { useLists } from '../../lists/hooks/useLists'
import { useSharedWithMe } from '../../sharing/hooks/useSharing'

function SummaryCard({
  title,
  to,
  children,
}: {
  title: string
  to: string
  children: ReactNode
}) {
  return (
    <Link
      to={to}
      className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
    >
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
        {title}
      </h3>
      {children}
    </Link>
  )
}

export function DashboardSummary() {
  const { data: notes } = useNotes()
  const { data: lists } = useLists()
  const { data: shares } = useSharedWithMe()

  const recentNotes = (notes ?? []).slice(0, 3)
  const activeLists = (lists ?? []).slice(0, 3)

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <SummaryCard title="Anotações recentes" to="/app/anotacoes">
        {recentNotes.length === 0 ? (
          <p className="text-sm text-slate-400">Nenhuma anotação ainda.</p>
        ) : (
          <ul className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
            {recentNotes.map((note) => (
              <li key={note.id} className="truncate">
                {note.title}
              </li>
            ))}
          </ul>
        )}
      </SummaryCard>

      <SummaryCard title="Listas em andamento" to="/app/listas">
        {activeLists.length === 0 ? (
          <p className="text-sm text-slate-400">Nenhuma lista ainda.</p>
        ) : (
          <ul className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
            {activeLists.map((list) => (
              <li key={list.id} className="truncate">
                {list.title}
              </li>
            ))}
          </ul>
        )}
      </SummaryCard>

      <SummaryCard title="Compartilhados comigo" to="/app/compartilhados">
        {!shares || shares.length === 0 ? (
          <p className="text-sm text-slate-400">Nada compartilhado ainda.</p>
        ) : (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {shares.length}{' '}
            {shares.length === 1 ? 'lista compartilhada' : 'listas compartilhadas'}
          </p>
        )}
      </SummaryCard>
    </div>
  )
}
