import { AppError } from "../../../../shared/middlewares/error-handler.middleware";

export class CategoryNotFoundError extends AppError {
  constructor() {
    super(404, "Category not found");
  }
}

export class CategoryAlreadyExistsError extends AppError {
  constructor() {
    super(409, "Category already exists");
  }
}
