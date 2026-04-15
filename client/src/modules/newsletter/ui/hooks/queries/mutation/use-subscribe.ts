import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useDependencies } from '@/modules/app/ui/hooks/use-dependencies'

export function useSubscribe() {
  const { newsletterPort } = useDependencies()
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['subscribe'],
    mutationFn: (email: string) => newsletterPort.subscribe(email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletter'] })
    },
  })
}
