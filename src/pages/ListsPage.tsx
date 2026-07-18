import { Link } from 'react-router-dom'
import { ListChecks } from 'lucide-react'
import { useLists } from '../features/lists/hooks/useLists'
import { ListCard } from '../features/lists/components/ListCard'
import { EmptyState } from '../components/feedback/EmptyState'
import { FullScreenSpinner } from '../components/feedback/FullScreenSpinner'
import { Button } from '../components/ui/Button'

export function ListsPage() {
  const { data: lists, isLoading, isError } = useLists()

  if (isLoading) return <FullScreenSpinner label="Carregando listas…" />

  if (isError) {
    return (
      <EmptyState
        icon={ListChecks}
        title="Não foi possível carregar suas listas"
        description="Verifique sua conexão e tente novamente."
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Listas
        </h1>
        <Link to="/app/listas/nova">
          <Button size="sm">Nova lista</Button>
        </Link>
      </div>
      {!lists || lists.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="Nenhuma lista ainda"
          description="Crie sua primeira lista de compras, checklist ou tarefas."
          action={
            <Link to="/app/listas/nova">
              <Button size="sm">Nova lista</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {lists.map((list) => (
            <ListCard key={list.id} list={list} />
          ))}
        </div>
      )}
    </div>
  )
}
