import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useDependencies } from '@/modules/app/ui/hooks/use-dependencies'

export function useDeletePressLogo() {
  const { pressLogoPort } = useDependencies()
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['deletePressLogo'],
    mutationFn: (id: string) => pressLogoPort.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['press-logos'] })
    },
  })
}
