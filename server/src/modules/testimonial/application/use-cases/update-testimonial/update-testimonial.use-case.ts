import { ITestimonialRepository } from "../../../domain/repository/testimonial.repository.interface";
import { TestimonialEntity } from "../../../domain/entity/testimonial.entity";
import { TestimonialNotFoundError } from "../../../domain/errors/testimonial.error";

interface UpdateTestimonialInput {
  authorName?: string;
  content?: string;
  rating?: number;
  featuredProductIds?: string[];
  isFeatured?: boolean;
}

export class UpdateTestimonialUseCase {
  constructor(private readonly testimonialRepository: ITestimonialRepository) {}

  async execute(id: string, input: UpdateTestimonialInput): Promise<TestimonialEntity> {
    const updated = await this.testimonialRepository.update(id, input);
    if (!updated) {
      throw new TestimonialNotFoundError();
    }
    return updated;
  }
}
