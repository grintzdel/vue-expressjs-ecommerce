import { DeleteCategoryUseCase } from "./delete-category.use-case";
import { ICategoryRepository } from "../../../domain/repository/category.repository.interface";
import { CategoryNotFoundError } from "../../../domain/errors/category.error";

describe("DeleteCategoryUseCase", () => {
  let useCase: DeleteCategoryUseCase;
  let mockRepo: jest.Mocked<ICategoryRepository>;

  beforeEach(() => {
    mockRepo = {
      findAll: jest.fn(),
      findBySlug: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new DeleteCategoryUseCase(mockRepo);
  });

  it("should delete category successfully", async () => {
    mockRepo.delete.mockResolvedValue(true);

    await expect(useCase.execute("1")).resolves.toBeUndefined();
    expect(mockRepo.delete).toHaveBeenCalledWith("1");
  });

  it("should throw CategoryNotFoundError when category not found", async () => {
    mockRepo.delete.mockResolvedValue(false);

    await expect(useCase.execute("999")).rejects.toThrow(CategoryNotFoundError);
  });
});
