import { test, expect } from '@playwright/test'
import { login, userA } from './fixtures.js'

// Cenário 1 — Autenticação
// Dado um usuário válido, quando efetuar login, então deve acessar o dashboard.
test('a valid user can log in and reach the dashboard', async ({ page }) => {
  await login(page, userA)
  await expect(
    page.getByRole('heading', { name: /bom dia|boa tarde|boa noite/i }),
  ).toBeVisible()
})

test('an unauthenticated user is redirected to /login when visiting /app', async ({
  page,
}) => {
  await page.goto('/#/app/inicio')
  await page.waitForURL(/#\/login/)
})
