import { GetBlogPostBySlugUseCase } from "./get-blog-post-by-slug.use-case";
import { IBlogPostRepository } from "../../../domain/repository/blog-post.repository.interface";
import { BlogPostNotFoundError } from "../../../domain/errors/blog-post.error";
import { BlogPostEntity } from "../../../domain/entity/blog-post.entity";

describe("GetBlogPostBySlugUseCase", () => {
  let useCase: GetBlogPostBySlugUseCase;
  let mockRepo: jest.Mocked<IBlogPostRepository>;

  const mockBlogPost = new BlogPostEntity({
    id: "1",
    title: "My First Post",
    slug: "my-first-post",
    content: "Content",
    excerpt: "Excerpt",
    featuredImage: "",
    author: "Author",
    publishedAt: null,
    tags: [],
    createdAt: new Date(),
  });

  beforeEach(() => {
    mockRepo = {
      findAll: jest.fn(),
      findBySlug: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new GetBlogPostBySlugUseCase(mockRepo);
  });

  it("should return blog post when found by slug", async () => {
    mockRepo.findBySlug.mockResolvedValue(mockBlogPost);

    const result = await useCase.execute("my-first-post");

    expect(result).toEqual(mockBlogPost);
    expect(mockRepo.findBySlug).toHaveBeenCalledWith("my-first-post");
  });

  it("should throw BlogPostNotFoundError when not found", async () => {
    mockRepo.findBySlug.mockResolvedValue(null);

    await expect(useCase.execute("unknown-slug")).rejects.toThrow(BlogPostNotFoundError);
  });
});
