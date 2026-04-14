import { ISkinTypeRepository } from "../../domain/repository/skin-type.repository.interface";
import { SkinTypeEntity } from "../../domain/entity/skin-type.entity";
import { SkinTypeModel } from "../schema/skin-type.schema";

export class SkinTypeRepositoryMongooseMongo implements ISkinTypeRepository {
  private toEntity(doc: any): SkinTypeEntity {
    return new SkinTypeEntity({
      id: doc._id.toString(),
      name: doc.name,
      slug: doc.slug,
      createdAt: doc.createdAt,
    });
  }

  async findAll(): Promise<SkinTypeEntity[]> {
    const docs = await SkinTypeModel.find();
    return docs.map((doc) => this.toEntity(doc));
  }

  async findBySlug(slug: string): Promise<SkinTypeEntity | null> {
    const doc = await SkinTypeModel.findOne({ slug });
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async findById(id: string): Promise<SkinTypeEntity | null> {
    const doc = await SkinTypeModel.findById(id);
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async findByIds(ids: string[]): Promise<SkinTypeEntity[]> {
    const docs = await SkinTypeModel.find({ _id: { $in: ids } });
    return docs.map((doc) => this.toEntity(doc));
  }

  async create(data: { name: string; slug: string }): Promise<SkinTypeEntity> {
    const doc = await SkinTypeModel.create(data);
    return this.toEntity(doc);
  }

  async update(id: string, data: Partial<{ name: string; slug: string }>): Promise<SkinTypeEntity | null> {
    const doc = await SkinTypeModel.findByIdAndUpdate(id, data, { new: true });
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async delete(id: string): Promise<boolean> {
    const result = await SkinTypeModel.findByIdAndDelete(id);
    return result !== null;
  }
}
