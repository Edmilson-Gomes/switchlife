import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { TextField } from '../../../components/forms/TextField'
import { TextAreaField } from '../../../components/forms/TextAreaField'
import { SelectField } from '../../../components/forms/SelectField'
import { Button } from '../../../components/ui/Button'
import { listFormSchema, type ListFormInput } from '../schemas/listSchemas'
import { LIST_TYPES } from '../types/listTypes'
import type { List } from '../../../types/database'

interface ListFormProps {
  defaultValues?: Partial<ListFormInput>
  onSubmit: (values: ListFormInput) => Promise<void> | void
  isSubmitting: boolean
  submitLabel: string
}

export function ListForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel,
}: ListFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ListFormInput>({
    resolver: zodResolver(listFormSchema),
    defaultValues: { title: '', description: '', listType: 'generic', ...defaultValues },
  })

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => void handleSubmit(onSubmit)(event)}
      noValidate
    >
      <TextField label="Título" error={errors.title?.message} {...register('title')} />
      <SelectField
        label="Tipo"
        error={errors.listType?.message}
        {...register('listType')}
      >
        {LIST_TYPES.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </SelectField>
      <TextAreaField
        label="Descrição (opcional)"
        rows={4}
        error={errors.description?.message}
        {...register('description')}
      />
      <Button type="submit" isLoading={isSubmitting} className="w-full sm:w-fit">
        {submitLabel}
      </Button>
    </form>
  )
}

export function listToFormValues(list: List): ListFormInput {
  return {
    title: list.title,
    description: list.description ?? '',
    listType: list.list_type,
  }
}
