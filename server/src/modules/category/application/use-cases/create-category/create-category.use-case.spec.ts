import { CreateCategoryUseCase } from "./create-category.use-case";
import { ICategoryRepository } from "../../../domain/repository/category.repository.interface";
import { CategoryAlreadyExistsError } from "../../../domain/errors/category.error";
import { CategoryEntity } from "../../../domain/entity/category.entity";

describe("CreateCategoryUseCase", () => {
  let useCase: CreateCategoryUseCase;
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
    useCase = new CreateCategoryUseCase(mockRepo);
  });

  it("should create a category when slug is unique", async () => {
    mockRepo.findBySlug.mockResolvedValue(null);
    mockRepo.create.mockResolvedValue(mockCategory);

    const result = await useCase.execute({ name: "Skincare", slug: "skincare", description: "All skincare products" });

    expect(result).toEqual(mockCategory);
    expect(mockRepo.findBySlug).toHaveBeenCalledWith("skincare");
    expect(mockRepo.create).toHaveBeenCalledWith({ name: "Skincare", slug: "skincare", description: "All skincare products" });
  });

  it("should throw CategoryAlreadyExistsError when slug is taken", async () => {
    mockRepo.findBySlug.mockResolvedValue(mockCategory);

    await expect(useCase.execute({ name: "Skincare", slug: "skincare", description: "Desc" }))
      .rejects.toThrow(CategoryAlreadyExistsError);

    expect(mockRepo.create).not.toHaveBeenCalled();
  });
});
