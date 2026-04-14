import { ICategoryRepository } from "../../domain/repository/category.repository.interface";
import { CategoryEntity } from "../../domain/entity/category.entity";
import { CategoryModel } from "../schema/category.schema";

export class CategoryRepositoryMongooseMongo implements ICategoryRepository {
  private toEntity(doc: any): CategoryEntity {
    return new CategoryEntity({
      id: doc._id.toString(),
      name: doc.name,
      slug: doc.slug,
      description: doc.description,
      createdAt: doc.createdAt,
    });
  }

  async findAll(): Promise<CategoryEntity[]> {
    const docs = await CategoryModel.find();
    return docs.map((doc) => this.toEntity(doc));
  }

  async findBySlug(slug: string): Promise<CategoryEntity | null> {
    const doc = await CategoryModel.findOne({ slug });
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async findById(id: string): Promise<CategoryEntity | null> {
    const doc = await CategoryModel.findById(id);
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async create(data: { name: string; slug: string; description: string }): Promise<CategoryEntity> {
    const doc = await CategoryModel.create(data);
    return this.toEntity(doc);
  }

  async update(id: string, data: Partial<{ name: string; slug: string; description: string }>): Promise<CategoryEntity | null> {
    const doc = await CategoryModel.findByIdAndUpdate(id, data, { new: true });
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async delete(id: string): Promise<boolean> {
    const result = await CategoryModel.findByIdAndDelete(id);
    return result !== null;
  }
}
