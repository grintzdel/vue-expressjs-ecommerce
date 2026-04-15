import { useQuery } from '@tanstack/vue-query'
import { useDependencies } from '@/modules/app/ui/hooks/use-dependencies'

export function useGetSkinTypes() {
  const { skinTypePort } = useDependencies()
  return useQuery({
    queryKey: ['skin-types'],
    queryFn: () => skinTypePort.getAll(),
  })
}
