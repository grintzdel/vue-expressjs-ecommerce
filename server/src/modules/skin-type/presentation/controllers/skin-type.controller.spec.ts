import { SkinTypeController } from "./skin-type.controller";
import { SkinTypeService } from "../../application/services/skin-type.service";
import { SkinTypeEntity } from "../../domain/entity/skin-type.entity";
import { SkinTypeNotFoundError, SkinTypeAlreadyExistsError } from "../../domain/errors/skin-type.error";
import { Request, Response, NextFunction } from "express";

describe("SkinTypeController", () => {
  let controller: SkinTypeController;
  let mockService: jest.Mocked<SkinTypeService>;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  const entity = new SkinTypeEntity({ id: "1", name: "Oily", slug: "oily", createdAt: new Date("2024-01-01") });

  beforeEach(() => {
    mockService = {
      create: jest.fn(),
      getAll: jest.fn(),
      getBySlug: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;
    controller = new SkinTypeController(mockService);
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  describe("create", () => {
    it("should return 201 with created skin type", async () => {
      mockReq = { body: { name: "Oily", slug: "oily" } };
      mockService.create.mockResolvedValue(entity);

      await controller.create(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({ id: "1", name: "Oily", slug: "oily" }),
      });
    });

    it("should call next on SkinTypeAlreadyExistsError", async () => {
      mockReq = { body: { name: "Oily", slug: "oily" } };
      const error = new SkinTypeAlreadyExistsError();
      mockService.create.mockRejectedValue(error);

      await controller.create(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("getAll", () => {
    it("should return 200 with all skin types", async () => {
      mockReq = {};
      mockService.getAll.mockResolvedValue([entity]);

      await controller.getAll(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.arrayContaining([expect.objectContaining({ id: "1" })]),
      });
    });

    it("should call next on error", async () => {
      mockReq = {};
      const error = new Error("fail");
      mockService.getAll.mockRejectedValue(error);

      await controller.getAll(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("getBySlug", () => {
    it("should return 200 with skin type when found", async () => {
      mockReq = { params: { slug: "oily" } };
      mockService.getBySlug.mockResolvedValue(entity);

      await controller.getBySlug(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({ slug: "oily" }),
      });
    });

    it("should call next on SkinTypeNotFoundError", async () => {
      mockReq = { params: { slug: "unknown" } };
      const error = new SkinTypeNotFoundError();
      mockService.getBySlug.mockRejectedValue(error);

      await controller.getBySlug(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("update", () => {
    it("should return 200 with updated skin type", async () => {
      mockReq = { params: { id: "1" }, body: { name: "Very Oily" } };
      const updatedEntity = new SkinTypeEntity({ id: "1", name: "Very Oily", slug: "oily", createdAt: new Date() });
      mockService.update.mockResolvedValue(updatedEntity);

      await controller.update(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({ name: "Very Oily" }),
      });
    });

    it("should call next on SkinTypeNotFoundError", async () => {
      mockReq = { params: { id: "nonexistent" }, body: { name: "X" } };
      const error = new SkinTypeNotFoundError();
      mockService.update.mockRejectedValue(error);

      await controller.update(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("delete", () => {
    it("should return 200 with null data on successful delete", async () => {
      mockReq = { params: { id: "1" } };
      mockService.delete.mockResolvedValue(undefined);

      await controller.delete(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ success: true, data: null });
    });

    it("should call next on SkinTypeNotFoundError", async () => {
      mockReq = { params: { id: "nonexistent" } };
      const error = new SkinTypeNotFoundError();
      mockService.delete.mockRejectedValue(error);

      await controller.delete(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
