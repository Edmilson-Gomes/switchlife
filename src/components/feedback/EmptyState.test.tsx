import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NotebookPen } from 'lucide-react'
import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('renders the title and description', () => {
    render(
      <EmptyState
        icon={NotebookPen}
        title="Nenhuma anotação ainda"
        description="Crie sua primeira anotação para começar."
      />,
    )

    expect(screen.getByText('Nenhuma anotação ainda')).toBeInTheDocument()
    expect(
      screen.getByText('Crie sua primeira anotação para começar.'),
    ).toBeInTheDocument()
  })

  it('renders the optional action', () => {
    render(
      <EmptyState
        icon={NotebookPen}
        title="Nenhuma anotação ainda"
        action={<button type="button">Nova anotação</button>}
      />,
    )

    expect(screen.getByRole('button', { name: 'Nova anotação' })).toBeInTheDocument()
  })
})
