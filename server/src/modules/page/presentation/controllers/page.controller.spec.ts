import { PageController } from "./page.controller";
import { PageService } from "../../application/services/page.service";
import { PageEntity } from "../../domain/entity/page.entity";
import { PageNotFoundError } from "../../domain/errors/page.error";
import { Request, Response, NextFunction } from "express";

describe("PageController", () => {
  let controller: PageController;
  let mockService: jest.Mocked<PageService>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  const mockPage = new PageEntity({
    id: "1",
    title: "About Us",
    slug: "about-us",
    content: "Welcome to our company",
    seoMeta: { title: "About | Site", description: "About page" },
    isPublished: true,
    createdAt: new Date(),
  });

  beforeEach(() => {
    mockService = {
      createPage: jest.fn(),
      getAllPages: jest.fn(),
      getPageBySlug: jest.fn(),
      updatePage: jest.fn(),
      deletePage: jest.fn(),
    } as any;

    controller = new PageController(mockService);
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
          title: "About Us",
          slug: "about-us",
          content: "Welcome",
          seoMeta: { title: "About | Site", description: "About page" },
          isPublished: true,
        },
      } as Request;
      mockService.createPage.mockResolvedValue(mockPage);

      await controller.create(mockReq, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({ slug: "about-us" }),
      });
    });

    it("should call next on error", async () => {
      const mockReq = { body: {} } as Request;
      const error = new Error("fail");
      mockService.createPage.mockRejectedValue(error);

      await controller.create(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("getAll", () => {
    it("should return 200 with all pages", async () => {
      const mockReq = {} as Request;
      mockService.getAllPages.mockResolvedValue([mockPage]);

      await controller.getAll(mockReq, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.arrayContaining([expect.objectContaining({ slug: "about-us" })]),
      });
    });
  });

  describe("getBySlug", () => {
    it("should return 200 with page by slug", async () => {
      const mockReq = { params: { slug: "about-us" } } as unknown as Request;
      mockService.getPageBySlug.mockResolvedValue(mockPage);

      await controller.getBySlug(mockReq, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({ slug: "about-us" }),
      });
    });

    it("should call next with PageNotFoundError when not found", async () => {
      const mockReq = { params: { slug: "unknown" } } as unknown as Request;
      const error = new PageNotFoundError();
      mockService.getPageBySlug.mockRejectedValue(error);

      await controller.getBySlug(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("update", () => {
    it("should return 200 with updated page", async () => {
      const mockReq = { params: { id: "1" }, body: { title: "Updated" } } as unknown as Request;
      mockService.updatePage.mockResolvedValue(mockPage);

      await controller.update(mockReq, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it("should call next on error", async () => {
      const mockReq = { params: { id: "999" }, body: {} } as unknown as Request;
      const error = new PageNotFoundError();
      mockService.updatePage.mockRejectedValue(error);

      await controller.update(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("delete", () => {
    it("should return 200 on successful delete", async () => {
      const mockReq = { params: { id: "1" } } as unknown as Request;
      mockService.deletePage.mockResolvedValue(undefined);

      await controller.delete(mockReq, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ success: true, data: null });
    });

    it("should call next on error", async () => {
      const mockReq = { params: { id: "999" } } as unknown as Request;
      const error = new PageNotFoundError();
      mockService.deletePage.mockRejectedValue(error);

      await controller.delete(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
