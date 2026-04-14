import { ProductService } from "./product.service";
import { CreateProductUseCase } from "../use-cases/create-product/create-product.use-case";
import { GetAllProductsUseCase } from "../use-cases/get-all-products/get-all-products.use-case";
import { GetProductBySlugUseCase } from "../use-cases/get-product-by-slug/get-product-by-slug.use-case";
import { GetProductsByCategoryUseCase } from "../use-cases/get-products-by-category/get-products-by-category.use-case";
import { GetFeaturedProductsUseCase } from "../use-cases/get-featured-products/get-featured-products.use-case";
import { UpdateProductUseCase } from "../use-cases/update-product/update-product.use-case";
import { DeleteProductUseCase } from "../use-cases/delete-product/delete-product.use-case";
import { ProductEntity } from "../../domain/entity/product.entity";

describe("ProductService", () => {
  let service: ProductService;
  let mockCreate: jest.Mocked<CreateProductUseCase>;
  let mockGetAll: jest.Mocked<GetAllProductsUseCase>;
  let mockGetBySlug: jest.Mocked<GetProductBySlugUseCase>;
  let mockGetByCategory: jest.Mocked<GetProductsByCategoryUseCase>;
  let mockGetFeatured: jest.Mocked<GetFeaturedProductsUseCase>;
  let mockUpdate: jest.Mocked<UpdateProductUseCase>;
  let mockDelete: jest.Mocked<DeleteProductUseCase>;

  const mockProduct = new ProductEntity({
    id: "1",
    name: "Hydrating Serum",
    slug: "hydrating-serum",
    description: "Desc",
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

  const createInput = {
    name: "Hydrating Serum",
    slug: "hydrating-serum",
    description: "Desc",
    price: 29.99,
    currency: "EUR",
    images: [] as any[],
    categoryId: "cat-1",
    tagIds: [] as string[],
    skinTypeIds: [] as string[],
    rating: 0,
    stockQuantity: 100,
    isFeatured: false,
    ingredients: "",
    howToUse: "",
    shippingInfo: "",
  };

  beforeEach(() => {
    mockCreate = { execute: jest.fn() } as any;
    mockGetAll = { execute: jest.fn() } as any;
    mockGetBySlug = { execute: jest.fn() } as any;
    mockGetByCategory = { execute: jest.fn() } as any;
    mockGetFeatured = { execute: jest.fn() } as any;
    mockUpdate = { execute: jest.fn() } as any;
    mockDelete = { execute: jest.fn() } as any;

    service = new ProductService(
      mockCreate,
      mockGetAll,
      mockGetBySlug,
      mockGetByCategory,
      mockGetFeatured,
      mockUpdate,
      mockDelete
    );
  });

  it("should delegate createProduct to CreateProductUseCase", async () => {
    mockCreate.execute.mockResolvedValue(mockProduct);

    const result = await service.createProduct(createInput);

    expect(result).toEqual(mockProduct);
    expect(mockCreate.execute).toHaveBeenCalledWith(createInput);
  });

  it("should delegate getAllProducts to GetAllProductsUseCase", async () => {
    mockGetAll.execute.mockResolvedValue([mockProduct]);

    const result = await service.getAllProducts();

    expect(result).toHaveLength(1);
    expect(mockGetAll.execute).toHaveBeenCalled();
  });

  it("should delegate getProductBySlug to GetProductBySlugUseCase", async () => {
    mockGetBySlug.execute.mockResolvedValue(mockProduct);

    const result = await service.getProductBySlug("hydrating-serum");

    expect(result).toEqual(mockProduct);
    expect(mockGetBySlug.execute).toHaveBeenCalledWith("hydrating-serum");
  });

  it("should delegate getProductsByCategory to GetProductsByCategoryUseCase", async () => {
    mockGetByCategory.execute.mockResolvedValue([mockProduct]);

    const result = await service.getProductsByCategory("cat-1");

    expect(result).toHaveLength(1);
    expect(mockGetByCategory.execute).toHaveBeenCalledWith("cat-1");
  });

  it("should delegate getFeaturedProducts to GetFeaturedProductsUseCase", async () => {
    mockGetFeatured.execute.mockResolvedValue([mockProduct]);

    const result = await service.getFeaturedProducts();

    expect(result).toHaveLength(1);
    expect(mockGetFeatured.execute).toHaveBeenCalled();
  });

  it("should delegate updateProduct to UpdateProductUseCase", async () => {
    mockUpdate.execute.mockResolvedValue(mockProduct);

    const result = await service.updateProduct("1", { name: "Updated" });

    expect(result).toEqual(mockProduct);
    expect(mockUpdate.execute).toHaveBeenCalledWith("1", { name: "Updated" });
  });

  it("should delegate deleteProduct to DeleteProductUseCase", async () => {
    mockDelete.execute.mockResolvedValue(undefined);

    await service.deleteProduct("1");

    expect(mockDelete.execute).toHaveBeenCalledWith("1");
  });
});
