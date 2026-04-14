import { Router } from "express";
import { TestimonialRepositoryMongooseMongo } from "./infrastructure/repository/testimonial.repository.mongoose-mongo";
import { CreateTestimonialUseCase } from "./application/use-cases/create-testimonial/create-testimonial.use-case";
import { GetAllTestimonialsUseCase } from "./application/use-cases/get-all-testimonials/get-all-testimonials.use-case";
import { GetFeaturedTestimonialsUseCase } from "./application/use-cases/get-featured-testimonials/get-featured-testimonials.use-case";
import { UpdateTestimonialUseCase } from "./application/use-cases/update-testimonial/update-testimonial.use-case";
import { DeleteTestimonialUseCase } from "./application/use-cases/delete-testimonial/delete-testimonial.use-case";
import { TestimonialService } from "./application/services/testimonial.service";
import { TestimonialController } from "./presentation/controllers/testimonial.controller";

export function createTestimonialModule(): Router {
  const router = Router();

  const testimonialRepository = new TestimonialRepositoryMongooseMongo();

  const createTestimonialUseCase = new CreateTestimonialUseCase(testimonialRepository);
  const getAllTestimonialsUseCase = new GetAllTestimonialsUseCase(testimonialRepository);
  const getFeaturedTestimonialsUseCase = new GetFeaturedTestimonialsUseCase(testimonialRepository);
  const updateTestimonialUseCase = new UpdateTestimonialUseCase(testimonialRepository);
  const deleteTestimonialUseCase = new DeleteTestimonialUseCase(testimonialRepository);

  const testimonialService = new TestimonialService(
    createTestimonialUseCase,
    getAllTestimonialsUseCase,
    getFeaturedTestimonialsUseCase,
    updateTestimonialUseCase,
    deleteTestimonialUseCase
  );

  const controller = new TestimonialController(testimonialService);

  router.post("/", (req, res, next) => controller.create(req, res, next));
  router.get("/", (req, res, next) => controller.getAll(req, res, next));
  router.get("/featured", (req, res, next) => controller.getFeatured(req, res, next));
  router.patch("/:id", (req, res, next) => controller.update(req, res, next));
  router.delete("/:id", (req, res, next) => controller.delete(req, res, next));

  return router;
}
