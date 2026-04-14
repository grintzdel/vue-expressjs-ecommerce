import { IPageRepository } from "../../domain/repository/page.repository.interface";
import { PageEntity } from "../../domain/entity/page.entity";
import { PageModel } from "../schema/page.schema";

export class PageRepositoryMongooseMongo implements IPageRepository {
  private toEntity(doc: any): PageEntity {
    return new PageEntity({
      id: doc._id.toString(),
      title: doc.title,
      slug: doc.slug,
      content: doc.content,
      seoMeta: { title: doc.seoMeta.title, description: doc.seoMeta.description },
      isPublished: doc.isPublished,
      createdAt: doc.createdAt,
    });
  }

  async findAll(): Promise<PageEntity[]> {
    const docs = await PageModel.find();
    return docs.map((doc) => this.toEntity(doc));
  }

  async findBySlug(slug: string): Promise<PageEntity | null> {
    const doc = await PageModel.findOne({ slug });
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async findById(id: string): Promise<PageEntity | null> {
    const doc = await PageModel.findById(id);
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async create(data: { title: string; slug: string; content: string; seoMeta: { title: string; description: string }; isPublished: boolean }): Promise<PageEntity> {
    const doc = await PageModel.create(data);
    return this.toEntity(doc);
  }

  async update(id: string, data: Partial<{ title: string; slug: string; content: string; seoMeta: { title: string; description: string }; isPublished: boolean }>): Promise<PageEntity | null> {
    const doc = await PageModel.findByIdAndUpdate(id, data, { new: true });
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async delete(id: string): Promise<boolean> {
    const result = await PageModel.findByIdAndDelete(id);
    return result !== null;
  }
}
