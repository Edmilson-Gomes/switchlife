import { test, expect } from '@playwright/test'
import { login, userA, userB } from './fixtures.js'

// Cenário 2 — Dados privados
// Dado dois usuários diferentes, quando o usuário A criar uma anotação,
// então o usuário B não pode consultá-la.
test('user B cannot see a note created by user A', async ({ browser }) => {
  const contextA = await browser.newContext()
  const pageA = await contextA.newPage()
  await login(pageA, userA)

  const noteTitle = `Nota privada ${Date.now()}`
  await pageA.goto('/#/app/anotacoes/nova')
  await pageA.getByLabel('Título').fill(noteTitle)
  await pageA.getByRole('button', { name: 'Criar anotação' }).click()
  await pageA.waitForURL(/#\/app\/anotacoes\//)
  await contextA.close()

  const contextB = await browser.newContext()
  const pageB = await contextB.newPage()
  await login(pageB, userB)
  await pageB.goto('/#/app/anotacoes')
  await expect(pageB.getByText(noteTitle)).not.toBeVisible()
  await contextB.close()
})
