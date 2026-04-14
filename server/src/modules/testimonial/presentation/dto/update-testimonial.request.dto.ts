export class UpdateTestimonialRequestDto {
  authorName?: string;
  content?: string;
  rating?: number;
  featuredProductIds?: string[];
  isFeatured?: boolean;

  constructor(body: Record<string, unknown>) {
    if (body.authorName !== undefined) this.authorName = body.authorName as string;
    if (body.content !== undefined) this.content = body.content as string;
    if (body.rating !== undefined) this.rating = body.rating as number;
    if (body.featuredProductIds !== undefined) this.featuredProductIds = body.featuredProductIds as string[];
    if (body.isFeatured !== undefined) this.isFeatured = body.isFeatured as boolean;
  }
}
