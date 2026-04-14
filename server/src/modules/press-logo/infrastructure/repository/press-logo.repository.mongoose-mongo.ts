import { IPressLogoRepository } from "../../domain/repository/press-logo.repository.interface";
import { PressLogoEntity } from "../../domain/entity/press-logo.entity";
import { PressLogoModel } from "../schema/press-logo.schema";

export class PressLogoRepositoryMongooseMongo implements IPressLogoRepository {
  private toEntity(doc: any): PressLogoEntity {
    return new PressLogoEntity({
      id: doc._id.toString(),
      name: doc.name,
      logoUrl: doc.logoUrl,
      link: doc.link,
      position: doc.position,
      createdAt: doc.createdAt,
    });
  }

  async findAll(): Promise<PressLogoEntity[]> {
    const docs = await PressLogoModel.find().sort({ position: 1 });
    return docs.map((doc) => this.toEntity(doc));
  }

  async findById(id: string): Promise<PressLogoEntity | null> {
    const doc = await PressLogoModel.findById(id);
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async create(data: { name: string; logoUrl: string; link: string; position: number }): Promise<PressLogoEntity> {
    const doc = await PressLogoModel.create(data);
    return this.toEntity(doc);
  }

  async update(id: string, data: Partial<{ name: string; logoUrl: string; link: string; position: number }>): Promise<PressLogoEntity | null> {
    const doc = await PressLogoModel.findByIdAndUpdate(id, data, { new: true });
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async delete(id: string): Promise<boolean> {
    const result = await PressLogoModel.findByIdAndDelete(id);
    return result !== null;
  }
}
