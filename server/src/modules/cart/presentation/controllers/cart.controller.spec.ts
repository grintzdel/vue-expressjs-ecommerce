import { CartController } from "./cart.controller";
import { CartService } from "../../application/services/cart.service";
import { CartItemEntity } from "../../domain/entity/cart-item.entity";
import { CartItemNotFoundError } from "../../domain/errors/cart.error";
import { Request, Response, NextFunction } from "express";

describe("CartController", () => {
  let controller: CartController;
  let mockService: jest.Mocked<CartService>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  const mockItem = new CartItemEntity({
    id: "item-1",
    sessionId: "session-abc",
    productId: "product-xyz",
    quantity: 2,
    createdAt: new Date(),
  });

  beforeEach(() => {
    mockService = {
      addToCart: jest.fn(),
      getCart: jest.fn(),
      updateCartItem: jest.fn(),
      removeCartItem: jest.fn(),
    } as any;

    controller = new CartController(mockService);
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  describe("addToCart", () => {
    it("should return 201 on successful add", async () => {
      const mockReq = {
        body: { sessionId: "session-abc", productId: "product-xyz", quantity: 2 },
      } as Request;
      mockService.addToCart.mockResolvedValue(mockItem);

      await controller.addToCart(mockReq, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({ sessionId: "session-abc", productId: "product-xyz" }),
      });
    });

    it("should call next on error", async () => {
      const mockReq = { body: {} } as Request;
      const error = new Error("fail");
      mockService.addToCart.mockRejectedValue(error);

      await controller.addToCart(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("getCart", () => {
    it("should return 200 with cart items for session", async () => {
      const mockReq = { params: { sessionId: "session-abc" } } as unknown as Request;
      mockService.getCart.mockResolvedValue([mockItem]);

      await controller.getCart(mockReq, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.arrayContaining([expect.objectContaining({ sessionId: "session-abc" })]),
      });
    });

    it("should call next on error", async () => {
      const mockReq = { params: { sessionId: "session-abc" } } as unknown as Request;
      const error = new Error("fail");
      mockService.getCart.mockRejectedValue(error);

      await controller.getCart(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("updateCartItem", () => {
    it("should return 200 with updated cart item", async () => {
      const mockReq = { params: { id: "item-1" }, body: { quantity: 5 } } as unknown as Request;
      const updatedItem = new CartItemEntity({ id: "item-1", sessionId: "session-abc", productId: "product-xyz", quantity: 5, createdAt: new Date() });
      mockService.updateCartItem.mockResolvedValue(updatedItem);

      await controller.updateCartItem(mockReq, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({ quantity: 5 }),
      });
    });

    it("should call next with CartItemNotFoundError when not found", async () => {
      const mockReq = { params: { id: "nonexistent" }, body: { quantity: 5 } } as unknown as Request;
      const error = new CartItemNotFoundError();
      mockService.updateCartItem.mockRejectedValue(error);

      await controller.updateCartItem(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("removeCartItem", () => {
    it("should return 200 on successful remove", async () => {
      const mockReq = { params: { id: "item-1" } } as unknown as Request;
      mockService.removeCartItem.mockResolvedValue(undefined);

      await controller.removeCartItem(mockReq, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ success: true, data: null });
    });

    it("should call next with CartItemNotFoundError when not found", async () => {
      const mockReq = { params: { id: "nonexistent" } } as unknown as Request;
      const error = new CartItemNotFoundError();
      mockService.removeCartItem.mockRejectedValue(error);

      await controller.removeCartItem(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
