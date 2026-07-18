import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NoteForm } from './NoteForm'

describe('NoteForm (integration)', () => {
  it('submits the entered title, content and category', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <NoteForm onSubmit={onSubmit} isSubmitting={false} submitLabel="Criar anotação" />,
    )

    await user.type(screen.getByLabelText('Título'), 'Ideia de estudo')
    await user.selectOptions(screen.getByLabelText('Categoria'), 'engenharia')
    await user.type(screen.getByLabelText('Conteúdo (Markdown)'), 'Estudar RLS')
    await user.click(screen.getByRole('button', { name: 'Criar anotação' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled()
    })
    expect(onSubmit.mock.calls[0]?.[0]).toEqual(
      expect.objectContaining({
        title: 'Ideia de estudo',
        category: 'engenharia',
        content: 'Estudar RLS',
      }),
    )
  })

  it('does not submit when the title is empty', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <NoteForm onSubmit={onSubmit} isSubmitting={false} submitLabel="Criar anotação" />,
    )
    await user.click(screen.getByRole('button', { name: 'Criar anotação' }))

    expect(await screen.findByText('Informe um título.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
