import { describe, expect, it } from 'vitest'
import { noteFormSchema } from './noteSchemas'

describe('noteFormSchema', () => {
  it('accepts a complete valid note', () => {
    const result = noteFormSchema.safeParse({
      title: 'Minha anotação',
      content: 'Conteúdo em markdown',
      category: 'engenharia',
      isPinned: true,
    })
    expect(result.success).toBe(true)
  })

  it('rejects an empty title', () => {
    const result = noteFormSchema.safeParse({
      title: '',
      content: '',
      category: 'outros',
      isPinned: false,
    })
    expect(result.success).toBe(false)
  })

  it('rejects a missing category', () => {
    const result = noteFormSchema.safeParse({
      title: 'Título',
      content: '',
      category: '',
      isPinned: false,
    })
    expect(result.success).toBe(false)
  })
})
