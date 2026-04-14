import { Router } from "express";
import { ProductRepositoryMongooseMongo } from "./infrastructure/repository/product.repository.mongoose-mongo";
import { CreateProductUseCase } from "./application/use-cases/create-product/create-product.use-case";
import { GetAllProductsUseCase } from "./application/use-cases/get-all-products/get-all-products.use-case";
import { GetProductBySlugUseCase } from "./application/use-cases/get-product-by-slug/get-product-by-slug.use-case";
import { GetProductsByCategoryUseCase } from "./application/use-cases/get-products-by-category/get-products-by-category.use-case";
import { GetFeaturedProductsUseCase } from "./application/use-cases/get-featured-products/get-featured-products.use-case";
import { UpdateProductUseCase } from "./application/use-cases/update-product/update-product.use-case";
import { DeleteProductUseCase } from "./application/use-cases/delete-product/delete-product.use-case";
import { ProductService } from "./application/services/product.service";
import { ProductController } from "./presentation/controllers/product.controller";

export function createProductModule(): Router {
  const router = Router();

  const productRepository = new ProductRepositoryMongooseMongo();

  const createProductUseCase = new CreateProductUseCase(productRepository);
  const getAllProductsUseCase = new GetAllProductsUseCase(productRepository);
  const getProductBySlugUseCase = new GetProductBySlugUseCase(productRepository);
  const getProductsByCategoryUseCase = new GetProductsByCategoryUseCase(productRepository);
  const getFeaturedProductsUseCase = new GetFeaturedProductsUseCase(productRepository);
  const updateProductUseCase = new UpdateProductUseCase(productRepository);
  const deleteProductUseCase = new DeleteProductUseCase(productRepository);

  const productService = new ProductService(
    createProductUseCase,
    getAllProductsUseCase,
    getProductBySlugUseCase,
    getProductsByCategoryUseCase,
    getFeaturedProductsUseCase,
    updateProductUseCase,
    deleteProductUseCase
  );

  const controller = new ProductController(productService);

  router.post("/", (req, res, next) => controller.create(req, res, next));
  router.get("/", (req, res, next) => controller.getAll(req, res, next));
  router.get("/featured", (req, res, next) => controller.getFeatured(req, res, next));
  router.get("/category/:categoryId", (req, res, next) => controller.getByCategory(req, res, next));
  router.get("/:slug", (req, res, next) => controller.getBySlug(req, res, next));
  router.patch("/:id", (req, res, next) => controller.update(req, res, next));
  router.delete("/:id", (req, res, next) => controller.delete(req, res, next));

  return router;
}
