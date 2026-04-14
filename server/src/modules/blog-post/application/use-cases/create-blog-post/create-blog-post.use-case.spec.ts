import { CreateBlogPostUseCase } from "./create-blog-post.use-case";
import { IBlogPostRepository } from "../../../domain/repository/blog-post.repository.interface";
import { BlogPostAlreadyExistsError } from "../../../domain/errors/blog-post.error";
import { BlogPostEntity } from "../../../domain/entity/blog-post.entity";

describe("CreateBlogPostUseCase", () => {
  let useCase: CreateBlogPostUseCase;
  let mockRepo: jest.Mocked<IBlogPostRepository>;

  const mockBlogPost = new BlogPostEntity({
    id: "1",
    title: "My First Post",
    slug: "my-first-post",
    content: "Content here",
    excerpt: "Short excerpt",
    featuredImage: "https://example.com/image.jpg",
    author: "Jane Doe",
    publishedAt: null,
    tags: ["skincare"],
    createdAt: new Date(),
  });

  const input = {
    title: "My First Post",
    slug: "my-first-post",
    content: "Content here",
    excerpt: "Short excerpt",
    featuredImage: "https://example.com/image.jpg",
    author: "Jane Doe",
    publishedAt: null as Date | null,
    tags: ["skincare"],
  };

  beforeEach(() => {
    mockRepo = {
      findAll: jest.fn(),
      findBySlug: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new CreateBlogPostUseCase(mockRepo);
  });

  it("should create a blog post when slug is unique", async () => {
    mockRepo.findBySlug.mockResolvedValue(null);
    mockRepo.create.mockResolvedValue(mockBlogPost);

    const result = await useCase.execute(input);

    expect(result).toEqual(mockBlogPost);
    expect(mockRepo.findBySlug).toHaveBeenCalledWith("my-first-post");
    expect(mockRepo.create).toHaveBeenCalledWith(input);
  });

  it("should throw BlogPostAlreadyExistsError when slug is taken", async () => {
    mockRepo.findBySlug.mockResolvedValue(mockBlogPost);

    await expect(useCase.execute(input)).rejects.toThrow(BlogPostAlreadyExistsError);

    expect(mockRepo.create).not.toHaveBeenCalled();
  });
});
