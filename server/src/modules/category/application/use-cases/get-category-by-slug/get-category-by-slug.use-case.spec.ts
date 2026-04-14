import { GetCategoryBySlugUseCase } from "./get-category-by-slug.use-case";
import { ICategoryRepository } from "../../../domain/repository/category.repository.interface";
import { CategoryNotFoundError } from "../../../domain/errors/category.error";
import { CategoryEntity } from "../../../domain/entity/category.entity";

describe("GetCategoryBySlugUseCase", () => {
  let useCase: GetCategoryBySlugUseCase;
  let mockRepo: jest.Mocked<ICategoryRepository>;

  const mockCategory = new CategoryEntity({
    id: "1",
    name: "Skincare",
    slug: "skincare",
    description: "All skincare products",
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
    useCase = new GetCategoryBySlugUseCase(mockRepo);
  });

  it("should return category when found by slug", async () => {
    mockRepo.findBySlug.mockResolvedValue(mockCategory);

    const result = await useCase.execute("skincare");

    expect(result).toEqual(mockCategory);
    expect(mockRepo.findBySlug).toHaveBeenCalledWith("skincare");
  });

  it("should throw CategoryNotFoundError when slug not found", async () => {
    mockRepo.findBySlug.mockResolvedValue(null);

    await expect(useCase.execute("unknown")).rejects.toThrow(CategoryNotFoundError);
  });
});
