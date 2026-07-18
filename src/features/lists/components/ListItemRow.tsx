import { Trash2 } from 'lucide-react'
import type { ListItem } from '../../../types/database'
import { cn } from '../../../lib/utils/cn'

interface ListItemRowProps {
  item: ListItem
  canEdit: boolean
  onToggle: (item: ListItem) => void
  onDelete: (item: ListItem) => void
}

export function ListItemRow({ item, canEdit, onToggle, onDelete }: ListItemRowProps) {
  return (
    <li className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900">
      <input
        type="checkbox"
        checked={item.is_completed}
        disabled={!canEdit}
        onChange={() => onToggle(item)}
        aria-label={`Marcar "${item.title}" como concluído`}
        className="size-5 shrink-0"
      />
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            'truncate text-sm font-medium text-slate-900 dark:text-slate-100',
            item.is_completed && 'text-slate-400 line-through dark:text-slate-500',
          )}
        >
          {item.title}
        </p>
        {(item.quantity || item.unit) && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {item.quantity ?? ''} {item.unit ?? ''}
          </p>
        )}
      </div>
      {canEdit ? (
        <button
          type="button"
          aria-label={`Remover "${item.title}"`}
          onClick={() => onDelete(item)}
          className="rounded-full p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
        >
          <Trash2 className="size-4" />
        </button>
      ) : null}
    </li>
  )
}
