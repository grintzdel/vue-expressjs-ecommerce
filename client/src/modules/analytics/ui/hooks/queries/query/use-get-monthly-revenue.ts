import { useQuery } from '@tanstack/vue-query'
import { useDependencies } from '@/modules/app/ui/hooks/use-dependencies'

export function useGetMonthlyRevenue() {
  const { analyticsPort } = useDependencies()
  return useQuery({
    queryKey: ['analytics', 'monthly-revenue'],
    queryFn: () => analyticsPort.getMonthlyRevenue(),
  })
}
