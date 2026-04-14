import { CreateCategoryUseCase } from "../use-cases/create-category/create-category.use-case";
import { GetAllCategoriesUseCase } from "../use-cases/get-all-categories/get-all-categories.use-case";
import { GetCategoryBySlugUseCase } from "../use-cases/get-category-by-slug/get-category-by-slug.use-case";
import { UpdateCategoryUseCase } from "../use-cases/update-category/update-category.use-case";
import { DeleteCategoryUseCase } from "../use-cases/delete-category/delete-category.use-case";

export class CategoryService {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly getAllCategoriesUseCase: GetAllCategoriesUseCase,
    private readonly getCategoryBySlugUseCase: GetCategoryBySlugUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase
  ) {}

  async createCategory(input: { name: string; slug: string; description: string }) {
    return this.createCategoryUseCase.execute(input);
  }

  async getAllCategories() {
    return this.getAllCategoriesUseCase.execute();
  }

  async getCategoryBySlug(slug: string) {
    return this.getCategoryBySlugUseCase.execute(slug);
  }

  async updateCategory(id: string, input: Partial<{ name: string; slug: string; description: string }>) {
    return this.updateCategoryUseCase.execute(id, input);
  }

  async deleteCategory(id: string) {
    return this.deleteCategoryUseCase.execute(id);
  }
}
