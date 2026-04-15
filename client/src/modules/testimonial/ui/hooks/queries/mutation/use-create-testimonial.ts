import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useDependencies } from '@/modules/app/ui/hooks/use-dependencies'
import type { TestimonialDomainModel } from '@/modules/testimonial/core/model/testimonial.domain-model'

export function useCreateTestimonial() {
  const { testimonialPort } = useDependencies()
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['createTestimonial'],
    mutationFn: (data: TestimonialDomainModel.CreateTestimonialDto) => testimonialPort.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] })
    },
  })
}
