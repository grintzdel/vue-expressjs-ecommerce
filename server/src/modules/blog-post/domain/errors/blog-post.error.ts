import { AppError } from "../../../../shared/middlewares/error-handler.middleware";

export class BlogPostNotFoundError extends AppError {
  constructor() {
    super(404, "Blog post not found");
  }
}

export class BlogPostAlreadyExistsError extends AppError {
  constructor() {
    super(409, "Blog post already exists");
  }
}
