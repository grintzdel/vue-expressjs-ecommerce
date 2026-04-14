import { AppError } from "../../../../shared/middlewares/error-handler.middleware";

export class PageNotFoundError extends AppError {
  constructor() {
    super(404, "Page not found");
  }
}

export class PageAlreadyExistsError extends AppError {
  constructor() {
    super(409, "Page already exists");
  }
}
