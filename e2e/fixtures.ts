import type { Page } from '@playwright/test'

export const userA = {
  email: process.env.E2E_USER_A_EMAIL ?? 'usuario.a@example.com',
  password: process.env.E2E_USER_A_PASSWORD ?? 'senha-de-teste-123',
}

export const userB = {
  email: process.env.E2E_USER_B_EMAIL ?? 'usuario.b@example.com',
  password: process.env.E2E_USER_B_PASSWORD ?? 'senha-de-teste-123',
}

export async function login(page: Page, user: { email: string; password: string }) {
  await page.goto('/#/login')
  await page.getByLabel('E-mail').fill(user.email)
  await page.getByLabel('Senha').fill(user.password)
  await page.getByRole('button', { name: 'Entrar' }).click()
  await page.waitForURL(/#\/app\/inicio/)
}
