import { GetProductsByCategoryUseCase } from "./get-products-by-category.use-case";
import { IProductRepository } from "../../../domain/repository/product.repository.interface";
import { ProductEntity } from "../../../domain/entity/product.entity";

describe("GetProductsByCategoryUseCase", () => {
  let useCase: GetProductsByCategoryUseCase;
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
    useCase = new GetProductsByCategoryUseCase(mockRepo);
  });

  it("should return products for given category", async () => {
    mockRepo.findByCategory.mockResolvedValue([mockProduct]);

    const result = await useCase.execute("cat-1");

    expect(result).toHaveLength(1);
    expect(result[0]!.categoryId).toBe("cat-1");
    expect(mockRepo.findByCategory).toHaveBeenCalledWith("cat-1");
  });

  it("should return empty array for category with no products", async () => {
    mockRepo.findByCategory.mockResolvedValue([]);

    const result = await useCase.execute("cat-99");

    expect(result).toHaveLength(0);
  });
});
