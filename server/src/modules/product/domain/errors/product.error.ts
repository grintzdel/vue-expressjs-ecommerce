import { AppError } from "../../../../shared/middlewares/error-handler.middleware";

export class ProductNotFoundError extends AppError {
  constructor() {
    super(404, "Product not found");
  }
}

export class ProductAlreadyExistsError extends AppError {
  constructor() {
    super(409, "Product already exists");
  }
}
