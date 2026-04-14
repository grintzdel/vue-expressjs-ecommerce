import { TagEntity } from "../../domain/entity/tag.entity";

export class TagResponseDto {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;

  constructor(entity: TagEntity) {
    this.id = entity.id;
    this.name = entity.name;
    this.slug = entity.slug;
    this.createdAt = entity.createdAt;
  }
}
