import { AppError } from "../../../../shared/middlewares/error-handler.middleware";

export class DiagnosisNotFoundError extends AppError {
  constructor() {
    super(404, "Diagnosis not found");
  }
}
