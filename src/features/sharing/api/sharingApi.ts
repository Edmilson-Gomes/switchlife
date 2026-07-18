import { supabase } from '../../../lib/supabase/client'
import type { ListShare, SharePermission } from '../../../types/database'

export interface ShareWithCollaborator extends ListShare {
  collaborator: { display_name: string } | null
}

export interface ShareWithListAndOwner extends ListShare {
  list: { id: string; title: string; list_type: string } | null
  owner: { display_name: string } | null
}

// Resolves an e-mail to a user id via a SECURITY DEFINER RPC that never
// reveals whether the account exists beyond returning a uuid or null.
// See docs/decisions/ADR-004-data-sharing-model.md.
export async function findUserIdByEmail(email: string): Promise<string | null> {
  const { data, error } = await supabase.rpc('find_user_id_by_email', {
    lookup_email: email,
  })
  if (error) throw error
  return data
}

export async function shareList(
  listId: string,
  sharedWithUserId: string,
  permission: SharePermission,
): Promise<void> {
  const { error } = await supabase.from('list_shares').insert({
    list_id: listId,
    shared_with_user_id: sharedWithUserId,
    permission,
    status: 'accepted',
  })
  if (error) throw error
}

export async function listSharesForList(
  listId: string,
): Promise<ShareWithCollaborator[]> {
  const { data, error } = await supabase
    .from('list_shares')
    .select('*, collaborator:profiles!list_shares_shared_with_user_id_fkey(display_name)')
    .eq('list_id', listId)
    .is('revoked_at', null)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function revokeShare(shareId: string): Promise<void> {
  const { error } = await supabase
    .from('list_shares')
    .update({ status: 'revoked', revoked_at: new Date().toISOString() })
    .eq('id', shareId)
  if (error) throw error
}

export async function updateSharePermission(
  shareId: string,
  permission: SharePermission,
): Promise<void> {
  const { error } = await supabase
    .from('list_shares')
    .update({ permission })
    .eq('id', shareId)
  if (error) throw error
}

export async function listSharedWithMe(): Promise<ShareWithListAndOwner[]> {
  const { data, error } = await supabase
    .from('list_shares')
    .select(
      '*, list:lists(id, title, list_type), owner:profiles!list_shares_owner_id_fkey(display_name)',
    )
    .eq('status', 'accepted')
    .is('revoked_at', null)
    .order('updated_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getMyShareForList(listId: string): Promise<ListShare | null> {
  const { data, error } = await supabase
    .from('list_shares')
    .select('*')
    .eq('list_id', listId)
    .eq('status', 'accepted')
    .is('revoked_at', null)
    .maybeSingle()
  if (error) throw error
  return data
}
