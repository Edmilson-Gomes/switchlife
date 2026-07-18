import { test, expect } from '@playwright/test'
import { login, userA, userB } from './fixtures.js'

// Cenário 5 — Revogação
// Dado um compartilhamento ativo, quando o proprietário revogar o acesso,
// então o colaborador não poderá mais consultar a lista.
test('after revocation the collaborator loses access to the list', async ({
  browser,
}) => {
  const contextA = await browser.newContext()
  const pageA = await contextA.newPage()
  await login(pageA, userA)

  const listTitle = `Lista revogação ${Date.now()}`
  await pageA.goto('/#/app/listas/nova')
  await pageA.getByLabel('Título').fill(listTitle)
  await pageA.getByRole('button', { name: 'Criar lista' }).click()
  await pageA.waitForURL(/#\/app\/listas\//)

  await pageA.getByRole('button', { name: 'Compartilhar' }).click()
  await pageA.getByLabel('E-mail do familiar').fill(userB.email)
  await pageA.getByRole('button', { name: 'Enviar convite' }).click()
  await expect(pageA.getByRole('status')).toContainText('conta correspondente')
  await pageA.getByRole('button', { name: /^Fechar$/ }).click()

  await pageA.getByRole('button', { name: 'Revogar' }).click()

  const contextB = await browser.newContext()
  const pageB = await contextB.newPage()
  await login(pageB, userB)
  await pageB.goto('/#/app/compartilhados')
  await expect(pageB.getByText(listTitle)).not.toBeVisible()
  await contextB.close()
  await contextA.close()
})
