import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useDependencies } from '@/modules/app/ui/hooks/use-dependencies'

export function useDeleteTag() {
  const { tagPort } = useDependencies()
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['deleteTag'],
    mutationFn: (id: string) => tagPort.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
}
