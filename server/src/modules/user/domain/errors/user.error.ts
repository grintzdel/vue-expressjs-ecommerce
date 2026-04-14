import { AppError } from "../../../../shared/middlewares/error-handler.middleware";

export class ProfileNotFoundError extends AppError {
  constructor() {
    super(404, "User profile not found");
  }
}
