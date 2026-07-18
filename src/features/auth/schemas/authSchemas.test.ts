import { describe, expect, it } from 'vitest'
import { loginSchema, signUpSchema, resetPasswordSchema } from './authSchemas'

describe('loginSchema', () => {
  it('accepts a valid email and password', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: '12345678',
    })
    expect(result.success).toBe(true)
  })

  it('rejects an invalid email', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: '12345678' })
    expect(result.success).toBe(false)
  })

  it('rejects an empty password', () => {
    const result = loginSchema.safeParse({ email: 'user@example.com', password: '' })
    expect(result.success).toBe(false)
  })
})

describe('signUpSchema', () => {
  const base = {
    displayName: 'Edmilson',
    email: 'user@example.com',
    password: 'password123',
    confirmPassword: 'password123',
  }

  it('accepts matching passwords with at least 8 characters', () => {
    expect(signUpSchema.safeParse(base).success).toBe(true)
  })

  it('rejects passwords shorter than 8 characters', () => {
    const result = signUpSchema.safeParse({
      ...base,
      password: '123',
      confirmPassword: '123',
    })
    expect(result.success).toBe(false)
  })

  it('rejects mismatched password confirmation', () => {
    const result = signUpSchema.safeParse({ ...base, confirmPassword: 'different' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path).toContain('confirmPassword')
    }
  })
})

describe('resetPasswordSchema', () => {
  it('requires a valid email', () => {
    expect(resetPasswordSchema.safeParse({ email: 'user@example.com' }).success).toBe(
      true,
    )
    expect(resetPasswordSchema.safeParse({ email: '' }).success).toBe(false)
  })
})
