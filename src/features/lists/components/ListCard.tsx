import { Link } from 'react-router-dom'
import { Users } from 'lucide-react'
import type { List } from '../../../types/database'
import { listTypeLabel } from '../types/listTypes'

export function ListCard({ list }: { list: List }) {
  return (
    <Link
      to={`/app/listas/${list.id}`}
      className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-brand-300 dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium text-slate-900 dark:text-slate-100">{list.title}</h3>
        {list.visibility === 'shared' ? (
          <Users
            className="size-4 shrink-0 text-brand-600"
            aria-label="Lista compartilhada"
          />
        ) : null}
      </div>
      {list.description ? (
        <p className="line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
          {list.description}
        </p>
      ) : null}
      <span className="w-fit rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        {listTypeLabel(list.list_type)}
      </span>
    </Link>
  )
}
