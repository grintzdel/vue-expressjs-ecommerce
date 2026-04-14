import { IBlogPostRepository } from "../../../domain/repository/blog-post.repository.interface";
import { BlogPostEntity } from "../../../domain/entity/blog-post.entity";
import { BlogPostNotFoundError } from "../../../domain/errors/blog-post.error";

interface UpdateBlogPostInput {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  featuredImage?: string;
  author?: string;
  publishedAt?: Date | null;
  tags?: string[];
}

export class UpdateBlogPostUseCase {
  constructor(private readonly blogPostRepository: IBlogPostRepository) {}

  async execute(id: string, input: UpdateBlogPostInput): Promise<BlogPostEntity> {
    const updated = await this.blogPostRepository.update(id, input);
    if (!updated) {
      throw new BlogPostNotFoundError();
    }
    return updated;
  }
}
