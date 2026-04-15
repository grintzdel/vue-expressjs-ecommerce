import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useDependencies } from '@/modules/app/ui/hooks/use-dependencies'

export function useDeletePage() {
  const { pageContentPort } = useDependencies()
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['deletePage'],
    mutationFn: (id: string) => pageContentPort.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] })
    },
  })
}
