import { AppError } from "../../../../shared/middlewares/error-handler.middleware";

export class TestimonialNotFoundError extends AppError {
  constructor() {
    super(404, "Testimonial not found");
  }
}
