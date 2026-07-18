import { describe, expect, it } from 'vitest'
import { listFormSchema, listItemFormSchema } from './listSchemas'

describe('listFormSchema', () => {
  it('accepts a valid list', () => {
    const result = listFormSchema.safeParse({
      title: 'Compras da semana',
      description: 'Itens do mercado',
      listType: 'shopping',
    })
    expect(result.success).toBe(true)
  })

  it('rejects an invalid list type', () => {
    const result = listFormSchema.safeParse({
      title: 'Compras da semana',
      listType: 'invalid-type',
    })
    expect(result.success).toBe(false)
  })

  it('rejects an empty title', () => {
    const result = listFormSchema.safeParse({ title: '', listType: 'generic' })
    expect(result.success).toBe(false)
  })
})

describe('listItemFormSchema', () => {
  it('accepts a minimal item with only a title', () => {
    expect(listItemFormSchema.safeParse({ title: 'Arroz' }).success).toBe(true)
  })

  it('accepts quantity and unit as optional strings', () => {
    const result = listItemFormSchema.safeParse({
      title: 'Arroz',
      quantity: '2',
      unit: 'kg',
    })
    expect(result.success).toBe(true)
  })

  it('rejects an empty title', () => {
    expect(listItemFormSchema.safeParse({ title: '' }).success).toBe(false)
  })
})
