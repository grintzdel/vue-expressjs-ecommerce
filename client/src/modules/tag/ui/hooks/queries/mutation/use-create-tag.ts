import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useDependencies } from '@/modules/app/ui/hooks/use-dependencies'
import type { TagDomainModel } from '@/modules/tag/core/model/tag.domain-model'

export function useCreateTag() {
  const { tagPort } = useDependencies()
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['createTag'],
    mutationFn: (data: TagDomainModel.CreateTagDto) => tagPort.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
}
