import { ITestimonialRepository } from "../../domain/repository/testimonial.repository.interface";
import { TestimonialEntity } from "../../domain/entity/testimonial.entity";
import { TestimonialModel } from "../schema/testimonial.schema";

export class TestimonialRepositoryMongooseMongo implements ITestimonialRepository {
  private toEntity(doc: any): TestimonialEntity {
    return new TestimonialEntity({
      id: doc._id.toString(),
      authorName: doc.authorName,
      content: doc.content,
      rating: doc.rating,
      featuredProductIds: doc.featuredProductIds,
      isFeatured: doc.isFeatured,
      createdAt: doc.createdAt,
    });
  }

  async findAll(): Promise<TestimonialEntity[]> {
    const docs = await TestimonialModel.find();
    return docs.map((doc) => this.toEntity(doc));
  }

  async findFeatured(): Promise<TestimonialEntity[]> {
    const docs = await TestimonialModel.find({ isFeatured: true });
    return docs.map((doc) => this.toEntity(doc));
  }

  async findById(id: string): Promise<TestimonialEntity | null> {
    const doc = await TestimonialModel.findById(id);
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async create(data: { authorName: string; content: string; rating: number; featuredProductIds: string[]; isFeatured: boolean }): Promise<TestimonialEntity> {
    const doc = await TestimonialModel.create(data);
    return this.toEntity(doc);
  }

  async update(id: string, data: Partial<{ authorName: string; content: string; rating: number; featuredProductIds: string[]; isFeatured: boolean }>): Promise<TestimonialEntity | null> {
    const doc = await TestimonialModel.findByIdAndUpdate(id, data, { new: true });
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async delete(id: string): Promise<boolean> {
    const result = await TestimonialModel.findByIdAndDelete(id);
    return result !== null;
  }
}
