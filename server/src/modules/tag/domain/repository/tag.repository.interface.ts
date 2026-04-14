import { TagEntity } from "../entity/tag.entity";

export interface ITagRepository {
  findAll(): Promise<TagEntity[]>;
  findBySlug(slug: string): Promise<TagEntity | null>;
  findById(id: string): Promise<TagEntity | null>;
  findByIds(ids: string[]): Promise<TagEntity[]>;
  create(data: { name: string; slug: string }): Promise<TagEntity>;
  update(id: string, data: Partial<{ name: string; slug: string }>): Promise<TagEntity | null>;
  delete(id: string): Promise<boolean>;
}
