import { Router } from "express";
import { TagRepositoryMongooseMongo } from "./infrastructure/repository/tag.repository.mongoose-mongo";
import { CreateTagUseCase } from "./application/use-cases/create-tag/create-tag.use-case";
import { GetAllTagsUseCase } from "./application/use-cases/get-all-tags/get-all-tags.use-case";
import { GetTagBySlugUseCase } from "./application/use-cases/get-tag-by-slug/get-tag-by-slug.use-case";
import { UpdateTagUseCase } from "./application/use-cases/update-tag/update-tag.use-case";
import { DeleteTagUseCase } from "./application/use-cases/delete-tag/delete-tag.use-case";
import { TagService } from "./application/services/tag.service";
import { TagController } from "./presentation/controllers/tag.controller";

export function createTagModule(): Router {
  const router = Router();

  const tagRepository = new TagRepositoryMongooseMongo();

  const createTagUseCase = new CreateTagUseCase(tagRepository);
  const getAllTagsUseCase = new GetAllTagsUseCase(tagRepository);
  const getTagBySlugUseCase = new GetTagBySlugUseCase(tagRepository);
  const updateTagUseCase = new UpdateTagUseCase(tagRepository);
  const deleteTagUseCase = new DeleteTagUseCase(tagRepository);

  const tagService = new TagService(
    createTagUseCase,
    getAllTagsUseCase,
    getTagBySlugUseCase,
    updateTagUseCase,
    deleteTagUseCase
  );

  const controller = new TagController(tagService);

  router.post("/", (req, res, next) => controller.create(req, res, next));
  router.get("/", (req, res, next) => controller.getAll(req, res, next));
  router.get("/:slug", (req, res, next) => controller.getBySlug(req, res, next));
  router.patch("/:id", (req, res, next) => controller.update(req, res, next));
  router.delete("/:id", (req, res, next) => controller.delete(req, res, next));

  return router;
}
