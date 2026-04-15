import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useDependencies } from '@/modules/app/ui/hooks/use-dependencies'
import type { PageContentDomainModel } from '@/modules/page-content/core/model/page-content.domain-model'

export function useCreatePage() {
  const { pageContentPort } = useDependencies()
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['createPage'],
    mutationFn: (data: PageContentDomainModel.CreatePageContentDto) => pageContentPort.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] })
    },
  })
}
