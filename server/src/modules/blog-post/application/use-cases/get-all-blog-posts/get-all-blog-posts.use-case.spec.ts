import { GetAllBlogPostsUseCase } from "./get-all-blog-posts.use-case";
import { IBlogPostRepository } from "../../../domain/repository/blog-post.repository.interface";
import { BlogPostEntity } from "../../../domain/entity/blog-post.entity";

describe("GetAllBlogPostsUseCase", () => {
  let useCase: GetAllBlogPostsUseCase;
  let mockRepo: jest.Mocked<IBlogPostRepository>;

  const makeBlogPost = (id: string, slug: string) =>
    new BlogPostEntity({
      id,
      title: "Post",
      slug,
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
    useCase = new GetAllBlogPostsUseCase(mockRepo);
  });

  it("should return all blog posts", async () => {
    const posts = [makeBlogPost("1", "post-1"), makeBlogPost("2", "post-2")];
    mockRepo.findAll.mockResolvedValue(posts);

    const result = await useCase.execute();

    expect(result).toHaveLength(2);
    expect(mockRepo.findAll).toHaveBeenCalled();
  });

  it("should return empty array when no blog posts exist", async () => {
    mockRepo.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toHaveLength(0);
  });
});
