import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ListItemRow } from './ListItemRow'
import type { ListItem } from '../../../types/database'

const item: ListItem = {
  id: 'item-1',
  list_id: 'list-1',
  created_by: 'owner-1',
  title: 'Arroz',
  description: null,
  quantity: 2,
  unit: 'kg',
  is_completed: false,
  position: 0,
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
  completed_at: null,
}

describe('ListItemRow (integration)', () => {
  it('allows toggling and deleting when the user can edit (owner/editor)', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    const onDelete = vi.fn()

    render(<ListItemRow item={item} canEdit onToggle={onToggle} onDelete={onDelete} />)

    await user.click(screen.getByRole('checkbox'))
    expect(onToggle).toHaveBeenCalledWith(item)

    await user.click(screen.getByRole('button', { name: 'Remover "Arroz"' }))
    expect(onDelete).toHaveBeenCalledWith(item)
  })

  it('blocks toggling and hides delete for a viewer (RF-12: viewer cannot modify items)', () => {
    const onToggle = vi.fn()
    const onDelete = vi.fn()

    render(
      <ListItemRow item={item} canEdit={false} onToggle={onToggle} onDelete={onDelete} />,
    )

    expect(screen.getByRole('checkbox')).toBeDisabled()
    expect(
      screen.queryByRole('button', { name: 'Remover "Arroz"' }),
    ).not.toBeInTheDocument()
  })
})
