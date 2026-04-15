import { useQuery } from '@tanstack/vue-query'
import { useDependencies } from '@/modules/app/ui/hooks/use-dependencies'

export function useGetTopClients() {
  const { analyticsPort } = useDependencies()
  return useQuery({
    queryKey: ['analytics', 'top-clients'],
    queryFn: () => analyticsPort.getTopClients(),
  })
}
