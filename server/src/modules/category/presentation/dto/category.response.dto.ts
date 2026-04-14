import { CategoryEntity } from "../../domain/entity/category.entity";

export class CategoryResponseDto {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: Date;

  constructor(entity: CategoryEntity) {
    this.id = entity.id;
    this.name = entity.name;
    this.slug = entity.slug;
    this.description = entity.description;
    this.createdAt = entity.createdAt;
  }
}
