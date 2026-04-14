import { IBlogPostRepository } from "../../../domain/repository/blog-post.repository.interface";
import { BlogPostNotFoundError } from "../../../domain/errors/blog-post.error";

export class DeleteBlogPostUseCase {
  constructor(private readonly blogPostRepository: IBlogPostRepository) {}

  async execute(id: string): Promise<void> {
    const deleted = await this.blogPostRepository.delete(id);
    if (!deleted) {
      throw new BlogPostNotFoundError();
    }
  }
}
