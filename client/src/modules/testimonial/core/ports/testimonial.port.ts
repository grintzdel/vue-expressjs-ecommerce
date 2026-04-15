import type { TestimonialDomainModel } from '../model/testimonial.domain-model'

export interface ITestimonialPort {
  getAll(): Promise<TestimonialDomainModel.TestimonialOverviewDto[]>
  getFeatured(): Promise<TestimonialDomainModel.TestimonialOverviewDto[]>
  create(data: TestimonialDomainModel.CreateTestimonialDto): Promise<TestimonialDomainModel.TestimonialOverviewDto>
  update(id: string, data: TestimonialDomainModel.UpdateTestimonialDto): Promise<TestimonialDomainModel.TestimonialOverviewDto>
  delete(id: string): Promise<void>
}
