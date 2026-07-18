import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AddItemForm } from './AddItemForm'

describe('AddItemForm (integration)', () => {
  it('adds an item and clears the input afterwards', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn().mockResolvedValue(undefined)

    render(<AddItemForm onAdd={onAdd} isSubmitting={false} />)

    const input = screen.getByPlaceholderText('Adicionar item…')
    await user.type(input, 'Arroz')
    await user.click(screen.getByRole('button', { name: 'Adicionar item' }))

    await waitFor(() => {
      expect(onAdd).toHaveBeenCalledWith(expect.objectContaining({ title: 'Arroz' }))
    })
    await waitFor(() => {
      expect(input).toHaveValue('')
    })
  })
})
