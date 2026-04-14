import { BlogPostService } from "./blog-post.service";
import { CreateBlogPostUseCase } from "../use-cases/create-blog-post/create-blog-post.use-case";
import { GetAllBlogPostsUseCase } from "../use-cases/get-all-blog-posts/get-all-blog-posts.use-case";
import { GetBlogPostBySlugUseCase } from "../use-cases/get-blog-post-by-slug/get-blog-post-by-slug.use-case";
import { UpdateBlogPostUseCase } from "../use-cases/update-blog-post/update-blog-post.use-case";
import { DeleteBlogPostUseCase } from "../use-cases/delete-blog-post/delete-blog-post.use-case";
import { BlogPostEntity } from "../../domain/entity/blog-post.entity";

describe("BlogPostService", () => {
  let service: BlogPostService;
  let mockCreate: jest.Mocked<CreateBlogPostUseCase>;
  let mockGetAll: jest.Mocked<GetAllBlogPostsUseCase>;
  let mockGetBySlug: jest.Mocked<GetBlogPostBySlugUseCase>;
  let mockUpdate: jest.Mocked<UpdateBlogPostUseCase>;
  let mockDelete: jest.Mocked<DeleteBlogPostUseCase>;

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

  const createInput = {
    title: "My First Post",
    slug: "my-first-post",
    content: "Content",
    excerpt: "Excerpt",
    featuredImage: "",
    author: "Author",
    publishedAt: null as Date | null,
    tags: [] as string[],
  };

  beforeEach(() => {
    mockCreate = { execute: jest.fn() } as any;
    mockGetAll = { execute: jest.fn() } as any;
    mockGetBySlug = { execute: jest.fn() } as any;
    mockUpdate = { execute: jest.fn() } as any;
    mockDelete = { execute: jest.fn() } as any;

    service = new BlogPostService(mockCreate, mockGetAll, mockGetBySlug, mockUpdate, mockDelete);
  });

  it("should delegate createBlogPost to CreateBlogPostUseCase", async () => {
    mockCreate.execute.mockResolvedValue(mockBlogPost);

    const result = await service.createBlogPost(createInput);

    expect(result).toEqual(mockBlogPost);
    expect(mockCreate.execute).toHaveBeenCalledWith(createInput);
  });

  it("should delegate getAllBlogPosts to GetAllBlogPostsUseCase", async () => {
    mockGetAll.execute.mockResolvedValue([mockBlogPost]);

    const result = await service.getAllBlogPosts();

    expect(result).toHaveLength(1);
    expect(mockGetAll.execute).toHaveBeenCalled();
  });

  it("should delegate getBlogPostBySlug to GetBlogPostBySlugUseCase", async () => {
    mockGetBySlug.execute.mockResolvedValue(mockBlogPost);

    const result = await service.getBlogPostBySlug("my-first-post");

    expect(result).toEqual(mockBlogPost);
    expect(mockGetBySlug.execute).toHaveBeenCalledWith("my-first-post");
  });

  it("should delegate updateBlogPost to UpdateBlogPostUseCase", async () => {
    mockUpdate.execute.mockResolvedValue(mockBlogPost);

    const result = await service.updateBlogPost("1", { title: "Updated" });

    expect(result).toEqual(mockBlogPost);
    expect(mockUpdate.execute).toHaveBeenCalledWith("1", { title: "Updated" });
  });

  it("should delegate deleteBlogPost to DeleteBlogPostUseCase", async () => {
    mockDelete.execute.mockResolvedValue(undefined);

    await service.deleteBlogPost("1");

    expect(mockDelete.execute).toHaveBeenCalledWith("1");
  });
});
