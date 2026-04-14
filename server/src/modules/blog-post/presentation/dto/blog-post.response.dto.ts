import { BlogPostEntity } from "../../domain/entity/blog-post.entity";

export class BlogPostResponseDto {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  author: string;
  publishedAt: Date | null;
  tags: string[];
  createdAt: Date;

  constructor(entity: BlogPostEntity) {
    this.id = entity.id;
    this.title = entity.title;
    this.slug = entity.slug;
    this.content = entity.content;
    this.excerpt = entity.excerpt;
    this.featuredImage = entity.featuredImage;
    this.author = entity.author;
    this.publishedAt = entity.publishedAt;
    this.tags = entity.tags;
    this.createdAt = entity.createdAt;
  }
}
