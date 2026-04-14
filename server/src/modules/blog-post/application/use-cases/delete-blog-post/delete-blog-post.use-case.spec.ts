import { DeleteBlogPostUseCase } from "./delete-blog-post.use-case";
import { IBlogPostRepository } from "../../../domain/repository/blog-post.repository.interface";
import { BlogPostNotFoundError } from "../../../domain/errors/blog-post.error";

describe("DeleteBlogPostUseCase", () => {
  let useCase: DeleteBlogPostUseCase;
  let mockRepo: jest.Mocked<IBlogPostRepository>;

  beforeEach(() => {
    mockRepo = {
      findAll: jest.fn(),
      findBySlug: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new DeleteBlogPostUseCase(mockRepo);
  });

  it("should delete blog post successfully", async () => {
    mockRepo.delete.mockResolvedValue(true);

    await expect(useCase.execute("1")).resolves.toBeUndefined();

    expect(mockRepo.delete).toHaveBeenCalledWith("1");
  });

  it("should throw BlogPostNotFoundError when blog post not found", async () => {
    mockRepo.delete.mockResolvedValue(false);

    await expect(useCase.execute("999")).rejects.toThrow(BlogPostNotFoundError);
  });
});
