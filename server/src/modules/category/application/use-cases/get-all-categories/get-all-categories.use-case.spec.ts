import { GetAllCategoriesUseCase } from "./get-all-categories.use-case";
import { ICategoryRepository } from "../../../domain/repository/category.repository.interface";
import { CategoryEntity } from "../../../domain/entity/category.entity";

describe("GetAllCategoriesUseCase", () => {
  let useCase: GetAllCategoriesUseCase;
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
    useCase = new GetAllCategoriesUseCase(mockRepo);
  });

  it("should return all categories", async () => {
    const categories = [
      new CategoryEntity({ id: "1", name: "Skincare", slug: "skincare", description: "Desc A", createdAt: new Date() }),
      new CategoryEntity({ id: "2", name: "Makeup", slug: "makeup", description: "Desc B", createdAt: new Date() }),
    ];
    mockRepo.findAll.mockResolvedValue(categories);

    const result = await useCase.execute();

    expect(result).toHaveLength(2);
    expect(mockRepo.findAll).toHaveBeenCalled();
  });

  it("should return empty array when no categories exist", async () => {
    mockRepo.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toHaveLength(0);
  });
});
