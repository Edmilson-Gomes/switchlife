import { supabase } from '../../../lib/supabase/client'
import type { ListItem } from '../../../types/database'
import type { ListItemFormInput } from '../schemas/listSchemas'

export async function listItems(listId: string): Promise<ListItem[]> {
  const { data, error } = await supabase
    .from('list_items')
    .select('*')
    .eq('list_id', listId)
    .order('position', { ascending: true })
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

function parseQuantity(quantity?: string): number | null {
  if (!quantity) return null
  const parsed = Number(quantity)
  return Number.isFinite(parsed) ? parsed : null
}

export async function createListItem(
  listId: string,
  createdBy: string,
  input: ListItemFormInput,
  position: number,
): Promise<ListItem> {
  const { data, error } = await supabase
    .from('list_items')
    .insert({
      list_id: listId,
      created_by: createdBy,
      title: input.title,
      description: input.description || null,
      quantity: parseQuantity(input.quantity),
      unit: input.unit || null,
      position,
    })
    .select('*')
    .single()
  if (error) throw error
  return data
}

export async function updateListItem(
  id: string,
  input: ListItemFormInput,
): Promise<ListItem> {
  const { data, error } = await supabase
    .from('list_items')
    .update({
      title: input.title,
      description: input.description || null,
      quantity: parseQuantity(input.quantity),
      unit: input.unit || null,
    })
    .eq('id', id)
    .select('*')
    .single()
  if (error) throw error
  return data
}

export async function setItemCompleted(
  id: string,
  isCompleted: boolean,
): Promise<ListItem> {
  const { data, error } = await supabase
    .from('list_items')
    .update({ is_completed: isCompleted })
    .eq('id', id)
    .select('*')
    .single()
  if (error) throw error
  return data
}

export async function reorderListItem(id: string, position: number): Promise<void> {
  const { error } = await supabase.from('list_items').update({ position }).eq('id', id)
  if (error) throw error
}

export async function deleteListItem(id: string): Promise<void> {
  const { error } = await supabase.from('list_items').delete().eq('id', id)
  if (error) throw error
}
