import { ICategoryRepository } from "../../../domain/repository/category.repository.interface";
import { CategoryEntity } from "../../../domain/entity/category.entity";

export class GetAllCategoriesUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(): Promise<CategoryEntity[]> {
    return this.categoryRepository.findAll();
  }
}
