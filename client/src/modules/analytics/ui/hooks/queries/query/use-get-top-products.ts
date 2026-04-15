import { useQuery } from '@tanstack/vue-query'
import { useDependencies } from '@/modules/app/ui/hooks/use-dependencies'

export function useGetTopProducts() {
  const { analyticsPort } = useDependencies()
  return useQuery({
    queryKey: ['analytics', 'top-products'],
    queryFn: () => analyticsPort.getTopProducts(),
  })
}
