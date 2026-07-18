import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../auth/context/AuthContext'
import * as listsApi from '../api/listsApi'
import type { ListFormInput } from '../schemas/listSchemas'

const listsKey = ['lists'] as const
const listKey = (id: string) => ['lists', id] as const

export function useLists() {
  return useQuery({ queryKey: listsKey, queryFn: listsApi.listMyLists })
}

export function useList(id: string | undefined) {
  return useQuery({
    queryKey: listKey(id ?? ''),
    queryFn: () => listsApi.getList(id as string),
    enabled: Boolean(id),
  })
}

export function useCreateList() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: (input: ListFormInput) => {
      if (!user) throw new Error('Usuário não autenticado.')
      return listsApi.createList(user.id, input)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: listsKey })
    },
  })
}

export function useUpdateList(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: ListFormInput) => listsApi.updateList(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: listsKey })
      void queryClient.invalidateQueries({ queryKey: listKey(id) })
    },
  })
}

export function useArchiveList() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => listsApi.archiveList(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: listsKey })
    },
  })
}

export function useDeleteList() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => listsApi.deleteList(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: listsKey })
    },
  })
}
