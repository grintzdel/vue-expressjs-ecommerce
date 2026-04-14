import { Router } from "express";
import { SkinDiagnosisRepositoryMongooseMongo } from "./infrastructure/repository/skin-diagnosis.repository.mongoose-mongo";
import { CreateDiagnosisUseCase } from "./application/use-cases/create-diagnosis/create-diagnosis.use-case";
import { GetDiagnosisByTokenUseCase } from "./application/use-cases/get-diagnosis-by-token/get-diagnosis-by-token.use-case";
import { SkinDiagnosisService } from "./application/services/skin-diagnosis.service";
import { SkinDiagnosisController } from "./presentation/controllers/skin-diagnosis.controller";

export function createSkinDiagnosisModule(): Router {
  const router = Router();

  const skinDiagnosisRepository = new SkinDiagnosisRepositoryMongooseMongo();

  const createDiagnosisUseCase = new CreateDiagnosisUseCase(skinDiagnosisRepository);
  const getDiagnosisByTokenUseCase = new GetDiagnosisByTokenUseCase(skinDiagnosisRepository);

  const skinDiagnosisService = new SkinDiagnosisService(
    createDiagnosisUseCase,
    getDiagnosisByTokenUseCase
  );

  const controller = new SkinDiagnosisController(skinDiagnosisService);

  router.post("/", (req, res, next) => controller.create(req, res, next));
  router.get("/:sessionToken", (req, res, next) => controller.getBySessionToken(req, res, next));

  return router;
}
