import { useQuery } from '@tanstack/vue-query'
import { useDependencies } from '@/modules/app/ui/hooks/use-dependencies'

export function useGetUsers() {
  const { userPort } = useDependencies()
  return useQuery({
    queryKey: ['users'],
    queryFn: () => userPort.getAll(),
  })
}
