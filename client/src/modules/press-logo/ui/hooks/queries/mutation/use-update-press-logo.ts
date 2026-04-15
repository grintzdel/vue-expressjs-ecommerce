import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useDependencies } from '@/modules/app/ui/hooks/use-dependencies'
import type { PressLogoDomainModel } from '@/modules/press-logo/core/model/press-logo.domain-model'

export function useUpdatePressLogo() {
  const { pressLogoPort } = useDependencies()
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['updatePressLogo'],
    mutationFn: ({ id, data }: { id: string; data: PressLogoDomainModel.UpdatePressLogoDto }) => pressLogoPort.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['press-logos'] })
    },
  })
}
