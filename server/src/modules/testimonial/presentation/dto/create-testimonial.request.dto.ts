export class CreateTestimonialRequestDto {
  authorName: string;
  content: string;
  rating: number;
  featuredProductIds: string[];
  isFeatured: boolean;

  constructor(body: Record<string, unknown>) {
    this.authorName = body.authorName as string;
    this.content = body.content as string;
    this.rating = body.rating as number;
    this.featuredProductIds = (body.featuredProductIds as string[]) ?? [];
    this.isFeatured = (body.isFeatured as boolean) ?? false;
  }
}
