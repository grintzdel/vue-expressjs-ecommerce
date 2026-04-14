import { ITestimonialRepository } from "../../../domain/repository/testimonial.repository.interface";
import { TestimonialNotFoundError } from "../../../domain/errors/testimonial.error";

export class DeleteTestimonialUseCase {
  constructor(private readonly testimonialRepository: ITestimonialRepository) {}

  async execute(id: string): Promise<void> {
    const deleted = await this.testimonialRepository.delete(id);
    if (!deleted) {
      throw new TestimonialNotFoundError();
    }
  }
}
