import { CreateTestimonialUseCase } from "../use-cases/create-testimonial/create-testimonial.use-case";
import { GetAllTestimonialsUseCase } from "../use-cases/get-all-testimonials/get-all-testimonials.use-case";
import { GetFeaturedTestimonialsUseCase } from "../use-cases/get-featured-testimonials/get-featured-testimonials.use-case";
import { UpdateTestimonialUseCase } from "../use-cases/update-testimonial/update-testimonial.use-case";
import { DeleteTestimonialUseCase } from "../use-cases/delete-testimonial/delete-testimonial.use-case";

export class TestimonialService {
  constructor(
    private readonly createTestimonialUseCase: CreateTestimonialUseCase,
    private readonly getAllTestimonialsUseCase: GetAllTestimonialsUseCase,
    private readonly getFeaturedTestimonialsUseCase: GetFeaturedTestimonialsUseCase,
    private readonly updateTestimonialUseCase: UpdateTestimonialUseCase,
    private readonly deleteTestimonialUseCase: DeleteTestimonialUseCase
  ) {}

  async createTestimonial(input: { authorName: string; content: string; rating: number; featuredProductIds: string[]; isFeatured: boolean }) {
    return this.createTestimonialUseCase.execute(input);
  }

  async getAllTestimonials() {
    return this.getAllTestimonialsUseCase.execute();
  }

  async getFeaturedTestimonials() {
    return this.getFeaturedTestimonialsUseCase.execute();
  }

  async updateTestimonial(id: string, input: Partial<{ authorName: string; content: string; rating: number; featuredProductIds: string[]; isFeatured: boolean }>) {
    return this.updateTestimonialUseCase.execute(id, input);
  }

  async deleteTestimonial(id: string) {
    return this.deleteTestimonialUseCase.execute(id);
  }
}
