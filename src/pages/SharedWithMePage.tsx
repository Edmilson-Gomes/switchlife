import { Link } from 'react-router-dom'
import { Users } from 'lucide-react'
import { useSharedWithMe } from '../features/sharing/hooks/useSharing'
import { EmptyState } from '../components/feedback/EmptyState'
import { FullScreenSpinner } from '../components/feedback/FullScreenSpinner'

export function SharedWithMePage() {
  const { data: shares, isLoading, isError } = useSharedWithMe()

  if (isLoading) return <FullScreenSpinner label="Carregando compartilhados…" />

  if (isError) {
    return (
      <EmptyState
        icon={Users}
        title="Não foi possível carregar seus compartilhamentos"
        description="Verifique sua conexão e tente novamente."
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
        Compartilhados comigo
      </h1>
      {!shares || shares.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Nada compartilhado com você ainda"
          description="Quando alguém compartilhar uma lista com você, ela aparecerá aqui."
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {shares.map((share) => (
            <li key={share.id}>
              <Link
                to={`/app/listas/${share.list_id}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 hover:border-brand-300 dark:border-slate-800 dark:bg-slate-900"
              >
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {share.list?.title ?? 'Lista'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Compartilhada por {share.owner?.display_name ?? 'usuário'} ·{' '}
                    {share.permission === 'editor' ? 'pode editar' : 'somente visualizar'}
                  </p>
                </div>
                <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                  Compartilhada
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
