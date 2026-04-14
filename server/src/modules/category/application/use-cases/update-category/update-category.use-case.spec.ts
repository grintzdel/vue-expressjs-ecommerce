import { UpdateCategoryUseCase } from "./update-category.use-case";
import { ICategoryRepository } from "../../../domain/repository/category.repository.interface";
import { CategoryNotFoundError } from "../../../domain/errors/category.error";
import { CategoryEntity } from "../../../domain/entity/category.entity";

describe("UpdateCategoryUseCase", () => {
  let useCase: UpdateCategoryUseCase;
  let mockRepo: jest.Mocked<ICategoryRepository>;

  const mockCategory = new CategoryEntity({
    id: "1",
    name: "Updated Skincare",
    slug: "skincare",
    description: "Updated description",
    createdAt: new Date(),
  });

  beforeEach(() => {
    mockRepo = {
      findAll: jest.fn(),
      findBySlug: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new UpdateCategoryUseCase(mockRepo);
  });

  it("should update and return category", async () => {
    mockRepo.update.mockResolvedValue(mockCategory);

    const result = await useCase.execute("1", { name: "Updated Skincare" });

    expect(result).toEqual(mockCategory);
    expect(mockRepo.update).toHaveBeenCalledWith("1", { name: "Updated Skincare" });
  });

  it("should throw CategoryNotFoundError when category not found", async () => {
    mockRepo.update.mockResolvedValue(null);

    await expect(useCase.execute("999", { name: "X" })).rejects.toThrow(CategoryNotFoundError);
  });
});
