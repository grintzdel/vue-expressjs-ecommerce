import { BlogPostController } from "./blog-post.controller";
import { BlogPostService } from "../../application/services/blog-post.service";
import { BlogPostEntity } from "../../domain/entity/blog-post.entity";
import { BlogPostNotFoundError } from "../../domain/errors/blog-post.error";
import { Request, Response, NextFunction } from "express";

describe("BlogPostController", () => {
  let controller: BlogPostController;
  let mockService: jest.Mocked<BlogPostService>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  const mockBlogPost = new BlogPostEntity({
    id: "1",
    title: "My First Post",
    slug: "my-first-post",
    content: "Content",
    excerpt: "Excerpt",
    featuredImage: "https://example.com/image.jpg",
    author: "Jane Doe",
    publishedAt: null,
    tags: ["skincare"],
    createdAt: new Date(),
  });

  beforeEach(() => {
    mockService = {
      createBlogPost: jest.fn(),
      getAllBlogPosts: jest.fn(),
      getBlogPostBySlug: jest.fn(),
      updateBlogPost: jest.fn(),
      deleteBlogPost: jest.fn(),
    } as any;

    controller = new BlogPostController(mockService);
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  describe("create", () => {
    it("should return 201 on successful creation", async () => {
      const mockReq = {
        body: {
          title: "My First Post",
          slug: "my-first-post",
          content: "Content",
          excerpt: "Excerpt",
          featuredImage: "https://example.com/image.jpg",
          author: "Jane Doe",
          tags: ["skincare"],
        },
      } as Request;
      mockService.createBlogPost.mockResolvedValue(mockBlogPost);

      await controller.create(mockReq, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({ slug: "my-first-post" }),
      });
    });

    it("should call next on error", async () => {
      const mockReq = { body: {} } as Request;
      const error = new Error("fail");
      mockService.createBlogPost.mockRejectedValue(error);

      await controller.create(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("getAll", () => {
    it("should return 200 with all blog posts", async () => {
      const mockReq = {} as Request;
      mockService.getAllBlogPosts.mockResolvedValue([mockBlogPost]);

      await controller.getAll(mockReq, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.arrayContaining([expect.objectContaining({ slug: "my-first-post" })]),
      });
    });
  });

  describe("getBySlug", () => {
    it("should return 200 with blog post by slug", async () => {
      const mockReq = { params: { slug: "my-first-post" } } as unknown as Request;
      mockService.getBlogPostBySlug.mockResolvedValue(mockBlogPost);

      await controller.getBySlug(mockReq, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({ slug: "my-first-post" }),
      });
    });

    it("should call next with BlogPostNotFoundError when not found", async () => {
      const mockReq = { params: { slug: "unknown" } } as unknown as Request;
      const error = new BlogPostNotFoundError();
      mockService.getBlogPostBySlug.mockRejectedValue(error);

      await controller.getBySlug(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("update", () => {
    it("should return 200 with updated blog post", async () => {
      const mockReq = { params: { id: "1" }, body: { title: "Updated" } } as unknown as Request;
      mockService.updateBlogPost.mockResolvedValue(mockBlogPost);

      await controller.update(mockReq, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it("should call next on error", async () => {
      const mockReq = { params: { id: "999" }, body: {} } as unknown as Request;
      const error = new BlogPostNotFoundError();
      mockService.updateBlogPost.mockRejectedValue(error);

      await controller.update(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("delete", () => {
    it("should return 200 on successful delete", async () => {
      const mockReq = { params: { id: "1" } } as unknown as Request;
      mockService.deleteBlogPost.mockResolvedValue(undefined);

      await controller.delete(mockReq, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ success: true, data: null });
    });

    it("should call next on error", async () => {
      const mockReq = { params: { id: "999" } } as unknown as Request;
      const error = new BlogPostNotFoundError();
      mockService.deleteBlogPost.mockRejectedValue(error);

      await controller.delete(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
