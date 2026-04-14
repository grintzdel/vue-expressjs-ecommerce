import { Router } from "express";
import { PressLogoRepositoryMongooseMongo } from "./infrastructure/repository/press-logo.repository.mongoose-mongo";
import { CreatePressLogoUseCase } from "./application/use-cases/create-press-logo/create-press-logo.use-case";
import { GetAllPressLogosUseCase } from "./application/use-cases/get-all-press-logos/get-all-press-logos.use-case";
import { UpdatePressLogoUseCase } from "./application/use-cases/update-press-logo/update-press-logo.use-case";
import { DeletePressLogoUseCase } from "./application/use-cases/delete-press-logo/delete-press-logo.use-case";
import { PressLogoService } from "./application/services/press-logo.service";
import { PressLogoController } from "./presentation/controllers/press-logo.controller";

export function createPressLogoModule(): Router {
  const router = Router();

  const pressLogoRepository = new PressLogoRepositoryMongooseMongo();

  const createPressLogoUseCase = new CreatePressLogoUseCase(pressLogoRepository);
  const getAllPressLogosUseCase = new GetAllPressLogosUseCase(pressLogoRepository);
  const updatePressLogoUseCase = new UpdatePressLogoUseCase(pressLogoRepository);
  const deletePressLogoUseCase = new DeletePressLogoUseCase(pressLogoRepository);

  const pressLogoService = new PressLogoService(
    createPressLogoUseCase,
    getAllPressLogosUseCase,
    updatePressLogoUseCase,
    deletePressLogoUseCase
  );

  const controller = new PressLogoController(pressLogoService);

  router.post("/", (req, res, next) => controller.create(req, res, next));
  router.get("/", (req, res, next) => controller.getAll(req, res, next));
  router.patch("/:id", (req, res, next) => controller.update(req, res, next));
  router.delete("/:id", (req, res, next) => controller.delete(req, res, next));

  return router;
}
