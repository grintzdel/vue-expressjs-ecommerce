import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useDependencies } from '@/modules/app/ui/hooks/use-dependencies'
import type { TagDomainModel } from '@/modules/tag/core/model/tag.domain-model'

export function useUpdateTag() {
  const { tagPort } = useDependencies()
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['updateTag'],
    mutationFn: ({ id, data }: { id: string; data: TagDomainModel.UpdateTagDto }) => tagPort.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
}
