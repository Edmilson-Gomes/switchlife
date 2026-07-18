import { useState } from 'react'
import { Link } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { AuthLayout } from '../components/layout/AuthLayout'
import { TextField } from '../components/forms/TextField'
import { Button } from '../components/ui/Button'
import { signUpSchema, type SignUpInput } from '../features/auth/schemas/authSchemas'
import { signUp } from '../features/auth/api/authApi'

export function SignUpPage() {
  const [formError, setFormError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>({ resolver: zodResolver(signUpSchema) })

  const onSubmit = async (values: SignUpInput) => {
    setFormError(null)
    try {
      await signUp(values)
      setSuccess(true)
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : 'Não foi possível criar sua conta. Tente novamente.',
      )
    }
  }

  if (success) {
    return (
      <AuthLayout title="Verifique seu e-mail" subtitle="Quase lá">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Enviamos um link de confirmação para o e-mail informado. Confirme para poder
          entrar no SwitchLife.
        </p>
        <Link
          to="/login"
          className="mt-4 inline-block text-sm text-brand-600 hover:underline dark:text-brand-400"
        >
          Voltar para o login
        </Link>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Criar conta" subtitle="Comece a organizar sua rotina">
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => void handleSubmit(onSubmit)(event)}
        noValidate
      >
        <TextField
          label="Nome"
          autoComplete="name"
          error={errors.displayName?.message}
          {...register('displayName')}
        />
        <TextField
          label="E-mail"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <TextField
          label="Senha"
          type="password"
          autoComplete="new-password"
          hint="Ao menos 8 caracteres."
          error={errors.password?.message}
          {...register('password')}
        />
        <TextField
          label="Confirmar senha"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        {formError ? (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            {formError}
          </p>
        ) : null}
        <Button type="submit" isLoading={isSubmitting} className="w-full">
          Criar conta
        </Button>
      </form>
      <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Já tem conta?{' '}
        <Link to="/login" className="text-brand-600 hover:underline dark:text-brand-400">
          Entrar
        </Link>
      </div>
    </AuthLayout>
  )
}
