import { useQuery } from '@tanstack/vue-query'
import { useDependencies } from '@/modules/app/ui/hooks/use-dependencies'

export function useGetBlogPosts() {
  const { blogPostPort } = useDependencies()
  return useQuery({
    queryKey: ['blog-posts'],
    queryFn: () => blogPostPort.getAll(),
  })
}
