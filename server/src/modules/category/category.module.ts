import { Router } from "express";
import { CategoryRepositoryMongooseMongo } from "./infrastructure/repository/category.repository.mongoose-mongo";
import { CreateCategoryUseCase } from "./application/use-cases/create-category/create-category.use-case";
import { GetAllCategoriesUseCase } from "./application/use-cases/get-all-categories/get-all-categories.use-case";
import { GetCategoryBySlugUseCase } from "./application/use-cases/get-category-by-slug/get-category-by-slug.use-case";
import { UpdateCategoryUseCase } from "./application/use-cases/update-category/update-category.use-case";
import { DeleteCategoryUseCase } from "./application/use-cases/delete-category/delete-category.use-case";
import { CategoryService } from "./application/services/category.service";
import { CategoryController } from "./presentation/controllers/category.controller";

export function createCategoryModule(): Router {
  const router = Router();

  const categoryRepository = new CategoryRepositoryMongooseMongo();

  const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);
  const getAllCategoriesUseCase = new GetAllCategoriesUseCase(categoryRepository);
  const getCategoryBySlugUseCase = new GetCategoryBySlugUseCase(categoryRepository);
  const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository);
  const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepository);

  const categoryService = new CategoryService(
    createCategoryUseCase,
    getAllCategoriesUseCase,
    getCategoryBySlugUseCase,
    updateCategoryUseCase,
    deleteCategoryUseCase
  );

  const controller = new CategoryController(categoryService);

  router.post("/", (req, res, next) => controller.create(req, res, next));
  router.get("/", (req, res, next) => controller.getAll(req, res, next));
  router.get("/:slug", (req, res, next) => controller.getBySlug(req, res, next));
  router.patch("/:id", (req, res, next) => controller.update(req, res, next));
  router.delete("/:id", (req, res, next) => controller.delete(req, res, next));

  return router;
}
