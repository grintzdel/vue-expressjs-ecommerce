export class CreateBlogPostRequestDto {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  author: string;
  publishedAt: Date | null;
  tags: string[];

  constructor(body: Record<string, unknown>) {
    this.title = body.title as string;
    this.slug = body.slug as string;
    this.content = body.content as string;
    this.excerpt = (body.excerpt as string) ?? "";
    this.featuredImage = (body.featuredImage as string) ?? "";
    this.author = body.author as string;
    this.publishedAt = body.publishedAt ? new Date(body.publishedAt as string) : null;
    this.tags = Array.isArray(body.tags) ? (body.tags as string[]) : [];
  }
}
