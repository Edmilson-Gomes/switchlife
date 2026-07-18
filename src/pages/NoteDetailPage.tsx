import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Pin, PinOff, Trash2 } from 'lucide-react'
import {
  useNote,
  useUpdateNote,
  useTogglePinned,
  useDeleteNote,
} from '../features/notes/hooks/useNotes'
import { NoteForm, noteToFormValues } from '../features/notes/components/NoteForm'
import { FullScreenSpinner } from '../components/feedback/FullScreenSpinner'
import { EmptyState } from '../components/feedback/EmptyState'
import { ConfirmDialog } from '../components/feedback/ConfirmDialog'
import { Button } from '../components/ui/Button'
import { useToast } from '../components/feedback/ToastProvider'
import { NotebookPen } from 'lucide-react'
import type { NoteFormInput } from '../features/notes/schemas/noteSchemas'

export function NoteDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { data: note, isLoading, isError } = useNote(id)
  const updateNote = useUpdateNote(id ?? '')
  const togglePinned = useTogglePinned()
  const deleteNote = useDeleteNote()
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (isLoading) return <FullScreenSpinner label="Carregando anotação…" />

  if (isError || !note) {
    return (
      <EmptyState
        icon={NotebookPen}
        title="Anotação não encontrada"
        description="Ela pode ter sido excluída ou pertencer a outra conta."
      />
    )
  }

  const onSubmit = async (values: NoteFormInput) => {
    await updateNote.mutateAsync(values)
    showToast('Anotação atualizada.')
  }

  const onDelete = async () => {
    await deleteNote.mutateAsync(note.id)
    showToast('Anotação excluída.')
    void navigate('/app/anotacoes')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Editar anotação
        </h1>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              togglePinned.mutate({ id: note.id, isPinned: !note.is_pinned })
            }
          >
            {note.is_pinned ? <PinOff className="size-4" /> : <Pin className="size-4" />}
            {note.is_pinned ? 'Desafixar' : 'Fixar'}
          </Button>
          <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}>
            <Trash2 className="size-4" />
            Excluir
          </Button>
        </div>
      </div>
      <NoteForm
        defaultValues={noteToFormValues(note)}
        onSubmit={onSubmit}
        isSubmitting={updateNote.isPending}
        submitLabel="Salvar alterações"
      />
      <ConfirmDialog
        open={confirmDelete}
        title="Excluir anotação"
        description="Esta ação move a anotação para a lixeira lógica. Deseja continuar?"
        confirmLabel="Excluir"
        isLoading={deleteNote.isPending}
        onConfirm={() => void onDelete()}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  )
}
