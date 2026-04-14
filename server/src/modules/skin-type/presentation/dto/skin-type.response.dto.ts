import { SkinTypeEntity } from "../../domain/entity/skin-type.entity";

export class SkinTypeResponseDto {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;

  constructor(entity: SkinTypeEntity) {
    this.id = entity.id;
    this.name = entity.name;
    this.slug = entity.slug;
    this.createdAt = entity.createdAt;
  }
}
