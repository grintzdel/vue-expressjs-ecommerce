import { GetAllProductsUseCase } from "./get-all-products.use-case";
import { IProductRepository } from "../../../domain/repository/product.repository.interface";
import { ProductEntity } from "../../../domain/entity/product.entity";

describe("GetAllProductsUseCase", () => {
  let useCase: GetAllProductsUseCase;
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
    useCase = new GetAllProductsUseCase(mockRepo);
  });

  it("should return all products", async () => {
    mockRepo.findAll.mockResolvedValue([mockProduct]);

    const result = await useCase.execute();

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(mockProduct);
    expect(mockRepo.findAll).toHaveBeenCalled();
  });

  it("should return empty array when no products", async () => {
    mockRepo.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toHaveLength(0);
  });
});
