import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useDependencies } from '@/modules/app/ui/hooks/use-dependencies'

export function useUnsubscribe() {
  const { newsletterPort } = useDependencies()
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['unsubscribe'],
    mutationFn: (email: string) => newsletterPort.unsubscribe(email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletter'] })
    },
  })
}
