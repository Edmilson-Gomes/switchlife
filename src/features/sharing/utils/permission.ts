import type { List, ListShare } from '../../../types/database'

export type EffectivePermission = 'owner' | 'editor' | 'viewer' | 'none'

// UI-only convenience mirroring list_permission() in the database
// (see supabase/migrations/0004_list_shares.sql). This NEVER replaces RLS:
// even if this function is wrong or bypassed, the database rejects
// unauthorized reads/writes. See docs/architecture/authentication-authorization.md.
export function getEffectivePermission(
  currentUserId: string | undefined,
  list: List | undefined,
  myShare: ListShare | null | undefined,
): EffectivePermission {
  if (!currentUserId || !list) return 'none'
  if (list.owner_id === currentUserId) return 'owner'
  if (myShare && myShare.status === 'accepted' && !myShare.revoked_at) {
    return myShare.permission
  }
  return 'none'
}

export function canEditItems(permission: EffectivePermission): boolean {
  return permission === 'owner' || permission === 'editor'
}

export function canManageList(permission: EffectivePermission): boolean {
  return permission === 'owner'
}
