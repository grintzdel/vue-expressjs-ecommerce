import { CategoryEntity } from "../entity/category.entity";

export interface ICategoryRepository {
  findAll(): Promise<CategoryEntity[]>;
  findBySlug(slug: string): Promise<CategoryEntity | null>;
  findById(id: string): Promise<CategoryEntity | null>;
  create(data: { name: string; slug: string; description: string }): Promise<CategoryEntity>;
  update(id: string, data: Partial<{ name: string; slug: string; description: string }>): Promise<CategoryEntity | null>;
  delete(id: string): Promise<boolean>;
}
