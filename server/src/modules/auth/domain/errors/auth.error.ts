import { AppError } from "../../../../shared/middlewares/error-handler.middleware";

export class UserAlreadyExistsError extends AppError {
  constructor() {
    super(409, "User already exists");
  }
}

export class InvalidCredentialsError extends AppError {
  constructor() {
    super(401, "Invalid credentials");
  }
}

export class UserNotFoundError extends AppError {
  constructor() {
    super(404, "User not found");
  }
}
