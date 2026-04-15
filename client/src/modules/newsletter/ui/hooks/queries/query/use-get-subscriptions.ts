import { useQuery } from '@tanstack/vue-query'
import { useDependencies } from '@/modules/app/ui/hooks/use-dependencies'

export function useGetSubscriptions() {
  const { newsletterPort } = useDependencies()
  return useQuery({
    queryKey: ['newsletter'],
    queryFn: () => newsletterPort.getAll(),
  })
}
