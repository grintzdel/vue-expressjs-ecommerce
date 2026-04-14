import { AppError } from "../../../../shared/middlewares/error-handler.middleware";

export class AlreadySubscribedError extends AppError {
  constructor() {
    super(409, "Email is already subscribed to the newsletter");
  }
}

export class SubscriptionNotFoundError extends AppError {
  constructor() {
    super(404, "Newsletter subscription not found");
  }
}
