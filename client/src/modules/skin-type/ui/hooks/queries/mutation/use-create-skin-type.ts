import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useDependencies } from '@/modules/app/ui/hooks/use-dependencies'
import type { SkinTypeDomainModel } from '@/modules/skin-type/core/model/skin-type.domain-model'

export function useCreateSkinType() {
  const { skinTypePort } = useDependencies()
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['createSkinType'],
    mutationFn: (data: SkinTypeDomainModel.CreateSkinTypeDto) => skinTypePort.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skin-types'] })
    },
  })
}
