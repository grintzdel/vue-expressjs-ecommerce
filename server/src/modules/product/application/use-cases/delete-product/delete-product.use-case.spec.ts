import { DeleteProductUseCase } from "./delete-product.use-case";
import { IProductRepository } from "../../../domain/repository/product.repository.interface";
import { ProductNotFoundError } from "../../../domain/errors/product.error";

describe("DeleteProductUseCase", () => {
  let useCase: DeleteProductUseCase;
  let mockRepo: jest.Mocked<IProductRepository>;

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
    useCase = new DeleteProductUseCase(mockRepo);
  });

  it("should delete successfully when product exists", async () => {
    mockRepo.delete.mockResolvedValue(true);

    await expect(useCase.execute("1")).resolves.toBeUndefined();
    expect(mockRepo.delete).toHaveBeenCalledWith("1");
  });

  it("should throw ProductNotFoundError when product not found", async () => {
    mockRepo.delete.mockResolvedValue(false);

    await expect(useCase.execute("999")).rejects.toThrow(ProductNotFoundError);
  });
});
