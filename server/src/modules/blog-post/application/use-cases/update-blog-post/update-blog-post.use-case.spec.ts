import { UpdateBlogPostUseCase } from "./update-blog-post.use-case";
import { IBlogPostRepository } from "../../../domain/repository/blog-post.repository.interface";
import { BlogPostNotFoundError } from "../../../domain/errors/blog-post.error";
import { BlogPostEntity } from "../../../domain/entity/blog-post.entity";

describe("UpdateBlogPostUseCase", () => {
  let useCase: UpdateBlogPostUseCase;
  let mockRepo: jest.Mocked<IBlogPostRepository>;

  const mockBlogPost = new BlogPostEntity({
    id: "1",
    title: "Updated Post",
    slug: "my-first-post",
    content: "Updated content",
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
    useCase = new UpdateBlogPostUseCase(mockRepo);
  });

  it("should update and return blog post", async () => {
    mockRepo.update.mockResolvedValue(mockBlogPost);

    const result = await useCase.execute("1", { title: "Updated Post" });

    expect(result).toEqual(mockBlogPost);
    expect(mockRepo.update).toHaveBeenCalledWith("1", { title: "Updated Post" });
  });

  it("should throw BlogPostNotFoundError when blog post not found", async () => {
    mockRepo.update.mockResolvedValue(null);

    await expect(useCase.execute("999", { title: "X" })).rejects.toThrow(BlogPostNotFoundError);
  });
});
