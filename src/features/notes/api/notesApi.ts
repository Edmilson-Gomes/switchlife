import { supabase } from '../../../lib/supabase/client'
import type { Note } from '../../../types/database'
import type { NoteFormInput } from '../schemas/noteSchemas'

export async function listNotes(): Promise<Note[]> {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .is('deleted_at', null)
    .order('is_pinned', { ascending: false })
    .order('updated_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getNote(id: string): Promise<Note> {
  const { data, error } = await supabase.from('notes').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function createNote(ownerId: string, input: NoteFormInput): Promise<Note> {
  const { data, error } = await supabase
    .from('notes')
    .insert({
      owner_id: ownerId,
      title: input.title,
      content: input.content,
      category: input.category,
      is_pinned: input.isPinned,
    })
    .select('*')
    .single()
  if (error) throw error
  return data
}

export async function updateNote(id: string, input: NoteFormInput): Promise<Note> {
  const { data, error } = await supabase
    .from('notes')
    .update({
      title: input.title,
      content: input.content,
      category: input.category,
      is_pinned: input.isPinned,
    })
    .eq('id', id)
    .select('*')
    .single()
  if (error) throw error
  return data
}

export async function togglePinned(id: string, isPinned: boolean): Promise<Note> {
  const { data, error } = await supabase
    .from('notes')
    .update({ is_pinned: isPinned })
    .eq('id', id)
    .select('*')
    .single()
  if (error) throw error
  return data
}

export async function softDeleteNote(id: string): Promise<void> {
  const { error } = await supabase
    .from('notes')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}
