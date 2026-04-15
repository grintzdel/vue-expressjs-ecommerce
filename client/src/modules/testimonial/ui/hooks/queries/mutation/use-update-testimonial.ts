import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useDependencies } from '@/modules/app/ui/hooks/use-dependencies'
import type { TestimonialDomainModel } from '@/modules/testimonial/core/model/testimonial.domain-model'

export function useUpdateTestimonial() {
  const { testimonialPort } = useDependencies()
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['updateTestimonial'],
    mutationFn: ({ id, data }: { id: string; data: TestimonialDomainModel.UpdateTestimonialDto }) => testimonialPort.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] })
    },
  })
}
