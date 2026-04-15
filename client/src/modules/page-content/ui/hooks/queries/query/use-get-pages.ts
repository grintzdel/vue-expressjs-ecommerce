import { useQuery } from '@tanstack/vue-query'
import { useDependencies } from '@/modules/app/ui/hooks/use-dependencies'

export function useGetPages() {
  const { pageContentPort } = useDependencies()
  return useQuery({
    queryKey: ['pages'],
    queryFn: () => pageContentPort.getAll(),
  })
}
