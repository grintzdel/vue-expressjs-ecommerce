export class UpdateBlogPostRequestDto {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  featuredImage?: string;
  author?: string;
  publishedAt?: Date | null;
  tags?: string[];

  constructor(body: Record<string, unknown>) {
    if (body.title !== undefined) this.title = body.title as string;
    if (body.slug !== undefined) this.slug = body.slug as string;
    if (body.content !== undefined) this.content = body.content as string;
    if (body.excerpt !== undefined) this.excerpt = body.excerpt as string;
    if (body.featuredImage !== undefined) this.featuredImage = body.featuredImage as string;
    if (body.author !== undefined) this.author = body.author as string;
    if (body.publishedAt !== undefined) {
      this.publishedAt = body.publishedAt ? new Date(body.publishedAt as string) : null;
    }
    if (body.tags !== undefined) {
      this.tags = Array.isArray(body.tags) ? (body.tags as string[]) : [];
    }
  }
}
