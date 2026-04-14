import { IBlogPostRepository } from "../../../domain/repository/blog-post.repository.interface";
import { BlogPostEntity } from "../../../domain/entity/blog-post.entity";
import { BlogPostAlreadyExistsError } from "../../../domain/errors/blog-post.error";

interface CreateBlogPostInput {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  author: string;
  publishedAt: Date | null;
  tags: string[];
}

export class CreateBlogPostUseCase {
  constructor(private readonly blogPostRepository: IBlogPostRepository) {}

  async execute(input: CreateBlogPostInput): Promise<BlogPostEntity> {
    const existing = await this.blogPostRepository.findBySlug(input.slug);
    if (existing) {
      throw new BlogPostAlreadyExistsError();
    }

    return this.blogPostRepository.create({
      title: input.title,
      slug: input.slug,
      content: input.content,
      excerpt: input.excerpt,
      featuredImage: input.featuredImage,
      author: input.author,
      publishedAt: input.publishedAt,
      tags: input.tags,
    });
  }
}
