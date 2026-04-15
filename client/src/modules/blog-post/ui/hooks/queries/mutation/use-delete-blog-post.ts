import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useDependencies } from '@/modules/app/ui/hooks/use-dependencies'

export function useDeleteBlogPost() {
  const { blogPostPort } = useDependencies()
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['deleteBlogPost'],
    mutationFn: (id: string) => blogPostPort.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] })
    },
  })
}
