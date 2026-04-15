import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useDependencies } from '@/modules/app/ui/hooks/use-dependencies'
import type { BlogPostDomainModel } from '@/modules/blog-post/core/model/blog-post.domain-model'

export function useUpdateBlogPost() {
  const { blogPostPort } = useDependencies()
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['updateBlogPost'],
    mutationFn: ({ id, data }: { id: string; data: BlogPostDomainModel.UpdateBlogPostDto }) => blogPostPort.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] })
    },
  })
}
