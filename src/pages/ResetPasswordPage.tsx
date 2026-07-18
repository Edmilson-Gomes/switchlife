import { useState } from 'react'
import { Link } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { AuthLayout } from '../components/layout/AuthLayout'
import { TextField } from '../components/forms/TextField'
import { Button } from '../components/ui/Button'
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from '../features/auth/schemas/authSchemas'
import { requestPasswordReset } from '../features/auth/api/authApi'

export function ResetPasswordPage() {
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({ resolver: zodResolver(resetPasswordSchema) })

  const onSubmit = async (values: ResetPasswordInput) => {
    try {
      await requestPasswordReset(values)
    } finally {
      // Neutral outcome regardless of whether the e-mail exists, to avoid
      // account enumeration — same principle as ADR-004.
      setSent(true)
    }
  }

  if (sent) {
    return (
      <AuthLayout title="Verifique seu e-mail" subtitle="Recuperação de senha">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Se houver uma conta correspondente, você receberá um e-mail com instruções para
          redefinir sua senha.
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
    <AuthLayout title="Recuperar senha" subtitle="Enviaremos um link de redefinição">
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => void handleSubmit(onSubmit)(event)}
        noValidate
      >
        <TextField
          label="E-mail"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Button type="submit" isLoading={isSubmitting} className="w-full">
          Enviar link
        </Button>
      </form>
      <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        <Link to="/login" className="text-brand-600 hover:underline dark:text-brand-400">
          Voltar para o login
        </Link>
      </div>
    </AuthLayout>
  )
}
