import { AppError } from "../../../../shared/middlewares/error-handler.middleware";

export class TagNotFoundError extends AppError {
  constructor() {
    super(404, "Tag not found");
  }
}

export class TagAlreadyExistsError extends AppError {
  constructor() {
    super(409, "Tag already exists");
  }
}
