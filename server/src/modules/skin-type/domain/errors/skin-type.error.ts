import { AppError } from "../../../../shared/middlewares/error-handler.middleware";

export class SkinTypeNotFoundError extends AppError {
  constructor() {
    super(404, "Skin type not found");
  }
}

export class SkinTypeAlreadyExistsError extends AppError {
  constructor() {
    super(409, "Skin type already exists");
  }
}
