import { CategoryController } from "./category.controller";
import { CategoryService } from "../../application/services/category.service";
import { CategoryEntity } from "../../domain/entity/category.entity";
import { CategoryNotFoundError } from "../../domain/errors/category.error";
import { Request, Response, NextFunction } from "express";

describe("CategoryController", () => {
  let controller: CategoryController;
  let mockService: jest.Mocked<CategoryService>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  const mockCategory = new CategoryEntity({
    id: "1",
    name: "Skincare",
    slug: "skincare",
    description: "All skincare products",
    createdAt: new Date(),
  });

  beforeEach(() => {
    mockService = {
      createCategory: jest.fn(),
      getAllCategories: jest.fn(),
      getCategoryBySlug: jest.fn(),
      updateCategory: jest.fn(),
      deleteCategory: jest.fn(),
    } as any;

    controller = new CategoryController(mockService);
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  describe("create", () => {
    it("should return 201 on successful creation", async () => {
      const mockReq = { body: { name: "Skincare", slug: "skincare", description: "Desc" } } as Request;
      mockService.createCategory.mockResolvedValue(mockCategory);

      await controller.create(mockReq, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({ slug: "skincare" }),
      });
    });

    it("should call next on error", async () => {
      const mockReq = { body: {} } as Request;
      const error = new Error("fail");
      mockService.createCategory.mockRejectedValue(error);

      await controller.create(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("getAll", () => {
    it("should return 200 with all categories", async () => {
      const mockReq = {} as Request;
      mockService.getAllCategories.mockResolvedValue([mockCategory]);

      await controller.getAll(mockReq, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.arrayContaining([expect.objectContaining({ slug: "skincare" })]),
      });
    });
  });

  describe("getBySlug", () => {
    it("should return 200 with category by slug", async () => {
      const mockReq = { params: { slug: "skincare" } } as unknown as Request;
      mockService.getCategoryBySlug.mockResolvedValue(mockCategory);

      await controller.getBySlug(mockReq, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({ slug: "skincare" }),
      });
    });

    it("should call next with CategoryNotFoundError when not found", async () => {
      const mockReq = { params: { slug: "unknown" } } as unknown as Request;
      const error = new CategoryNotFoundError();
      mockService.getCategoryBySlug.mockRejectedValue(error);

      await controller.getBySlug(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("update", () => {
    it("should return 200 with updated category", async () => {
      const mockReq = { params: { id: "1" }, body: { name: "Updated" } } as unknown as Request;
      mockService.updateCategory.mockResolvedValue(mockCategory);

      await controller.update(mockReq, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it("should call next on error", async () => {
      const mockReq = { params: { id: "999" }, body: {} } as unknown as Request;
      const error = new CategoryNotFoundError();
      mockService.updateCategory.mockRejectedValue(error);

      await controller.update(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("delete", () => {
    it("should return 200 on successful delete", async () => {
      const mockReq = { params: { id: "1" } } as unknown as Request;
      mockService.deleteCategory.mockResolvedValue(undefined);

      await controller.delete(mockReq, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ success: true, data: null });
    });

    it("should call next on error", async () => {
      const mockReq = { params: { id: "999" } } as unknown as Request;
      const error = new CategoryNotFoundError();
      mockService.deleteCategory.mockRejectedValue(error);

      await controller.delete(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
