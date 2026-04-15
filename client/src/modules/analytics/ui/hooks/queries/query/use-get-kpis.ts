import { useQuery } from '@tanstack/vue-query'
import { useDependencies } from '@/modules/app/ui/hooks/use-dependencies'

export function useGetKpis() {
  const { analyticsPort } = useDependencies()
  return useQuery({
    queryKey: ['analytics', 'kpis'],
    queryFn: () => analyticsPort.getKpis(),
  })
}
