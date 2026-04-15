import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useDependencies } from '@/modules/app/ui/hooks/use-dependencies'
import type { BlogPostDomainModel } from '@/modules/blog-post/core/model/blog-post.domain-model'

export function useCreateBlogPost() {
  const { blogPostPort } = useDependencies()
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['createBlogPost'],
    mutationFn: (data: BlogPostDomainModel.CreateBlogPostDto) => blogPostPort.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] })
    },
  })
}
