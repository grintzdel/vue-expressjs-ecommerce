import { PressLogoController } from "./press-logo.controller";
import { PressLogoService } from "../../application/services/press-logo.service";
import { PressLogoEntity } from "../../domain/entity/press-logo.entity";
import { PressLogoNotFoundError } from "../../domain/errors/press-logo.error";
import { Request, Response, NextFunction } from "express";

describe("PressLogoController", () => {
  let controller: PressLogoController;
  let mockService: jest.Mocked<PressLogoService>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  const mockPressLogo = new PressLogoEntity({
    id: "1",
    name: "VOGUE",
    logoUrl: "https://example.com/vogue.png",
    link: "https://vogue.com",
    position: 1,
    createdAt: new Date(),
  });

  beforeEach(() => {
    mockService = {
      createPressLogo: jest.fn(),
      getAllPressLogos: jest.fn(),
      updatePressLogo: jest.fn(),
      deletePressLogo: jest.fn(),
    } as any;

    controller = new PressLogoController(mockService);
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  describe("create", () => {
    it("should return 201 on successful creation", async () => {
      const mockReq = {
        body: { name: "VOGUE", logoUrl: "https://example.com/vogue.png", link: "https://vogue.com", position: 1 },
      } as Request;
      mockService.createPressLogo.mockResolvedValue(mockPressLogo);

      await controller.create(mockReq, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({ name: "VOGUE", position: 1 }),
      });
    });

    it("should call next on error", async () => {
      const mockReq = { body: {} } as Request;
      const error = new Error("fail");
      mockService.createPressLogo.mockRejectedValue(error);

      await controller.create(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("getAll", () => {
    it("should return 200 with all press logos", async () => {
      const mockReq = {} as Request;
      mockService.getAllPressLogos.mockResolvedValue([mockPressLogo]);

      await controller.getAll(mockReq, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.arrayContaining([expect.objectContaining({ name: "VOGUE" })]),
      });
    });

    it("should call next on error", async () => {
      const mockReq = {} as Request;
      const error = new Error("fail");
      mockService.getAllPressLogos.mockRejectedValue(error);

      await controller.getAll(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("update", () => {
    it("should return 200 with updated press logo", async () => {
      const mockReq = { params: { id: "1" }, body: { name: "Updated" } } as unknown as Request;
      mockService.updatePressLogo.mockResolvedValue(mockPressLogo);

      await controller.update(mockReq, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({ name: "VOGUE" }),
      });
    });

    it("should call next with PressLogoNotFoundError when not found", async () => {
      const mockReq = { params: { id: "999" }, body: {} } as unknown as Request;
      const error = new PressLogoNotFoundError();
      mockService.updatePressLogo.mockRejectedValue(error);

      await controller.update(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("delete", () => {
    it("should return 200 on successful delete", async () => {
      const mockReq = { params: { id: "1" } } as unknown as Request;
      mockService.deletePressLogo.mockResolvedValue(undefined);

      await controller.delete(mockReq, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ success: true, data: null });
    });

    it("should call next with PressLogoNotFoundError when not found", async () => {
      const mockReq = { params: { id: "999" } } as unknown as Request;
      const error = new PressLogoNotFoundError();
      mockService.deletePressLogo.mockRejectedValue(error);

      await controller.delete(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
