import { TestimonialEntity } from "../entity/testimonial.entity";

export interface ITestimonialRepository {
  findAll(): Promise<TestimonialEntity[]>;
  findFeatured(): Promise<TestimonialEntity[]>;
  findById(id: string): Promise<TestimonialEntity | null>;
  create(data: { authorName: string; content: string; rating: number; featuredProductIds: string[]; isFeatured: boolean }): Promise<TestimonialEntity>;
  update(id: string, data: Partial<{ authorName: string; content: string; rating: number; featuredProductIds: string[]; isFeatured: boolean }>): Promise<TestimonialEntity | null>;
  delete(id: string): Promise<boolean>;
}
