import { Router } from "express";
import { IUserRepository } from "../auth/domain/repository/user.repository.interface";
import { JwtServiceSecurity } from "../auth/application/services/security/jwt.service-security";
import { createAuthMiddleware } from "../../shared/middlewares/auth.middleware";
import { GetProfileUseCase } from "./application/use-cases/get-profile/get-profile.use-case";
import { UpdateProfileUseCase } from "./application/use-cases/update-profile/update-profile.use-case";
import { GetAllUsersUseCase } from "./application/use-cases/get-all-users/get-all-users.use-case";
import { UserService } from "./application/services/user.service";
import { UserController } from "./presentation/controllers/user.controller";

export function createUserModule(userRepository: IUserRepository, jwtService: JwtServiceSecurity): Router {
  const router = Router();
  const authMiddleware = createAuthMiddleware(jwtService);

  const getProfileUseCase = new GetProfileUseCase(userRepository);
  const updateProfileUseCase = new UpdateProfileUseCase(userRepository);
  const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);

  const userService = new UserService(getProfileUseCase, updateProfileUseCase, getAllUsersUseCase);
  const controller = new UserController(userService);

  router.get("/profile", authMiddleware, (req, res, next) => controller.getProfile(req, res, next));
  router.patch("/profile", authMiddleware, (req, res, next) => controller.updateProfile(req, res, next));
  router.get("/", authMiddleware, (req, res, next) => controller.getAllUsers(req, res, next));

  return router;
}
