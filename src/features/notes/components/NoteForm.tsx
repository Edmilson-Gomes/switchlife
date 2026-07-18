import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Pin } from 'lucide-react'
import { TextField } from '../../../components/forms/TextField'
import { TextAreaField } from '../../../components/forms/TextAreaField'
import { SelectField } from '../../../components/forms/SelectField'
import { Button } from '../../../components/ui/Button'
import { noteFormSchema, type NoteFormInput } from '../schemas/noteSchemas'
import { NOTE_CATEGORIES } from '../types/noteCategories'
import type { Note } from '../../../types/database'

interface NoteFormProps {
  defaultValues?: Partial<NoteFormInput>
  onSubmit: (values: NoteFormInput) => Promise<void> | void
  isSubmitting: boolean
  submitLabel: string
}

export function NoteForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel,
}: NoteFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NoteFormInput>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      title: '',
      content: '',
      category: 'outros',
      isPinned: false,
      ...defaultValues,
    },
  })

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => void handleSubmit(onSubmit)(event)}
      noValidate
    >
      <TextField label="Título" error={errors.title?.message} {...register('title')} />
      <SelectField
        label="Categoria"
        error={errors.category?.message}
        {...register('category')}
      >
        {NOTE_CATEGORIES.map((category) => (
          <option key={category.value} value={category.value}>
            {category.label}
          </option>
        ))}
      </SelectField>
      <TextAreaField
        label="Conteúdo (Markdown)"
        rows={12}
        error={errors.content?.message}
        {...register('content')}
      />
      <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
        <input type="checkbox" className="size-4" {...register('isPinned')} />
        <Pin className="size-4" aria-hidden="true" />
        Fixar esta anotação
      </label>
      <Button type="submit" isLoading={isSubmitting} className="w-full sm:w-fit">
        {submitLabel}
      </Button>
    </form>
  )
}

export function noteToFormValues(note: Note): NoteFormInput {
  return {
    title: note.title,
    content: note.content,
    category: note.category,
    isPinned: note.is_pinned,
  }
}
