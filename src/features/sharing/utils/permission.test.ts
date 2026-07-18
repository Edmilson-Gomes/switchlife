import { describe, expect, it } from 'vitest'
import { getEffectivePermission, canEditItems, canManageList } from './permission'
import type { List, ListShare } from '../../../types/database'

const list: List = {
  id: 'list-1',
  owner_id: 'owner-1',
  title: 'Lista de compras',
  description: null,
  list_type: 'shopping',
  visibility: 'shared',
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
  archived_at: null,
}

function makeShare(overrides: Partial<ListShare> = {}): ListShare {
  return {
    id: 'share-1',
    list_id: 'list-1',
    owner_id: 'owner-1',
    shared_with_user_id: 'collaborator-1',
    permission: 'viewer',
    status: 'accepted',
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
    revoked_at: null,
    ...overrides,
  }
}

describe('getEffectivePermission', () => {
  it('returns owner for the list owner', () => {
    expect(getEffectivePermission('owner-1', list, null)).toBe('owner')
  })

  it('returns the share permission for an accepted, non-revoked share', () => {
    expect(
      getEffectivePermission('collaborator-1', list, makeShare({ permission: 'editor' })),
    ).toBe('editor')
    expect(
      getEffectivePermission('collaborator-1', list, makeShare({ permission: 'viewer' })),
    ).toBe('viewer')
  })

  it('returns none when the share was revoked', () => {
    const revoked = makeShare({ revoked_at: '2026-02-01T00:00:00.000Z' })
    expect(getEffectivePermission('collaborator-1', list, revoked)).toBe('none')
  })

  it('returns none when the share is not accepted', () => {
    const pending = makeShare({ status: 'pending' })
    expect(getEffectivePermission('collaborator-1', list, pending)).toBe('none')
  })

  it('returns none when there is no share and the user is not the owner', () => {
    expect(getEffectivePermission('stranger-1', list, null)).toBe('none')
  })

  it('returns none when there is no current user', () => {
    expect(getEffectivePermission(undefined, list, null)).toBe('none')
  })
})

describe('canEditItems', () => {
  it('allows owner and editor', () => {
    expect(canEditItems('owner')).toBe(true)
    expect(canEditItems('editor')).toBe(true)
  })

  it('blocks viewer and none', () => {
    expect(canEditItems('viewer')).toBe(false)
    expect(canEditItems('none')).toBe(false)
  })
})

describe('canManageList', () => {
  it('only allows the owner', () => {
    expect(canManageList('owner')).toBe(true)
    expect(canManageList('editor')).toBe(false)
    expect(canManageList('viewer')).toBe(false)
    expect(canManageList('none')).toBe(false)
  })
})
