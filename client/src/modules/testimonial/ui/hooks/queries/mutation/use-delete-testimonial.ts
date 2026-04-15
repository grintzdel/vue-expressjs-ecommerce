import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useDependencies } from '@/modules/app/ui/hooks/use-dependencies'

export function useDeleteTestimonial() {
  const { testimonialPort } = useDependencies()
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['deleteTestimonial'],
    mutationFn: (id: string) => testimonialPort.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] })
    },
  })
}
