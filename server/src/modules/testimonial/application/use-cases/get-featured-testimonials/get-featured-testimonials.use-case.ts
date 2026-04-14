import { ITestimonialRepository } from "../../../domain/repository/testimonial.repository.interface";
import { TestimonialEntity } from "../../../domain/entity/testimonial.entity";

export class GetFeaturedTestimonialsUseCase {
  constructor(private readonly testimonialRepository: ITestimonialRepository) {}

  async execute(): Promise<TestimonialEntity[]> {
    return this.testimonialRepository.findFeatured();
  }
}
