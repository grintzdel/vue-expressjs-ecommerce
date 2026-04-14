import { ProductController } from "./product.controller";
import { ProductService } from "../../application/services/product.service";
import { ProductEntity } from "../../domain/entity/product.entity";
import { ProductNotFoundError } from "../../domain/errors/product.error";
import { Request, Response, NextFunction } from "express";

describe("ProductController", () => {
  let controller: ProductController;
  let mockService: jest.Mocked<ProductService>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  const mockProduct = new ProductEntity({
    id: "1",
    name: "Hydrating Serum",
    slug: "hydrating-serum",
    description: "A deeply hydrating serum",
    price: 29.99,
    currency: "EUR",
    images: [],
    categoryId: "cat-1",
    tagIds: [],
    skinTypeIds: [],
    rating: 0,
    stockQuantity: 100,
    isFeatured: false,
    ingredients: "",
    howToUse: "",
    shippingInfo: "",
    createdAt: new Date(),
  });

  beforeEach(() => {
    mockService = {
      createProduct: jest.fn(),
      getAllProducts: jest.fn(),
      getProductBySlug: jest.fn(),
      getProductsByCategory: jest.fn(),
      getFeaturedProducts: jest.fn(),
      updateProduct: jest.fn(),
      deleteProduct: jest.fn(),
    } as any;

    controller = new ProductController(mockService);
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
          name: "Hydrating Serum",
          slug: "hydrating-serum",
          description: "Desc",
          price: 29.99,
          currency: "EUR",
          images: [],
          categoryId: "cat-1",
          tagIds: [],
          skinTypeIds: [],
          stockQuantity: 100,
        },
      } as Request;
      mockService.createProduct.mockResolvedValue(mockProduct);

      await controller.create(mockReq, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({ slug: "hydrating-serum" }),
      });
    });

    it("should call next on error", async () => {
      const mockReq = { body: {} } as Request;
      const error = new Error("fail");
      mockService.createProduct.mockRejectedValue(error);

      await controller.create(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("getAll", () => {
    it("should return 200 with all products", async () => {
      const mockReq = {} as Request;
      mockService.getAllProducts.mockResolvedValue([mockProduct]);

      await controller.getAll(mockReq, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.arrayContaining([expect.objectContaining({ slug: "hydrating-serum" })]),
      });
    });
  });

  describe("getBySlug", () => {
    it("should return 200 with product by slug", async () => {
      const mockReq = { params: { slug: "hydrating-serum" } } as unknown as Request;
      mockService.getProductBySlug.mockResolvedValue(mockProduct);

      await controller.getBySlug(mockReq, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({ slug: "hydrating-serum" }),
      });
    });

    it("should call next with ProductNotFoundError when not found", async () => {
      const mockReq = { params: { slug: "unknown" } } as unknown as Request;
      const error = new ProductNotFoundError();
      mockService.getProductBySlug.mockRejectedValue(error);

      await controller.getBySlug(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("getByCategory", () => {
    it("should return 200 with products by category", async () => {
      const mockReq = { params: { categoryId: "cat-1" } } as unknown as Request;
      mockService.getProductsByCategory.mockResolvedValue([mockProduct]);

      await controller.getByCategory(mockReq, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.arrayContaining([expect.objectContaining({ categoryId: "cat-1" })]),
      });
    });
  });

  describe("getFeatured", () => {
    it("should return 200 with featured products", async () => {
      const mockReq = {} as Request;
      mockService.getFeaturedProducts.mockResolvedValue([mockProduct]);

      await controller.getFeatured(mockReq, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.arrayContaining([expect.objectContaining({ slug: "hydrating-serum" })]),
      });
    });
  });

  describe("update", () => {
    it("should return 200 with updated product", async () => {
      const mockReq = { params: { id: "1" }, body: { name: "Updated" } } as unknown as Request;
      mockService.updateProduct.mockResolvedValue(mockProduct);

      await controller.update(mockReq, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it("should call next on error", async () => {
      const mockReq = { params: { id: "999" }, body: {} } as unknown as Request;
      const error = new ProductNotFoundError();
      mockService.updateProduct.mockRejectedValue(error);

      await controller.update(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("delete", () => {
    it("should return 200 on successful delete", async () => {
      const mockReq = { params: { id: "1" } } as unknown as Request;
      mockService.deleteProduct.mockResolvedValue(undefined);

      await controller.delete(mockReq, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ success: true, data: null });
    });

    it("should call next on error", async () => {
      const mockReq = { params: { id: "999" } } as unknown as Request;
      const error = new ProductNotFoundError();
      mockService.deleteProduct.mockRejectedValue(error);

      await controller.delete(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
