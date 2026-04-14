import { CategoryService } from "./category.service";
import { CreateCategoryUseCase } from "../use-cases/create-category/create-category.use-case";
import { GetAllCategoriesUseCase } from "../use-cases/get-all-categories/get-all-categories.use-case";
import { GetCategoryBySlugUseCase } from "../use-cases/get-category-by-slug/get-category-by-slug.use-case";
import { UpdateCategoryUseCase } from "../use-cases/update-category/update-category.use-case";
import { DeleteCategoryUseCase } from "../use-cases/delete-category/delete-category.use-case";
import { CategoryEntity } from "../../domain/entity/category.entity";

describe("CategoryService", () => {
  let service: CategoryService;
  let mockCreate: jest.Mocked<CreateCategoryUseCase>;
  let mockGetAll: jest.Mocked<GetAllCategoriesUseCase>;
  let mockGetBySlug: jest.Mocked<GetCategoryBySlugUseCase>;
  let mockUpdate: jest.Mocked<UpdateCategoryUseCase>;
  let mockDelete: jest.Mocked<DeleteCategoryUseCase>;

  const mockCategory = new CategoryEntity({
    id: "1",
    name: "Skincare",
    slug: "skincare",
    description: "Desc",
    createdAt: new Date(),
  });

  beforeEach(() => {
    mockCreate = { execute: jest.fn() } as any;
    mockGetAll = { execute: jest.fn() } as any;
    mockGetBySlug = { execute: jest.fn() } as any;
    mockUpdate = { execute: jest.fn() } as any;
    mockDelete = { execute: jest.fn() } as any;

    service = new CategoryService(mockCreate, mockGetAll, mockGetBySlug, mockUpdate, mockDelete);
  });

  it("should delegate createCategory to CreateCategoryUseCase", async () => {
    mockCreate.execute.mockResolvedValue(mockCategory);

    const result = await service.createCategory({ name: "Skincare", slug: "skincare", description: "Desc" });

    expect(result).toEqual(mockCategory);
    expect(mockCreate.execute).toHaveBeenCalledWith({ name: "Skincare", slug: "skincare", description: "Desc" });
  });

  it("should delegate getAllCategories to GetAllCategoriesUseCase", async () => {
    mockGetAll.execute.mockResolvedValue([mockCategory]);

    const result = await service.getAllCategories();

    expect(result).toHaveLength(1);
    expect(mockGetAll.execute).toHaveBeenCalled();
  });

  it("should delegate getCategoryBySlug to GetCategoryBySlugUseCase", async () => {
    mockGetBySlug.execute.mockResolvedValue(mockCategory);

    const result = await service.getCategoryBySlug("skincare");

    expect(result).toEqual(mockCategory);
    expect(mockGetBySlug.execute).toHaveBeenCalledWith("skincare");
  });

  it("should delegate updateCategory to UpdateCategoryUseCase", async () => {
    mockUpdate.execute.mockResolvedValue(mockCategory);

    const result = await service.updateCategory("1", { name: "Updated" });

    expect(result).toEqual(mockCategory);
    expect(mockUpdate.execute).toHaveBeenCalledWith("1", { name: "Updated" });
  });

  it("should delegate deleteCategory to DeleteCategoryUseCase", async () => {
    mockDelete.execute.mockResolvedValue(undefined);

    await service.deleteCategory("1");

    expect(mockDelete.execute).toHaveBeenCalledWith("1");
  });
});
