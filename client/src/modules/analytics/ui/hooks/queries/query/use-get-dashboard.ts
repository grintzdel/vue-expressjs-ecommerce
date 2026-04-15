import { useQuery } from '@tanstack/vue-query'
import { useDependencies } from '@/modules/app/ui/hooks/use-dependencies'

export function useGetDashboard() {
  const { analyticsPort } = useDependencies()
  return useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: () => analyticsPort.getDashboard(),
  })
}
