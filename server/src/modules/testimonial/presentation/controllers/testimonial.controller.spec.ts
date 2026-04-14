import { TestimonialController } from "./testimonial.controller";
import { TestimonialService } from "../../application/services/testimonial.service";
import { TestimonialEntity } from "../../domain/entity/testimonial.entity";
import { TestimonialNotFoundError } from "../../domain/errors/testimonial.error";
import { Request, Response, NextFunction } from "express";

describe("TestimonialController", () => {
  let controller: TestimonialController;
  let mockService: jest.Mocked<TestimonialService>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  const mockTestimonial = new TestimonialEntity({
    id: "1",
    authorName: "Jane Doe",
    content: "Great product!",
    rating: 5,
    featuredProductIds: ["prod-1"],
    isFeatured: false,
    createdAt: new Date(),
  });

  const mockFeaturedTestimonial = new TestimonialEntity({
    id: "2",
    authorName: "John Smith",
    content: "Excellent!",
    rating: 5,
    featuredProductIds: ["prod-2"],
    isFeatured: true,
    createdAt: new Date(),
  });

  beforeEach(() => {
    mockService = {
      createTestimonial: jest.fn(),
      getAllTestimonials: jest.fn(),
      getFeaturedTestimonials: jest.fn(),
      updateTestimonial: jest.fn(),
      deleteTestimonial: jest.fn(),
    } as any;

    controller = new TestimonialController(mockService);
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  describe("create", () => {
    it("should return 201 on successful creation", async () => {
      const mockReq = {
        body: {
          authorName: "Jane Doe",
          content: "Great product!",
          rating: 5,
          featuredProductIds: ["prod-1"],
          isFeatured: false,
        },
      } as Request;
      mockService.createTestimonial.mockResolvedValue(mockTestimonial);

      await controller.create(mockReq, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({ authorName: "Jane Doe", rating: 5 }),
      });
    });

    it("should call next on error", async () => {
      const mockReq = { body: {} } as Request;
      const error = new Error("fail");
      mockService.createTestimonial.mockRejectedValue(error);

      await controller.create(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("getAll", () => {
    it("should return 200 with all testimonials", async () => {
      const mockReq = {} as Request;
      mockService.getAllTestimonials.mockResolvedValue([mockTestimonial]);

      await controller.getAll(mockReq, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.arrayContaining([expect.objectContaining({ authorName: "Jane Doe" })]),
      });
    });

    it("should call next on error", async () => {
      const mockReq = {} as Request;
      mockService.getAllTestimonials.mockRejectedValue(new Error("fail"));

      await controller.getAll(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("getFeatured", () => {
    it("should return 200 with featured testimonials", async () => {
      const mockReq = {} as Request;
      mockService.getFeaturedTestimonials.mockResolvedValue([mockFeaturedTestimonial]);

      await controller.getFeatured(mockReq, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.arrayContaining([expect.objectContaining({ isFeatured: true })]),
      });
    });

    it("should call next on error", async () => {
      const mockReq = {} as Request;
      mockService.getFeaturedTestimonials.mockRejectedValue(new Error("fail"));

      await controller.getFeatured(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("should return 200 with updated testimonial", async () => {
      const mockReq = { params: { id: "1" }, body: { authorName: "Updated" } } as unknown as Request;
      mockService.updateTestimonial.mockResolvedValue(mockTestimonial);

      await controller.update(mockReq, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it("should call next on error", async () => {
      const mockReq = { params: { id: "999" }, body: {} } as unknown as Request;
      const error = new TestimonialNotFoundError();
      mockService.updateTestimonial.mockRejectedValue(error);

      await controller.update(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("delete", () => {
    it("should return 200 on successful delete", async () => {
      const mockReq = { params: { id: "1" } } as unknown as Request;
      mockService.deleteTestimonial.mockResolvedValue(undefined);

      await controller.delete(mockReq, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ success: true, data: null });
    });

    it("should call next on error", async () => {
      const mockReq = { params: { id: "999" } } as unknown as Request;
      const error = new TestimonialNotFoundError();
      mockService.deleteTestimonial.mockRejectedValue(error);

      await controller.delete(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
