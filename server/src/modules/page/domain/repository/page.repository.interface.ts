import { PageEntity } from "../entity/page.entity";

export interface IPageRepository {
  findAll(): Promise<PageEntity[]>;
  findBySlug(slug: string): Promise<PageEntity | null>;
  findById(id: string): Promise<PageEntity | null>;
  create(data: { title: string; slug: string; content: string; seoMeta: { title: string; description: string }; isPublished: boolean }): Promise<PageEntity>;
  update(id: string, data: Partial<{ title: string; slug: string; content: string; seoMeta: { title: string; description: string }; isPublished: boolean }>): Promise<PageEntity | null>;
  delete(id: string): Promise<boolean>;
}
