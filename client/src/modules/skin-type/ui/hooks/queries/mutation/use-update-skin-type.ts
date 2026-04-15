import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useDependencies } from '@/modules/app/ui/hooks/use-dependencies'
import type { SkinTypeDomainModel } from '@/modules/skin-type/core/model/skin-type.domain-model'

export function useUpdateSkinType() {
  const { skinTypePort } = useDependencies()
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['updateSkinType'],
    mutationFn: ({ id, data }: { id: string; data: SkinTypeDomainModel.UpdateSkinTypeDto }) => skinTypePort.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skin-types'] })
    },
  })
}
