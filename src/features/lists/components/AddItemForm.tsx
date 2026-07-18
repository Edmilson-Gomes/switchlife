import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Plus } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { listItemFormSchema, type ListItemFormInput } from '../schemas/listSchemas'

interface AddItemFormProps {
  onAdd: (values: ListItemFormInput) => Promise<void> | void
  isSubmitting: boolean
}

export function AddItemForm({ onAdd, isSubmitting }: AddItemFormProps) {
  const { register, handleSubmit, reset } = useForm<ListItemFormInput>({
    resolver: zodResolver(listItemFormSchema),
    defaultValues: { title: '', quantity: '', unit: '' },
  })

  const onSubmit = async (values: ListItemFormInput) => {
    await onAdd(values)
    reset({ title: '', quantity: '', unit: '' })
  }

  return (
    <form
      className="flex gap-2"
      onSubmit={(event) => void handleSubmit(onSubmit)(event)}
      aria-label="Adicionar item"
    >
      <label className="sr-only" htmlFor="new-item-title">
        Novo item
      </label>
      <input
        id="new-item-title"
        placeholder="Adicionar item…"
        className="h-11 flex-1 rounded-lg border border-slate-300 bg-white px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        {...register('title')}
      />
      <Button
        type="submit"
        size="md"
        isLoading={isSubmitting}
        aria-label="Adicionar item"
      >
        <Plus className="size-4" />
      </Button>
    </form>
  )
}
