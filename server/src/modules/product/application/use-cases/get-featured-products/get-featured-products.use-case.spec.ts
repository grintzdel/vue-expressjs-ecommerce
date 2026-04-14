import { GetFeaturedProductsUseCase } from "./get-featured-products.use-case";
import { IProductRepository } from "../../../domain/repository/product.repository.interface";
import { ProductEntity } from "../../../domain/entity/product.entity";

describe("GetFeaturedProductsUseCase", () => {
  let useCase: GetFeaturedProductsUseCase;
  let mockRepo: jest.Mocked<IProductRepository>;

  const mockFeaturedProduct = new ProductEntity({
    id: "1",
    name: "Featured Serum",
    slug: "featured-serum",
    description: "Desc",
    price: 49.99,
    currency: "EUR",
    images: [],
    categoryId: "cat-1",
    tagIds: [],
    skinTypeIds: [],
    rating: 5,
    stockQuantity: 50,
    isFeatured: true,
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
    useCase = new GetFeaturedProductsUseCase(mockRepo);
  });

  it("should return featured products", async () => {
    mockRepo.findFeatured.mockResolvedValue([mockFeaturedProduct]);

    const result = await useCase.execute();

    expect(result).toHaveLength(1);
    expect(result[0]!.isFeatured).toBe(true);
    expect(mockRepo.findFeatured).toHaveBeenCalled();
  });

  it("should return empty array when no featured products", async () => {
    mockRepo.findFeatured.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toHaveLength(0);
  });
});
