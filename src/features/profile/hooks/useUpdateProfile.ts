import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateMyProfile, type UpdateProfileInput } from '../api/profileApi'

export function useUpdateProfile(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateProfileInput) => updateMyProfile(userId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['profile', userId] })
    },
  })
}
