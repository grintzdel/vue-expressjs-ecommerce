import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useDependencies } from '@/modules/app/ui/hooks/use-dependencies'

export function useDeleteSkinType() {
  const { skinTypePort } = useDependencies()
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['deleteSkinType'],
    mutationFn: (id: string) => skinTypePort.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skin-types'] })
    },
  })
}
