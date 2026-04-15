import { useQuery } from '@tanstack/vue-query'
import { useDependencies } from '@/modules/app/ui/hooks/use-dependencies'

export function useGetFeaturedTestimonials() {
  const { testimonialPort } = useDependencies()
  return useQuery({
    queryKey: ['testimonials', 'featured'],
    queryFn: () => testimonialPort.getFeatured(),
  })
}
