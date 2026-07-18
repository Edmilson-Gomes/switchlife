import { test, expect } from '@playwright/test'
import { login, userA, userB } from './fixtures.js'

// Cenário 4 — Lista compartilhada como editor
// Dado que A compartilhou uma lista com B como editor, quando B adicionar
// ou concluir um item, então a alteração deve ficar visível para A.
test('an editor can add an item and the owner sees the change', async ({ browser }) => {
  const contextA = await browser.newContext()
  const pageA = await contextA.newPage()
  await login(pageA, userA)

  const listTitle = `Lista editor ${Date.now()}`
  await pageA.goto('/#/app/listas/nova')
  await pageA.getByLabel('Título').fill(listTitle)
  await pageA.getByRole('button', { name: 'Criar lista' }).click()
  await pageA.waitForURL(/#\/app\/listas\/(?<id>[^/]+)$/)
  const listUrl = pageA.url()

  await pageA.getByRole('button', { name: 'Compartilhar' }).click()
  await pageA.getByLabel('E-mail do familiar').fill(userB.email)
  await pageA.getByLabel('Permissão').selectOption('editor')
  await pageA.getByRole('button', { name: 'Enviar convite' }).click()
  await expect(pageA.getByRole('status')).toContainText('conta correspondente')

  const contextB = await browser.newContext()
  const pageB = await contextB.newPage()
  await login(pageB, userB)
  await pageB.goto('/#/app/compartilhados')
  await pageB.getByText(listTitle).click()

  const itemTitle = `Item de B ${Date.now()}`
  await pageB.getByPlaceholder('Adicionar item…').fill(itemTitle)
  await pageB.getByRole('button', { name: 'Adicionar item' }).click()
  await expect(pageB.getByText(itemTitle)).toBeVisible()
  await contextB.close()

  await pageA.goto(listUrl)
  await expect(pageA.getByText(itemTitle)).toBeVisible()
  await contextA.close()
})
