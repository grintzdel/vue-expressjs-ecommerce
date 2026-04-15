import type { HttpClient } from '@/modules/shared/http/http-client'
import type { ITestimonialPort } from '../ports/testimonial.port'
import type { TestimonialDomainModel } from '../model/testimonial.domain-model'

export class TestimonialHttpAdapter implements ITestimonialPort {
  constructor(private readonly httpClient: HttpClient) {}

  async getAll(): Promise<TestimonialDomainModel.TestimonialOverviewDto[]> {
    const result = await this.httpClient.get<TestimonialDomainModel.TestimonialOverviewDto[]>('/testimonials')
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }

  async getFeatured(): Promise<TestimonialDomainModel.TestimonialOverviewDto[]> {
    const result = await this.httpClient.get<TestimonialDomainModel.TestimonialOverviewDto[]>('/testimonials/featured')
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }

  async create(data: TestimonialDomainModel.CreateTestimonialDto): Promise<TestimonialDomainModel.TestimonialOverviewDto> {
    const result = await this.httpClient.post<TestimonialDomainModel.TestimonialOverviewDto>('/testimonials', data)
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }

  async update(id: string, data: TestimonialDomainModel.UpdateTestimonialDto): Promise<TestimonialDomainModel.TestimonialOverviewDto> {
    const result = await this.httpClient.patch<TestimonialDomainModel.TestimonialOverviewDto>(`/testimonials/${id}`, data)
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }

  async delete(id: string): Promise<void> {
    const result = await this.httpClient.delete(`/testimonials/${id}`)
    if (result.error) throw new Error(result.error.message)
  }
}
