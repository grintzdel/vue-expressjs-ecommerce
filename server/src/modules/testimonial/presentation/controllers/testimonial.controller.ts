import { Request, Response, NextFunction } from "express";
import { TestimonialService } from "../../application/services/testimonial.service";
import { CreateTestimonialRequestDto } from "../dto/create-testimonial.request.dto";
import { UpdateTestimonialRequestDto } from "../dto/update-testimonial.request.dto";
import { TestimonialResponseDto } from "../dto/testimonial.response.dto";

export class TestimonialController {
  constructor(private readonly testimonialService: TestimonialService) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = new CreateTestimonialRequestDto(req.body);
      const testimonial = await this.testimonialService.createTestimonial(dto);
      const response = new TestimonialResponseDto(testimonial);
      res.status(201).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const testimonials = await this.testimonialService.getAllTestimonials();
      const response = testimonials.map((t) => new TestimonialResponseDto(t));
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async getFeatured(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const testimonials = await this.testimonialService.getFeaturedTestimonials();
      const response = testimonials.map((t) => new TestimonialResponseDto(t));
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params["id"] as string;
      const dto = new UpdateTestimonialRequestDto(req.body);
      const testimonial = await this.testimonialService.updateTestimonial(id, dto);
      const response = new TestimonialResponseDto(testimonial);
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params["id"] as string;
      await this.testimonialService.deleteTestimonial(id);
      res.status(200).json({ success: true, data: null });
    } catch (error) {
      next(error);
    }
  }
}
