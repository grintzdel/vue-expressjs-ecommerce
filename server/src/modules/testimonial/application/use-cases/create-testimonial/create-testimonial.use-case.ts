import { ITestimonialRepository } from "../../../domain/repository/testimonial.repository.interface";
import { TestimonialEntity } from "../../../domain/entity/testimonial.entity";

interface CreateTestimonialInput {
  authorName: string;
  content: string;
  rating: number;
  featuredProductIds: string[];
  isFeatured: boolean;
}

export class CreateTestimonialUseCase {
  constructor(private readonly testimonialRepository: ITestimonialRepository) {}

  async execute(input: CreateTestimonialInput): Promise<TestimonialEntity> {
    return this.testimonialRepository.create({
      authorName: input.authorName,
      content: input.content,
      rating: input.rating,
      featuredProductIds: input.featuredProductIds,
      isFeatured: input.isFeatured,
    });
  }
}
