import { Link } from 'react-router-dom'
import { Pin } from 'lucide-react'
import type { Note } from '../../../types/database'
import { categoryLabel } from '../types/noteCategories'
import { cn } from '../../../lib/utils/cn'

export function NoteCard({ note }: { note: Note }) {
  return (
    <Link
      to={`/app/anotacoes/${note.id}`}
      className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-brand-300 dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium text-slate-900 dark:text-slate-100">{note.title}</h3>
        {note.is_pinned ? (
          <Pin className="size-4 shrink-0 text-brand-600" aria-label="Fixada" />
        ) : null}
      </div>
      <p className="line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
        {note.content || 'Sem conteúdo.'}
      </p>
      <span
        className={cn(
          'w-fit rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300',
        )}
      >
        {categoryLabel(note.category)}
      </span>
    </Link>
  )
}
