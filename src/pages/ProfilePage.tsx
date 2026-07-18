import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useAuth } from '../features/auth/context/AuthContext'
import { useUpdateProfile } from '../features/profile/hooks/useUpdateProfile'
import {
  profileFormSchema,
  type ProfileFormInput,
} from '../features/profile/schemas/profileSchemas'
import { TextField } from '../components/forms/TextField'
import { Button } from '../components/ui/Button'
import { FullScreenSpinner } from '../components/feedback/FullScreenSpinner'
import { useToast } from '../components/feedback/ToastProvider'

export function ProfilePage() {
  const { profile, profileLoading, user } = useAuth()
  const { showToast } = useToast()
  const updateProfile = useUpdateProfile(user?.id ?? '')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormInput>({
    resolver: zodResolver(profileFormSchema),
    values: profile
      ? {
          displayName: profile.display_name,
          avatarUrl: profile.avatar_url ?? '',
          timezone: profile.timezone,
          locale: profile.locale,
        }
      : undefined,
  })

  if (profileLoading || !profile) return <FullScreenSpinner label="Carregando perfil…" />

  const onSubmit = async (values: ProfileFormInput) => {
    await updateProfile.mutateAsync({
      display_name: values.displayName,
      avatar_url: values.avatarUrl || null,
      timezone: values.timezone,
      locale: values.locale,
    })
    showToast('Perfil atualizado.')
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Perfil</h1>
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => void handleSubmit(onSubmit)(event)}
        noValidate
      >
        <TextField
          label="Nome"
          error={errors.displayName?.message}
          {...register('displayName')}
        />
        <TextField
          label="URL do avatar (opcional)"
          error={errors.avatarUrl?.message}
          {...register('avatarUrl')}
        />
        <TextField
          label="Fuso horário"
          error={errors.timezone?.message}
          {...register('timezone')}
        />
        <TextField
          label="Idioma"
          error={errors.locale?.message}
          {...register('locale')}
        />
        <Button
          type="submit"
          isLoading={updateProfile.isPending}
          className="w-full sm:w-fit"
        >
          Salvar alterações
        </Button>
      </form>
    </div>
  )
}
