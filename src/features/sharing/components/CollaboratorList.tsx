import { UserX } from 'lucide-react'
import type { ShareWithCollaborator } from '../api/sharingApi'
import { useRevokeShare } from '../hooks/useSharing'

export function CollaboratorList({
  listId,
  shares,
}: {
  listId: string
  shares: ShareWithCollaborator[]
}) {
  const revokeShare = useRevokeShare(listId)

  if (shares.length === 0) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Ninguém tem acesso a esta lista ainda.
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {shares.map((share) => (
        <li
          key={share.id}
          className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-800"
        >
          <div>
            <p className="font-medium text-slate-900 dark:text-slate-100">
              {share.collaborator?.display_name ?? 'Usuário'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {share.permission === 'editor' ? 'Pode editar' : 'Somente visualizar'} ·{' '}
              {share.status}
            </p>
          </div>
          <button
            type="button"
            onClick={() => revokeShare.mutate(share.id)}
            disabled={revokeShare.isPending}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
          >
            <UserX className="size-3.5" />
            Revogar
          </button>
        </li>
      ))}
    </ul>
  )
}
