import { Router } from "express";
import { BlogPostRepositoryMongooseMongo } from "./infrastructure/repository/blog-post.repository.mongoose-mongo";
import { CreateBlogPostUseCase } from "./application/use-cases/create-blog-post/create-blog-post.use-case";
import { GetAllBlogPostsUseCase } from "./application/use-cases/get-all-blog-posts/get-all-blog-posts.use-case";
import { GetBlogPostBySlugUseCase } from "./application/use-cases/get-blog-post-by-slug/get-blog-post-by-slug.use-case";
import { UpdateBlogPostUseCase } from "./application/use-cases/update-blog-post/update-blog-post.use-case";
import { DeleteBlogPostUseCase } from "./application/use-cases/delete-blog-post/delete-blog-post.use-case";
import { BlogPostService } from "./application/services/blog-post.service";
import { BlogPostController } from "./presentation/controllers/blog-post.controller";

export function createBlogPostModule(): Router {
  const router = Router();

  const blogPostRepository = new BlogPostRepositoryMongooseMongo();

  const createBlogPostUseCase = new CreateBlogPostUseCase(blogPostRepository);
  const getAllBlogPostsUseCase = new GetAllBlogPostsUseCase(blogPostRepository);
  const getBlogPostBySlugUseCase = new GetBlogPostBySlugUseCase(blogPostRepository);
  const updateBlogPostUseCase = new UpdateBlogPostUseCase(blogPostRepository);
  const deleteBlogPostUseCase = new DeleteBlogPostUseCase(blogPostRepository);

  const blogPostService = new BlogPostService(
    createBlogPostUseCase,
    getAllBlogPostsUseCase,
    getBlogPostBySlugUseCase,
    updateBlogPostUseCase,
    deleteBlogPostUseCase
  );

  const controller = new BlogPostController(blogPostService);

  router.post("/", (req, res, next) => controller.create(req, res, next));
  router.get("/", (req, res, next) => controller.getAll(req, res, next));
  router.get("/:slug", (req, res, next) => controller.getBySlug(req, res, next));
  router.patch("/:id", (req, res, next) => controller.update(req, res, next));
  router.delete("/:id", (req, res, next) => controller.delete(req, res, next));

  return router;
}
