import { Router } from "express";
import { PageRepositoryMongooseMongo } from "./infrastructure/repository/page.repository.mongoose-mongo";
import { CreatePageUseCase } from "./application/use-cases/create-page/create-page.use-case";
import { GetAllPagesUseCase } from "./application/use-cases/get-all-pages/get-all-pages.use-case";
import { GetPageBySlugUseCase } from "./application/use-cases/get-page-by-slug/get-page-by-slug.use-case";
import { UpdatePageUseCase } from "./application/use-cases/update-page/update-page.use-case";
import { DeletePageUseCase } from "./application/use-cases/delete-page/delete-page.use-case";
import { PageService } from "./application/services/page.service";
import { PageController } from "./presentation/controllers/page.controller";

export function createPageModule(): Router {
  const router = Router();

  const pageRepository = new PageRepositoryMongooseMongo();

  const createPageUseCase = new CreatePageUseCase(pageRepository);
  const getAllPagesUseCase = new GetAllPagesUseCase(pageRepository);
  const getPageBySlugUseCase = new GetPageBySlugUseCase(pageRepository);
  const updatePageUseCase = new UpdatePageUseCase(pageRepository);
  const deletePageUseCase = new DeletePageUseCase(pageRepository);

  const pageService = new PageService(
    createPageUseCase,
    getAllPagesUseCase,
    getPageBySlugUseCase,
    updatePageUseCase,
    deletePageUseCase
  );

  const controller = new PageController(pageService);

  router.post("/", (req, res, next) => controller.create(req, res, next));
  router.get("/", (req, res, next) => controller.getAll(req, res, next));
  router.get("/:slug", (req, res, next) => controller.getBySlug(req, res, next));
  router.patch("/:id", (req, res, next) => controller.update(req, res, next));
  router.delete("/:id", (req, res, next) => controller.delete(req, res, next));

  return router;
}
