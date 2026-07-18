import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ListForm } from './ListForm'

describe('ListForm (integration)', () => {
  it('submits title, description and list type', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <ListForm onSubmit={onSubmit} isSubmitting={false} submitLabel="Criar lista" />,
    )

    await user.type(screen.getByLabelText('Título'), 'Compras da semana')
    await user.selectOptions(screen.getByLabelText('Tipo'), 'shopping')
    await user.type(screen.getByLabelText('Descrição (opcional)'), 'Mercado de sexta')
    await user.click(screen.getByRole('button', { name: 'Criar lista' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled()
    })
    expect(onSubmit.mock.calls[0]?.[0]).toEqual(
      expect.objectContaining({
        title: 'Compras da semana',
        listType: 'shopping',
        description: 'Mercado de sexta',
      }),
    )
  })

  it('does not submit when the title is empty', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <ListForm onSubmit={onSubmit} isSubmitting={false} submitLabel="Criar lista" />,
    )
    await user.click(screen.getByRole('button', { name: 'Criar lista' }))

    expect(await screen.findByText('Informe um título.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
