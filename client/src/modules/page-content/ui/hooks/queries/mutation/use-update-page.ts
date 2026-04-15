import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useDependencies } from '@/modules/app/ui/hooks/use-dependencies'
import type { PageContentDomainModel } from '@/modules/page-content/core/model/page-content.domain-model'

export function useUpdatePage() {
  const { pageContentPort } = useDependencies()
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['updatePage'],
    mutationFn: ({ id, data }: { id: string; data: PageContentDomainModel.UpdatePageContentDto }) => pageContentPort.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] })
    },
  })
}
