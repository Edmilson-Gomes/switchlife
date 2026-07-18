import { test, expect } from '@playwright/test'
import { login, userA, userB } from './fixtures.js'

// Cenário 3 — Lista compartilhada como viewer
// Dado que A compartilhou uma lista com B como viewer, quando B abrir a
// lista, então poderá visualizar mas não poderá modificar itens.
test('a viewer can see a shared list but cannot modify items', async ({ browser }) => {
  const contextA = await browser.newContext()
  const pageA = await contextA.newPage()
  await login(pageA, userA)

  const listTitle = `Lista viewer ${Date.now()}`
  await pageA.goto('/#/app/listas/nova')
  await pageA.getByLabel('Título').fill(listTitle)
  await pageA.getByRole('button', { name: 'Criar lista' }).click()
  await pageA.waitForURL(/#\/app\/listas\//)

  await pageA.getByRole('button', { name: 'Compartilhar' }).click()
  await pageA.getByLabel('E-mail do familiar').fill(userB.email)
  await pageA.getByLabel('Permissão').selectOption('viewer')
  await pageA.getByRole('button', { name: 'Enviar convite' }).click()
  await expect(pageA.getByRole('status')).toContainText('conta correspondente')
  await contextA.close()

  const contextB = await browser.newContext()
  const pageB = await contextB.newPage()
  await login(pageB, userB)
  await pageB.goto('/#/app/compartilhados')
  await pageB.getByText(listTitle).click()

  await expect(pageB.getByText(/somente visualizar/i)).toBeVisible()
  await expect(pageB.getByPlaceholder('Adicionar item…')).toHaveCount(0)
  await contextB.close()
})
