import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../auth/context/AuthContext'
import * as notesApi from '../api/notesApi'
import type { NoteFormInput } from '../schemas/noteSchemas'

const notesKey = ['notes'] as const
const noteKey = (id: string) => ['notes', id] as const

export function useNotes() {
  return useQuery({ queryKey: notesKey, queryFn: notesApi.listNotes })
}

export function useNote(id: string | undefined) {
  return useQuery({
    queryKey: noteKey(id ?? ''),
    queryFn: () => notesApi.getNote(id as string),
    enabled: Boolean(id),
  })
}

export function useCreateNote() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: (input: NoteFormInput) => {
      if (!user) throw new Error('Usuário não autenticado.')
      return notesApi.createNote(user.id, input)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notesKey })
    },
  })
}

export function useUpdateNote(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: NoteFormInput) => notesApi.updateNote(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notesKey })
      void queryClient.invalidateQueries({ queryKey: noteKey(id) })
    },
  })
}

export function useTogglePinned() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isPinned }: { id: string; isPinned: boolean }) =>
      notesApi.togglePinned(id, isPinned),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notesKey })
    },
  })
}

export function useDeleteNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => notesApi.softDeleteNote(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notesKey })
    },
  })
}
