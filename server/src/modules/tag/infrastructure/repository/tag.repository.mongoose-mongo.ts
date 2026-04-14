import { ITagRepository } from "../../domain/repository/tag.repository.interface";
import { TagEntity } from "../../domain/entity/tag.entity";
import { TagModel } from "../schema/tag.schema";

export class TagRepositoryMongooseMongo implements ITagRepository {
  private toEntity(doc: any): TagEntity {
    return new TagEntity({
      id: doc._id.toString(),
      name: doc.name,
      slug: doc.slug,
      createdAt: doc.createdAt,
    });
  }

  async findAll(): Promise<TagEntity[]> {
    const docs = await TagModel.find();
    return docs.map((doc) => this.toEntity(doc));
  }

  async findBySlug(slug: string): Promise<TagEntity | null> {
    const doc = await TagModel.findOne({ slug });
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async findById(id: string): Promise<TagEntity | null> {
    const doc = await TagModel.findById(id);
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async findByIds(ids: string[]): Promise<TagEntity[]> {
    const docs = await TagModel.find({ _id: { $in: ids } });
    return docs.map((doc) => this.toEntity(doc));
  }

  async create(data: { name: string; slug: string }): Promise<TagEntity> {
    const doc = await TagModel.create(data);
    return this.toEntity(doc);
  }

  async update(id: string, data: Partial<{ name: string; slug: string }>): Promise<TagEntity | null> {
    const doc = await TagModel.findByIdAndUpdate(id, data, { new: true });
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async delete(id: string): Promise<boolean> {
    const result = await TagModel.findByIdAndDelete(id);
    return result !== null;
  }
}
