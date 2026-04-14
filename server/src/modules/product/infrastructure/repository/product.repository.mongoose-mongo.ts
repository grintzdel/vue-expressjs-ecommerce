import { IProductRepository } from "../../domain/repository/product.repository.interface";
import { ProductEntity, ProductImage } from "../../domain/entity/product.entity";
import { ProductModel } from "../schema/product.schema";

export class ProductRepositoryMongooseMongo implements IProductRepository {
  private toEntity(doc: any): ProductEntity {
    return new ProductEntity({
      id: doc._id.toString(),
      name: doc.name,
      slug: doc.slug,
      description: doc.description,
      price: doc.price,
      currency: doc.currency,
      images: doc.images ?? [],
      categoryId: doc.categoryId,
      tagIds: doc.tagIds ?? [],
      skinTypeIds: doc.skinTypeIds ?? [],
      rating: doc.rating,
      stockQuantity: doc.stockQuantity,
      isFeatured: doc.isFeatured,
      ingredients: doc.ingredients ?? "",
      howToUse: doc.howToUse ?? "",
      shippingInfo: doc.shippingInfo ?? "",
      createdAt: doc.createdAt,
    });
  }

  async findAll(): Promise<ProductEntity[]> {
    const docs = await ProductModel.find();
    return docs.map((doc) => this.toEntity(doc));
  }

  async findBySlug(slug: string): Promise<ProductEntity | null> {
    const doc = await ProductModel.findOne({ slug });
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async findById(id: string): Promise<ProductEntity | null> {
    const doc = await ProductModel.findById(id);
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async findByCategory(categoryId: string): Promise<ProductEntity[]> {
    const docs = await ProductModel.find({ categoryId });
    return docs.map((doc) => this.toEntity(doc));
  }

  async findFeatured(): Promise<ProductEntity[]> {
    const docs = await ProductModel.find({ isFeatured: true });
    return docs.map((doc) => this.toEntity(doc));
  }

  async create(data: {
    name: string;
    slug: string;
    description: string;
    price: number;
    currency: string;
    images: ProductImage[];
    categoryId: string;
    tagIds: string[];
    skinTypeIds: string[];
    rating: number;
    stockQuantity: number;
    isFeatured: boolean;
    ingredients: string;
    howToUse: string;
    shippingInfo: string;
  }): Promise<ProductEntity> {
    const doc = await ProductModel.create(data);
    return this.toEntity(doc);
  }

  async update(
    id: string,
    data: Partial<{
      name: string;
      slug: string;
      description: string;
      price: number;
      currency: string;
      images: ProductImage[];
      categoryId: string;
      tagIds: string[];
      skinTypeIds: string[];
      rating: number;
      stockQuantity: number;
      isFeatured: boolean;
      ingredients: string;
      howToUse: string;
      shippingInfo: string;
    }>
  ): Promise<ProductEntity | null> {
    const doc = await ProductModel.findByIdAndUpdate(id, data, { new: true });
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async delete(id: string): Promise<boolean> {
    const result = await ProductModel.findByIdAndDelete(id);
    return result !== null;
  }
}
