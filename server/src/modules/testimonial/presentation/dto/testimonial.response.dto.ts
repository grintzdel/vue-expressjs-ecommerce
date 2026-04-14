import { TestimonialEntity } from "../../domain/entity/testimonial.entity";

export class TestimonialResponseDto {
  id: string;
  authorName: string;
  content: string;
  rating: number;
  featuredProductIds: string[];
  isFeatured: boolean;
  createdAt: Date;

  constructor(entity: TestimonialEntity) {
    this.id = entity.id;
    this.authorName = entity.authorName;
    this.content = entity.content;
    this.rating = entity.rating;
    this.featuredProductIds = entity.featuredProductIds;
    this.isFeatured = entity.isFeatured;
    this.createdAt = entity.createdAt;
  }
}
