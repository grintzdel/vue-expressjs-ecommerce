import { useQuery } from '@tanstack/vue-query'
import { useDependencies } from '@/modules/app/ui/hooks/use-dependencies'

export function useGetTags() {
  const { tagPort } = useDependencies()
  return useQuery({
    queryKey: ['tags'],
    queryFn: () => tagPort.getAll(),
  })
}
