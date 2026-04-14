import { IBlogPostRepository } from "../../../domain/repository/blog-post.repository.interface";
import { BlogPostEntity } from "../../../domain/entity/blog-post.entity";
import { BlogPostNotFoundError } from "../../../domain/errors/blog-post.error";

export class GetBlogPostBySlugUseCase {
  constructor(private readonly blogPostRepository: IBlogPostRepository) {}

  async execute(slug: string): Promise<BlogPostEntity> {
    const blogPost = await this.blogPostRepository.findBySlug(slug);
    if (!blogPost) {
      throw new BlogPostNotFoundError();
    }
    return blogPost;
  }
}
