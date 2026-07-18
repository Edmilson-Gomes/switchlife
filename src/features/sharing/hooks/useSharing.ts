import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as sharingApi from '../api/sharingApi'
import type { SharePermission } from '../../../types/database'

const sharesForListKey = (listId: string) => ['list-shares', listId] as const
const mySharesKey = ['shared-with-me'] as const
const myShareForListKey = (listId: string) => ['my-share', listId] as const

export function useSharesForList(listId: string | undefined) {
  return useQuery({
    queryKey: sharesForListKey(listId ?? ''),
    queryFn: () => sharingApi.listSharesForList(listId as string),
    enabled: Boolean(listId),
  })
}

export function useSharedWithMe() {
  return useQuery({ queryKey: mySharesKey, queryFn: sharingApi.listSharedWithMe })
}

export function useMyShareForList(listId: string | undefined) {
  return useQuery({
    queryKey: myShareForListKey(listId ?? ''),
    queryFn: () => sharingApi.getMyShareForList(listId as string),
    enabled: Boolean(listId),
  })
}

interface ShareListParams {
  listId: string
  email: string
  permission: SharePermission
}

export function useShareList() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ listId, email, permission }: ShareListParams) => {
      const userId = await sharingApi.findUserIdByEmail(email)
      if (!userId) {
        // Intentionally identical outcome to "invite recorded" from the
        // caller's perspective — no enumeration signal. See ADR-004.
        return { invited: false as const }
      }
      await sharingApi.shareList(listId, userId, permission)
      return { invited: true as const }
    },
    onSuccess: (_result, variables) => {
      void queryClient.invalidateQueries({ queryKey: sharesForListKey(variables.listId) })
      void queryClient.invalidateQueries({ queryKey: ['lists', variables.listId] })
    },
  })
}

export function useRevokeShare(listId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (shareId: string) => sharingApi.revokeShare(shareId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: sharesForListKey(listId) })
    },
  })
}

export function useUpdateSharePermission(listId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      shareId,
      permission,
    }: {
      shareId: string
      permission: SharePermission
    }) => sharingApi.updateSharePermission(shareId, permission),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: sharesForListKey(listId) })
    },
  })
}
