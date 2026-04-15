import { useQuery } from '@tanstack/vue-query'
import { useDependencies } from '@/modules/app/ui/hooks/use-dependencies'

export function useGetTestimonials() {
  const { testimonialPort } = useDependencies()
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: () => testimonialPort.getAll(),
  })
}
