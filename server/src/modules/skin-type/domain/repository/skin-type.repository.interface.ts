import { SkinTypeEntity } from "../entity/skin-type.entity";

export interface ISkinTypeRepository {
  findAll(): Promise<SkinTypeEntity[]>;
  findBySlug(slug: string): Promise<SkinTypeEntity | null>;
  findById(id: string): Promise<SkinTypeEntity | null>;
  findByIds(ids: string[]): Promise<SkinTypeEntity[]>;
  create(data: { name: string; slug: string }): Promise<SkinTypeEntity>;
  update(id: string, data: Partial<{ name: string; slug: string }>): Promise<SkinTypeEntity | null>;
  delete(id: string): Promise<boolean>;
}
