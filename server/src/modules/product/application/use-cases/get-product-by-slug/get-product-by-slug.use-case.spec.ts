import { GetProductBySlugUseCase } from "./get-product-by-slug.use-case";
import { IProductRepository } from "../../../domain/repository/product.repository.interface";
import { ProductNotFoundError } from "../../../domain/errors/product.error";
import { ProductEntity } from "../../../domain/entity/product.entity";

describe("GetProductBySlugUseCase", () => {
  let useCase: GetProductBySlugUseCase;
  let mockRepo: jest.Mocked<IProductRepository>;

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

  beforeEach(() => {
    mockRepo = {
      findAll: jest.fn(),
      findBySlug: jest.fn(),
      findById: jest.fn(),
      findByCategory: jest.fn(),
      findFeatured: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new GetProductBySlugUseCase(mockRepo);
  });

  it("should return product when found by slug", async () => {
    mockRepo.findBySlug.mockResolvedValue(mockProduct);

    const result = await useCase.execute("hydrating-serum");

    expect(result).toEqual(mockProduct);
    expect(mockRepo.findBySlug).toHaveBeenCalledWith("hydrating-serum");
  });

  it("should throw ProductNotFoundError when slug not found", async () => {
    mockRepo.findBySlug.mockResolvedValue(null);

    await expect(useCase.execute("unknown-slug")).rejects.toThrow(ProductNotFoundError);
  });
});
