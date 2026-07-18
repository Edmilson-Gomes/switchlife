import { useNavigate } from 'react-router-dom'
import { NoteForm } from '../features/notes/components/NoteForm'
import { useCreateNote } from '../features/notes/hooks/useNotes'
import { useToast } from '../components/feedback/ToastProvider'
import type { NoteFormInput } from '../features/notes/schemas/noteSchemas'

export function NoteFormPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const createNote = useCreateNote()

  const onSubmit = async (values: NoteFormInput) => {
    const note = await createNote.mutateAsync(values)
    showToast('Anotação criada.')
    void navigate(`/app/anotacoes/${note.id}`)
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
        Nova anotação
      </h1>
      <NoteForm
        onSubmit={onSubmit}
        isSubmitting={createNote.isPending}
        submitLabel="Criar anotação"
      />
    </div>
  )
}
