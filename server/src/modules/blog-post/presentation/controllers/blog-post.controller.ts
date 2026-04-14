import { Request, Response, NextFunction } from "express";
import { BlogPostService } from "../../application/services/blog-post.service";
import { CreateBlogPostRequestDto } from "../dto/create-blog-post.request.dto";
import { UpdateBlogPostRequestDto } from "../dto/update-blog-post.request.dto";
import { BlogPostResponseDto } from "../dto/blog-post.response.dto";

export class BlogPostController {
  constructor(private readonly blogPostService: BlogPostService) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = new CreateBlogPostRequestDto(req.body);
      const blogPost = await this.blogPostService.createBlogPost(dto);
      const response = new BlogPostResponseDto(blogPost);
      res.status(201).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const blogPosts = await this.blogPostService.getAllBlogPosts();
      const response = blogPosts.map((p) => new BlogPostResponseDto(p));
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params["slug"] as string;
      const blogPost = await this.blogPostService.getBlogPostBySlug(slug);
      const response = new BlogPostResponseDto(blogPost);
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params["id"] as string;
      const dto = new UpdateBlogPostRequestDto(req.body);
      const blogPost = await this.blogPostService.updateBlogPost(id, dto);
      const response = new BlogPostResponseDto(blogPost);
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params["id"] as string;
      await this.blogPostService.deleteBlogPost(id);
      res.status(200).json({ success: true, data: null });
    } catch (error) {
      next(error);
    }
  }
}
