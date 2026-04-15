import { useQuery } from '@tanstack/vue-query'
import { useDependencies } from '@/modules/app/ui/hooks/use-dependencies'

export function useGetRecentOrders() {
  const { analyticsPort } = useDependencies()
  return useQuery({
    queryKey: ['analytics', 'recent-orders'],
    queryFn: () => analyticsPort.getRecentOrders(),
  })
}
