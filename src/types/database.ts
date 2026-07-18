// Hand-written mirror of supabase/migrations/*. If the Supabase CLI is
// available, prefer regenerating this file with:
//   supabase gen types typescript --linked > src/types/database.ts

export type NoteCategory =
  | 'engenharia'
  | 'ia'
  | 'estudos'
  | 'violao'
  | 'exercicios'
  | 'rotina'
  | 'pessoal'
  | 'outros'

export type ListType = 'shopping' | 'checklist' | 'study' | 'task' | 'generic'
export type ListVisibility = 'private' | 'shared'
export type SharePermission = 'viewer' | 'editor'
export type ShareStatus = 'pending' | 'accepted' | 'declined' | 'revoked'

// These are `type` aliases, not `interface`s, on purpose: TypeScript only
// applies the implicit index-signature compatibility check (needed for
// assignability to postgrest-js's `Record<string, unknown>` generic
// constraints) to object type literals, not to interfaces.
export type Profile = {
  id: string
  display_name: string
  avatar_url: string | null
  timezone: string
  locale: string
  created_at: string
  updated_at: string
}

export type Note = {
  id: string
  owner_id: string
  title: string
  content: string
  category: string
  is_pinned: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type List = {
  id: string
  owner_id: string
  title: string
  description: string | null
  list_type: ListType
  visibility: ListVisibility
  created_at: string
  updated_at: string
  archived_at: string | null
}

export type ListItem = {
  id: string
  list_id: string
  created_by: string
  title: string
  description: string | null
  quantity: number | null
  unit: string | null
  is_completed: boolean
  position: number
  created_at: string
  updated_at: string
  completed_at: string | null
}

export type ListShare = {
  id: string
  list_id: string
  owner_id: string
  shared_with_user_id: string
  permission: SharePermission
  status: ShareStatus
  created_at: string
  updated_at: string
  revoked_at: string | null
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Record<string, never>
        Update: Partial<
          Pick<Profile, 'display_name' | 'avatar_url' | 'timezone' | 'locale'>
        >
        Relationships: []
      }
      notes: {
        Row: Note
        Insert: Pick<Note, 'owner_id' | 'title'> &
          Partial<Pick<Note, 'content' | 'category' | 'is_pinned'>>
        Update: Partial<
          Pick<Note, 'title' | 'content' | 'category' | 'is_pinned' | 'deleted_at'>
        >
        Relationships: []
      }
      lists: {
        Row: List
        Insert: Pick<List, 'owner_id' | 'title'> &
          Partial<Pick<List, 'description' | 'list_type'>>
        Update: Partial<
          Pick<List, 'title' | 'description' | 'list_type' | 'visibility' | 'archived_at'>
        >
        Relationships: []
      }
      list_items: {
        Row: ListItem
        Insert: Pick<ListItem, 'list_id' | 'created_by' | 'title'> &
          Partial<
            Pick<
              ListItem,
              'description' | 'quantity' | 'unit' | 'position' | 'is_completed'
            >
          >
        Update: Partial<
          Pick<
            ListItem,
            'title' | 'description' | 'quantity' | 'unit' | 'is_completed' | 'position'
          >
        >
        Relationships: []
      }
      list_shares: {
        Row: ListShare
        Insert: Pick<ListShare, 'list_id' | 'shared_with_user_id'> &
          Partial<Pick<ListShare, 'permission' | 'status'>>
        Update: Partial<Pick<ListShare, 'permission' | 'status' | 'revoked_at'>>
        Relationships: [
          {
            foreignKeyName: 'list_shares_shared_with_user_id_fkey'
            columns: ['shared_with_user_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'list_shares_owner_id_fkey'
            columns: ['owner_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'list_shares_list_id_fkey'
            columns: ['list_id']
            referencedRelation: 'lists'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: Record<string, never>
    Functions: {
      find_user_id_by_email: {
        Args: { lookup_email: string }
        Returns: string | null
      }
    }
  }
}
