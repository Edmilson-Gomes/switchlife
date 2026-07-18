import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'
import { TextField } from '../../../components/forms/TextField'
import { SelectField } from '../../../components/forms/SelectField'
import { Button } from '../../../components/ui/Button'
import { shareListSchema, type ShareListInput } from '../schemas/sharingSchemas'
import { useShareList } from '../hooks/useSharing'
import { useToast } from '../../../components/feedback/ToastProvider'

export function ShareListDialog({
  listId,
  onClose,
}: {
  listId: string
  onClose: () => void
}) {
  const shareList = useShareList()
  const { showToast } = useToast()
  const [message, setMessage] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ShareListInput>({
    resolver: zodResolver(shareListSchema),
    defaultValues: { email: '', permission: 'viewer' },
  })

  const onSubmit = async (values: ShareListInput) => {
    await shareList.mutateAsync({
      listId,
      email: values.email,
      permission: values.permission,
    })
    setMessage(
      'Se houver uma conta correspondente, o convite ficará disponível para o usuário.',
    )
    reset({ email: '', permission: values.permission })
    showToast('Convite processado.')
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-dialog-title"
        className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl dark:bg-slate-900"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2
            id="share-dialog-title"
            className="text-base font-semibold text-slate-900 dark:text-slate-100"
          >
            Compartilhar lista
          </h2>
          <button
            type="button"
            aria-label="Fechar"
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="size-4" />
          </button>
        </div>
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => void handleSubmit(onSubmit)(event)}
          noValidate
        >
          <TextField
            label="E-mail do familiar"
            type="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <SelectField
            label="Permissão"
            error={errors.permission?.message}
            {...register('permission')}
          >
            <option value="viewer">Somente visualizar</option>
            <option value="editor">Pode editar</option>
          </SelectField>
          {message ? (
            <p role="status" className="text-sm text-slate-600 dark:text-slate-400">
              {message}
            </p>
          ) : null}
          <Button type="submit" isLoading={shareList.isPending} className="w-full">
            Enviar convite
          </Button>
        </form>
      </div>
    </div>
  )
}
