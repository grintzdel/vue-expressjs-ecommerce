import type { ITestimonialPort } from '../ports/testimonial.port'
import type { TestimonialDomainModel } from '../model/testimonial.domain-model'

const mockTestimonials: TestimonialDomainModel.TestimonialOverviewDto[] = [
  {
    id: '1',
    authorName: 'Camille B.',
    content: 'La crème hydratante est absolument incroyable, ma peau n\'a jamais été aussi douce !',
    rating: 5,
    isFeatured: true,
    createdAt: '2026-01-10T11:00:00Z',
  },
  {
    id: '2',
    authorName: 'Léa M.',
    content: 'Des produits naturels de grande qualité. Je recommande vivement le sérum anti-âge.',
    rating: 5,
    isFeatured: true,
    createdAt: '2026-02-05T14:00:00Z',
  },
  {
    id: '3',
    authorName: 'Sophie R.',
    content: 'Livraison rapide et produits conformes à la description. Très satisfaite.',
    rating: 4,
    isFeatured: false,
    createdAt: '2026-03-18T09:30:00Z',
  },
]

export class TestimonialInMemoryAdapter implements ITestimonialPort {
  private testimonials: TestimonialDomainModel.TestimonialOverviewDto[] = [...mockTestimonials]

  async getAll(): Promise<TestimonialDomainModel.TestimonialOverviewDto[]> {
    return [...this.testimonials]
  }

  async getFeatured(): Promise<TestimonialDomainModel.TestimonialOverviewDto[]> {
    return this.testimonials.filter((t) => t.isFeatured)
  }

  async create(data: TestimonialDomainModel.CreateTestimonialDto): Promise<TestimonialDomainModel.TestimonialOverviewDto> {
    const newTestimonial: TestimonialDomainModel.TestimonialOverviewDto = {
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
      ...data,
    }
    this.testimonials.push(newTestimonial)
    return newTestimonial
  }

  async update(id: string, data: TestimonialDomainModel.UpdateTestimonialDto): Promise<TestimonialDomainModel.TestimonialOverviewDto> {
    const index = this.testimonials.findIndex((t) => t.id === id)
    if (index === -1) throw new Error(`Testimonial with id ${id} not found`)
    this.testimonials[index] = { ...this.testimonials[index], ...data }
    return this.testimonials[index]
  }

  async delete(id: string): Promise<void> {
    this.testimonials = this.testimonials.filter((t) => t.id !== id)
  }
}
