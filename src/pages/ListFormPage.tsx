import { useNavigate } from 'react-router-dom'
import { ListForm } from '../features/lists/components/ListForm'
import { useCreateList } from '../features/lists/hooks/useLists'
import { useToast } from '../components/feedback/ToastProvider'
import type { ListFormInput } from '../features/lists/schemas/listSchemas'

export function ListFormPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const createList = useCreateList()

  const onSubmit = async (values: ListFormInput) => {
    const list = await createList.mutateAsync(values)
    showToast('Lista criada.')
    void navigate(`/app/listas/${list.id}`)
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
        Nova lista
      </h1>
      <ListForm
        onSubmit={onSubmit}
        isSubmitting={createList.isPending}
        submitLabel="Criar lista"
      />
    </div>
  )
}
