import { AppError } from "../../../../shared/middlewares/error-handler.middleware";

export class PressLogoNotFoundError extends AppError {
  constructor() {
    super(404, "Press logo not found");
  }
}
