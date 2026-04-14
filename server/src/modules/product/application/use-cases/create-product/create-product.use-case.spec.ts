import { CreateProductUseCase } from "./create-product.use-case";
import { IProductRepository } from "../../../domain/repository/product.repository.interface";
import { ProductAlreadyExistsError } from "../../../domain/errors/product.error";
import { ProductEntity } from "../../../domain/entity/product.entity";

describe("CreateProductUseCase", () => {
  let useCase: CreateProductUseCase;
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

  const input = {
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
    useCase = new CreateProductUseCase(mockRepo);
  });

  it("should create a product when slug is unique", async () => {
    mockRepo.findBySlug.mockResolvedValue(null);
    mockRepo.create.mockResolvedValue(mockProduct);

    const result = await useCase.execute(input);

    expect(result).toEqual(mockProduct);
    expect(mockRepo.findBySlug).toHaveBeenCalledWith("hydrating-serum");
    expect(mockRepo.create).toHaveBeenCalledWith(input);
  });

  it("should throw ProductAlreadyExistsError when slug is taken", async () => {
    mockRepo.findBySlug.mockResolvedValue(mockProduct);

    await expect(useCase.execute(input)).rejects.toThrow(ProductAlreadyExistsError);

    expect(mockRepo.create).not.toHaveBeenCalled();
  });
});
