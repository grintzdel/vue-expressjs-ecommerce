import { CreateBlogPostUseCase } from "../use-cases/create-blog-post/create-blog-post.use-case";
import { GetAllBlogPostsUseCase } from "../use-cases/get-all-blog-posts/get-all-blog-posts.use-case";
import { GetBlogPostBySlugUseCase } from "../use-cases/get-blog-post-by-slug/get-blog-post-by-slug.use-case";
import { UpdateBlogPostUseCase } from "../use-cases/update-blog-post/update-blog-post.use-case";
import { DeleteBlogPostUseCase } from "../use-cases/delete-blog-post/delete-blog-post.use-case";

export class BlogPostService {
  constructor(
    private readonly createBlogPostUseCase: CreateBlogPostUseCase,
    private readonly getAllBlogPostsUseCase: GetAllBlogPostsUseCase,
    private readonly getBlogPostBySlugUseCase: GetBlogPostBySlugUseCase,
    private readonly updateBlogPostUseCase: UpdateBlogPostUseCase,
    private readonly deleteBlogPostUseCase: DeleteBlogPostUseCase
  ) {}

  async createBlogPost(input: {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    featuredImage: string;
    author: string;
    publishedAt: Date | null;
    tags: string[];
  }) {
    return this.createBlogPostUseCase.execute(input);
  }

  async getAllBlogPosts() {
    return this.getAllBlogPostsUseCase.execute();
  }

  async getBlogPostBySlug(slug: string) {
    return this.getBlogPostBySlugUseCase.execute(slug);
  }

  async updateBlogPost(
    id: string,
    input: Partial<{
      title: string;
      slug: string;
      content: string;
      excerpt: string;
      featuredImage: string;
      author: string;
      publishedAt: Date | null;
      tags: string[];
    }>
  ) {
    return this.updateBlogPostUseCase.execute(id, input);
  }

  async deleteBlogPost(id: string) {
    return this.deleteBlogPostUseCase.execute(id);
  }
}
