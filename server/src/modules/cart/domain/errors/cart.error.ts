import { AppError } from "../../../../shared/middlewares/error-handler.middleware";

export class CartItemNotFoundError extends AppError {
  constructor() {
    super(404, "Cart item not found");
  }
}
