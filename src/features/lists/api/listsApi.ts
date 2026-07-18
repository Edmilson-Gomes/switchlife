import { supabase } from '../../../lib/supabase/client'
import type { List } from '../../../types/database'
import type { ListFormInput } from '../schemas/listSchemas'

export async function listMyLists(): Promise<List[]> {
  const { data, error } = await supabase
    .from('lists')
    .select('*')
    .is('archived_at', null)
    .order('updated_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getList(id: string): Promise<List> {
  const { data, error } = await supabase.from('lists').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function createList(ownerId: string, input: ListFormInput): Promise<List> {
  const { data, error } = await supabase
    .from('lists')
    .insert({
      owner_id: ownerId,
      title: input.title,
      description: input.description || null,
      list_type: input.listType,
    })
    .select('*')
    .single()
  if (error) throw error
  return data
}

export async function updateList(id: string, input: ListFormInput): Promise<List> {
  const { data, error } = await supabase
    .from('lists')
    .update({
      title: input.title,
      description: input.description || null,
      list_type: input.listType,
    })
    .eq('id', id)
    .select('*')
    .single()
  if (error) throw error
  return data
}

export async function archiveList(id: string): Promise<void> {
  const { error } = await supabase
    .from('lists')
    .update({ archived_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function deleteList(id: string): Promise<void> {
  const { error } = await supabase.from('lists').delete().eq('id', id)
  if (error) throw error
}
