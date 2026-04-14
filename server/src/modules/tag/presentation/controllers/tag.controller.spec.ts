import { TagController } from "./tag.controller";
import { TagService } from "../../application/services/tag.service";
import { TagEntity } from "../../domain/entity/tag.entity";
import { TagNotFoundError } from "../../domain/errors/tag.error";
import { Request, Response, NextFunction } from "express";

describe("TagController", () => {
  let controller: TagController;
  let mockService: jest.Mocked<TagService>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  const sampleTag = new TagEntity({ id: "1", name: "Hydrate", slug: "hydrate", createdAt: new Date("2024-01-01") });

  beforeEach(() => {
    mockService = {
      createTag: jest.fn(),
      getAllTags: jest.fn(),
      getTagBySlug: jest.fn(),
      updateTag: jest.fn(),
      deleteTag: jest.fn(),
    } as any;
    controller = new TagController(mockService);
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  describe("create", () => {
    it("should return 201 on successful creation", async () => {
      const mockReq = { body: { name: "Hydrate", slug: "hydrate" } } as Partial<Request>;
      mockService.createTag.mockResolvedValue(sampleTag);

      await controller.create(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({ name: "Hydrate", slug: "hydrate" }),
      });
    });

    it("should call next on error", async () => {
      const mockReq = { body: { name: "Hydrate", slug: "hydrate" } } as Partial<Request>;
      const error = new Error("fail");
      mockService.createTag.mockRejectedValue(error);

      await controller.create(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("getAll", () => {
    it("should return 200 with list of tags", async () => {
      const mockReq = {} as Partial<Request>;
      mockService.getAllTags.mockResolvedValue([sampleTag]);

      await controller.getAll(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.arrayContaining([expect.objectContaining({ name: "Hydrate" })]),
      });
    });

    it("should call next on error", async () => {
      const mockReq = {} as Partial<Request>;
      mockService.getAllTags.mockRejectedValue(new Error("fail"));

      await controller.getAll(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("getBySlug", () => {
    it("should return 200 with tag", async () => {
      const mockReq = { params: { slug: "hydrate" } } as Partial<Request>;
      mockService.getTagBySlug.mockResolvedValue(sampleTag);

      await controller.getBySlug(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({ slug: "hydrate" }),
      });
    });

    it("should call next with TagNotFoundError when not found", async () => {
      const mockReq = { params: { slug: "unknown" } } as Partial<Request>;
      const error = new TagNotFoundError();
      mockService.getTagBySlug.mockRejectedValue(error);

      await controller.getBySlug(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("update", () => {
    it("should return 200 with updated tag", async () => {
      const mockReq = { params: { id: "1" }, body: { name: "Protect" } } as Partial<Request>;
      const updated = new TagEntity({ id: "1", name: "Protect", slug: "hydrate", createdAt: new Date("2024-01-01") });
      mockService.updateTag.mockResolvedValue(updated);

      await controller.update(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({ name: "Protect" }),
      });
    });

    it("should call next on error", async () => {
      const mockReq = { params: { id: "999" }, body: { name: "X" } } as Partial<Request>;
      mockService.updateTag.mockRejectedValue(new TagNotFoundError());

      await controller.update(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("should return 200 on successful delete", async () => {
      const mockReq = { params: { id: "1" } } as Partial<Request>;
      mockService.deleteTag.mockResolvedValue(undefined);

      await controller.delete(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ success: true, data: null });
    });

    it("should call next with TagNotFoundError when not found", async () => {
      const mockReq = { params: { id: "999" } } as Partial<Request>;
      const error = new TagNotFoundError();
      mockService.deleteTag.mockRejectedValue(error);

      await controller.delete(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
