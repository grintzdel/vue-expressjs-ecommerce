import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useDependencies } from '@/modules/app/ui/hooks/use-dependencies'
import type { PressLogoDomainModel } from '@/modules/press-logo/core/model/press-logo.domain-model'

export function useCreatePressLogo() {
  const { pressLogoPort } = useDependencies()
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['createPressLogo'],
    mutationFn: (data: PressLogoDomainModel.CreatePressLogoDto) => pressLogoPort.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['press-logos'] })
    },
  })
}
