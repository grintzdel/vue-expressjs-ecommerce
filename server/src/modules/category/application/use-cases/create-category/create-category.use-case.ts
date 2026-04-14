import { ICategoryRepository } from "../../../domain/repository/category.repository.interface";
import { CategoryEntity } from "../../../domain/entity/category.entity";
import { CategoryAlreadyExistsError } from "../../../domain/errors/category.error";

interface CreateCategoryInput {
  name: string;
  slug: string;
  description: string;
}

export class CreateCategoryUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(input: CreateCategoryInput): Promise<CategoryEntity> {
    const existing = await this.categoryRepository.findBySlug(input.slug);
    if (existing) {
      throw new CategoryAlreadyExistsError();
    }

    return this.categoryRepository.create({
      name: input.name,
      slug: input.slug,
      description: input.description,
    });
  }
}
