import { Router } from "express";
import { SkinTypeRepositoryMongooseMongo } from "./infrastructure/repository/skin-type.repository.mongoose-mongo";
import { CreateSkinTypeUseCase } from "./application/use-cases/create-skin-type/create-skin-type.use-case";
import { GetAllSkinTypesUseCase } from "./application/use-cases/get-all-skin-types/get-all-skin-types.use-case";
import { GetSkinTypeBySlugUseCase } from "./application/use-cases/get-skin-type-by-slug/get-skin-type-by-slug.use-case";
import { UpdateSkinTypeUseCase } from "./application/use-cases/update-skin-type/update-skin-type.use-case";
import { DeleteSkinTypeUseCase } from "./application/use-cases/delete-skin-type/delete-skin-type.use-case";
import { SkinTypeService } from "./application/services/skin-type.service";
import { SkinTypeController } from "./presentation/controllers/skin-type.controller";

export function createSkinTypeModule(): Router {
  const router = Router();

  const skinTypeRepository = new SkinTypeRepositoryMongooseMongo();

  const createSkinTypeUseCase = new CreateSkinTypeUseCase(skinTypeRepository);
  const getAllSkinTypesUseCase = new GetAllSkinTypesUseCase(skinTypeRepository);
  const getSkinTypeBySlugUseCase = new GetSkinTypeBySlugUseCase(skinTypeRepository);
  const updateSkinTypeUseCase = new UpdateSkinTypeUseCase(skinTypeRepository);
  const deleteSkinTypeUseCase = new DeleteSkinTypeUseCase(skinTypeRepository);

  const skinTypeService = new SkinTypeService(
    createSkinTypeUseCase,
    getAllSkinTypesUseCase,
    getSkinTypeBySlugUseCase,
    updateSkinTypeUseCase,
    deleteSkinTypeUseCase
  );

  const controller = new SkinTypeController(skinTypeService);

  router.post("/", (req, res, next) => controller.create(req, res, next));
  router.get("/", (req, res, next) => controller.getAll(req, res, next));
  router.get("/:slug", (req, res, next) => controller.getBySlug(req, res, next));
  router.patch("/:id", (req, res, next) => controller.update(req, res, next));
  router.delete("/:id", (req, res, next) => controller.delete(req, res, next));

  return router;
}
