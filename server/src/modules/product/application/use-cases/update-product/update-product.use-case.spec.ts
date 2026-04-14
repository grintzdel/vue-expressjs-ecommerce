import { UpdateProductUseCase } from "./update-product.use-case";
import { IProductRepository } from "../../../domain/repository/product.repository.interface";
import { ProductNotFoundError } from "../../../domain/errors/product.error";
import { ProductEntity } from "../../../domain/entity/product.entity";

describe("UpdateProductUseCase", () => {
  let useCase: UpdateProductUseCase;
  let mockRepo: jest.Mocked<IProductRepository>;

  const mockProduct = new ProductEntity({
    id: "1",
    name: "Updated Serum",
    slug: "updated-serum",
    description: "Desc",
    price: 39.99,
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
    useCase = new UpdateProductUseCase(mockRepo);
  });

  it("should update and return product when found", async () => {
    mockRepo.update.mockResolvedValue(mockProduct);

    const result = await useCase.execute("1", { name: "Updated Serum", price: 39.99 });

    expect(result).toEqual(mockProduct);
    expect(mockRepo.update).toHaveBeenCalledWith("1", { name: "Updated Serum", price: 39.99 });
  });

  it("should throw ProductNotFoundError when product not found", async () => {
    mockRepo.update.mockResolvedValue(null);

    await expect(useCase.execute("999", { name: "X" })).rejects.toThrow(ProductNotFoundError);
  });
});
