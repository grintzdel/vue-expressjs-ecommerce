import { AppError } from "../../../../shared/middlewares/error-handler.middleware";

export class OrderNotFoundError extends AppError {
  constructor() {
    super(404, "Order not found");
  }
}
