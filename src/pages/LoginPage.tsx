import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { AuthLayout } from '../components/layout/AuthLayout'
import { TextField } from '../components/forms/TextField'
import { Button } from '../components/ui/Button'
import { loginSchema, type LoginInput } from '../features/auth/schemas/authSchemas'
import { signIn } from '../features/auth/api/authApi'

export function LoginPage() {
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (values: LoginInput) => {
    setFormError(null)
    try {
      await signIn(values)
      void navigate('/app/inicio')
    } catch {
      setFormError('E-mail ou senha inválidos.')
    }
  }

  return (
    <AuthLayout title="Entrar" subtitle="Acesse seu espaço pessoal">
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
        <TextField
          label="Senha"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        {formError ? (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            {formError}
          </p>
        ) : null}
        <Button type="submit" isLoading={isSubmitting} className="w-full">
          Entrar
        </Button>
      </form>
      <div className="mt-6 flex flex-col gap-2 text-center text-sm text-slate-500 dark:text-slate-400">
        <Link
          to="/recuperar-senha"
          className="text-brand-600 hover:underline dark:text-brand-400"
        >
          Esqueci minha senha
        </Link>
        <span>
          Não tem conta?{' '}
          <Link
            to="/cadastro"
            className="text-brand-600 hover:underline dark:text-brand-400"
          >
            Cadastre-se
          </Link>
        </span>
      </div>
    </AuthLayout>
  )
}
