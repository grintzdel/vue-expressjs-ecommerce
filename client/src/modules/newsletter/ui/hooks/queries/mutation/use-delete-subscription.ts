import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useDependencies } from '@/modules/app/ui/hooks/use-dependencies'

export function useDeleteSubscription() {
  const { newsletterPort } = useDependencies()
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['deleteSubscription'],
    mutationFn: (id: string) => newsletterPort.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletter'] })
    },
  })
}
