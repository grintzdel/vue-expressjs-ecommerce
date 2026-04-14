import { ICategoryRepository } from "../../../domain/repository/category.repository.interface";
import { CategoryNotFoundError } from "../../../domain/errors/category.error";

export class DeleteCategoryUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(id: string): Promise<void> {
    const deleted = await this.categoryRepository.delete(id);
    if (!deleted) {
      throw new CategoryNotFoundError();
    }
  }
}
