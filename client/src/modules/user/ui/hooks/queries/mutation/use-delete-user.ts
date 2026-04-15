import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useDependencies } from '@/modules/app/ui/hooks/use-dependencies'

export function useDeleteUser() {
  const { userPort } = useDependencies()
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['deleteUser'],
    mutationFn: (id: string) => userPort.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
