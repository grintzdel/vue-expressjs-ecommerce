import { useQuery } from '@tanstack/vue-query'
import { useDependencies } from '@/modules/app/ui/hooks/use-dependencies'

export function useGetPressLogos() {
  const { pressLogoPort } = useDependencies()
  return useQuery({
    queryKey: ['press-logos'],
    queryFn: () => pressLogoPort.getAll(),
  })
}
