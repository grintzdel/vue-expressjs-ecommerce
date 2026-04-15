import { useQuery } from '@tanstack/vue-query'
import { computed, toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import { useDependencies } from '@/modules/app/ui/hooks/use-dependencies'

export function useGetProductBySlug(slug: MaybeRefOrGetter<string>) {
  const { productPort } = useDependencies()
  return useQuery({
    queryKey: computed(() => ['product', toValue(slug)]),
    queryFn: () => productPort.getBySlug(toValue(slug)),
    enabled: computed(() => !!toValue(slug)),
  })
}
