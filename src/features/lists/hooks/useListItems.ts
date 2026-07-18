import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../auth/context/AuthContext'
import * as listItemsApi from '../api/listItemsApi'
import type { ListItemFormInput } from '../schemas/listSchemas'
import type { ListItem } from '../../../types/database'

const itemsKey = (listId: string) => ['list-items', listId] as const

export function useListItems(listId: string | undefined) {
  return useQuery({
    queryKey: itemsKey(listId ?? ''),
    queryFn: () => listItemsApi.listItems(listId as string),
    enabled: Boolean(listId),
  })
}

export function useCreateListItem(listId: string) {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: (input: ListItemFormInput) => {
      if (!user) throw new Error('Usuário não autenticado.')
      const current = queryClient.getQueryData<ListItem[]>(itemsKey(listId)) ?? []
      const nextPosition =
        current.length > 0 ? Math.max(...current.map((item) => item.position)) + 1 : 0
      return listItemsApi.createListItem(listId, user.id, input, nextPosition)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: itemsKey(listId) })
    },
  })
}

export function useUpdateListItem(listId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ListItemFormInput }) =>
      listItemsApi.updateListItem(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: itemsKey(listId) })
    },
  })
}

export function useSetItemCompleted(listId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isCompleted }: { id: string; isCompleted: boolean }) =>
      listItemsApi.setItemCompleted(id, isCompleted),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: itemsKey(listId) })
    },
  })
}

export function useReorderListItem(listId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, position }: { id: string; position: number }) =>
      listItemsApi.reorderListItem(id, position),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: itemsKey(listId) })
    },
  })
}

export function useDeleteListItem(listId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => listItemsApi.deleteListItem(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: itemsKey(listId) })
    },
  })
}
