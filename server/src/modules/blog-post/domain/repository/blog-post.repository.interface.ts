import { BlogPostEntity } from "../entity/blog-post.entity";

export interface IBlogPostRepository {
  findAll(): Promise<BlogPostEntity[]>;
  findBySlug(slug: string): Promise<BlogPostEntity | null>;
  findById(id: string): Promise<BlogPostEntity | null>;
  create(data: {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    featuredImage: string;
    author: string;
    publishedAt: Date | null;
    tags: string[];
  }): Promise<BlogPostEntity>;
  update(
    id: string,
    data: Partial<{
      title: string;
      slug: string;
      content: string;
      excerpt: string;
      featuredImage: string;
      author: string;
      publishedAt: Date | null;
      tags: string[];
    }>
  ): Promise<BlogPostEntity | null>;
  delete(id: string): Promise<boolean>;
}
