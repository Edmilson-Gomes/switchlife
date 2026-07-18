import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Archive, Share2, Trash2, Users } from 'lucide-react'
import {
  useList,
  useArchiveList,
  useDeleteList,
  useUpdateList,
} from '../features/lists/hooks/useLists'
import {
  useListItems,
  useCreateListItem,
  useSetItemCompleted,
  useDeleteListItem,
} from '../features/lists/hooks/useListItems'
import { useMyShareForList, useSharesForList } from '../features/sharing/hooks/useSharing'
import {
  getEffectivePermission,
  canEditItems,
  canManageList,
} from '../features/sharing/utils/permission'
import { useAuth } from '../features/auth/context/AuthContext'
import { ListForm, listToFormValues } from '../features/lists/components/ListForm'
import { ListItemRow } from '../features/lists/components/ListItemRow'
import { AddItemForm } from '../features/lists/components/AddItemForm'
import { ShareListDialog } from '../features/sharing/components/ShareListDialog'
import { CollaboratorList } from '../features/sharing/components/CollaboratorList'
import { FullScreenSpinner } from '../components/feedback/FullScreenSpinner'
import { EmptyState } from '../components/feedback/EmptyState'
import { ConfirmDialog } from '../components/feedback/ConfirmDialog'
import { Button } from '../components/ui/Button'
import { useToast } from '../components/feedback/ToastProvider'
import { ListChecks } from 'lucide-react'
import type { ListFormInput } from '../features/lists/schemas/listSchemas'

export function ListDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showToast } = useToast()

  const { data: list, isLoading, isError } = useList(id)
  const { data: myShare } = useMyShareForList(id)
  const { data: items, isLoading: itemsLoading } = useListItems(id)
  const { data: shares } = useSharesForList(id)

  const updateList = useUpdateList(id ?? '')
  const archiveList = useArchiveList()
  const deleteList = useDeleteList()
  const createItem = useCreateListItem(id ?? '')
  const setItemCompleted = useSetItemCompleted(id ?? '')
  const deleteItem = useDeleteListItem(id ?? '')

  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')
  const [editingList, setEditingList] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [confirmArchive, setConfirmArchive] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (isLoading) return <FullScreenSpinner label="Carregando lista…" />

  if (isError || !list) {
    return (
      <EmptyState
        icon={ListChecks}
        title="Lista não encontrada"
        description="Ela pode ter sido excluída, arquivada ou o acesso pode ter sido revogado."
      />
    )
  }

  const permission = getEffectivePermission(user?.id, list, myShare)
  const editable = canEditItems(permission)
  const owner = canManageList(permission)

  const filteredItems = (items ?? []).filter((item) => {
    if (filter === 'pending') return !item.is_completed
    if (filter === 'completed') return item.is_completed
    return true
  })

  const onUpdateList = async (values: ListFormInput) => {
    await updateList.mutateAsync(values)
    showToast('Lista atualizada.')
    setEditingList(false)
  }

  const onArchive = async () => {
    await archiveList.mutateAsync(list.id)
    showToast('Lista arquivada.')
    void navigate('/app/listas')
  }

  const onDelete = async () => {
    await deleteList.mutateAsync(list.id)
    showToast('Lista excluída.')
    void navigate('/app/listas')
  }

  return (
    <div className="flex flex-col gap-5">
      {!owner ? (
        <div className="flex items-center gap-2 rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-800 dark:bg-brand-900/30 dark:text-brand-200">
          <Users className="size-4" aria-hidden="true" />
          Lista compartilhada com você — sua permissão:{' '}
          {permission === 'editor' ? 'pode editar' : 'somente visualizar'}.
        </div>
      ) : null}

      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            {list.title}
          </h1>
          {list.description ? (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {list.description}
            </p>
          ) : null}
        </div>
        {owner ? (
          <div className="flex shrink-0 gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setEditingList((value) => !value)}
            >
              {editingList ? 'Cancelar' : 'Editar'}
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setShareOpen(true)}>
              <Share2 className="size-4" />
              Compartilhar
            </Button>
          </div>
        ) : null}
      </div>

      {editingList ? (
        <ListForm
          defaultValues={listToFormValues(list)}
          onSubmit={onUpdateList}
          isSubmitting={updateList.isPending}
          submitLabel="Salvar alterações"
        />
      ) : null}

      {owner && shares ? (
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Pessoas com acesso
          </h2>
          <CollaboratorList listId={list.id} shares={shares} />
        </section>
      ) : null}

      <section className="flex flex-col gap-3">
        {editable ? (
          <AddItemForm
            onAdd={async (values) => {
              await createItem.mutateAsync(values)
            }}
            isSubmitting={createItem.isPending}
          />
        ) : null}

        <div className="flex gap-2 text-sm">
          {(['all', 'pending', 'completed'] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`rounded-full px-3 py-1 ${
                filter === value
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {value === 'all'
                ? 'Todos'
                : value === 'pending'
                  ? 'Pendentes'
                  : 'Concluídos'}
            </button>
          ))}
        </div>

        {itemsLoading ? (
          <FullScreenSpinner label="Carregando itens…" />
        ) : filteredItems.length === 0 ? (
          <EmptyState
            icon={ListChecks}
            title="Nenhum item aqui"
            description="Adicione o primeiro item acima."
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {filteredItems.map((item) => (
              <ListItemRow
                key={item.id}
                item={item}
                canEdit={editable}
                onToggle={(current) =>
                  setItemCompleted.mutate({
                    id: current.id,
                    isCompleted: !current.is_completed,
                  })
                }
                onDelete={(current) => deleteItem.mutate(current.id)}
              />
            ))}
          </ul>
        )}
      </section>

      {owner ? (
        <section className="flex justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
          <Button variant="secondary" size="sm" onClick={() => setConfirmArchive(true)}>
            <Archive className="size-4" />
            Arquivar
          </Button>
          <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}>
            <Trash2 className="size-4" />
            Excluir lista
          </Button>
        </section>
      ) : null}

      {shareOpen ? (
        <ShareListDialog listId={list.id} onClose={() => setShareOpen(false)} />
      ) : null}

      <ConfirmDialog
        open={confirmArchive}
        title="Arquivar lista"
        description="A lista sairá da sua visão principal, mas continuará acessível. Deseja continuar?"
        confirmLabel="Arquivar"
        destructive={false}
        isLoading={archiveList.isPending}
        onConfirm={() => void onArchive()}
        onCancel={() => setConfirmArchive(false)}
      />
      <ConfirmDialog
        open={confirmDelete}
        title="Excluir lista"
        description="Esta ação é permanente e remove todos os itens e compartilhamentos. Deseja continuar?"
        confirmLabel="Excluir"
        isLoading={deleteList.isPending}
        onConfirm={() => void onDelete()}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  )
}
