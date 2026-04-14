import { IBlogPostRepository } from "../../../domain/repository/blog-post.repository.interface";
import { BlogPostEntity } from "../../../domain/entity/blog-post.entity";

export class GetAllBlogPostsUseCase {
  constructor(private readonly blogPostRepository: IBlogPostRepository) {}

  async execute(): Promise<BlogPostEntity[]> {
    return this.blogPostRepository.findAll();
  }
}
