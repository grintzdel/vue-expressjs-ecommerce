import { ICategoryRepository } from "../../../domain/repository/category.repository.interface";
import { CategoryEntity } from "../../../domain/entity/category.entity";
import { CategoryNotFoundError } from "../../../domain/errors/category.error";

interface UpdateCategoryInput {
  name?: string;
  slug?: string;
  description?: string;
}

export class UpdateCategoryUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(id: string, input: UpdateCategoryInput): Promise<CategoryEntity> {
    const updated = await this.categoryRepository.update(id, input);
    if (!updated) {
      throw new CategoryNotFoundError();
    }
    return updated;
  }
}
