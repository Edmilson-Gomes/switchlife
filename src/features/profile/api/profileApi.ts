import { supabase } from '../../../lib/supabase/client'
import type { Profile } from '../../../types/database'

export async function getMyProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data
}

export type UpdateProfileInput = Partial<
  Pick<Profile, 'display_name' | 'avatar_url' | 'timezone' | 'locale'>
>

export async function updateMyProfile(
  userId: string,
  input: UpdateProfileInput,
): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update(input)
    .eq('id', userId)
    .select('*')
    .single()
  if (error) throw error
  return data
}
