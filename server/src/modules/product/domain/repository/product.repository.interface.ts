import { ProductEntity, ProductImage } from "../entity/product.entity";

export interface IProductRepository {
  findAll(): Promise<ProductEntity[]>;
  findBySlug(slug: string): Promise<ProductEntity | null>;
  findById(id: string): Promise<ProductEntity | null>;
  findByCategory(categoryId: string): Promise<ProductEntity[]>;
  findFeatured(): Promise<ProductEntity[]>;
  create(data: {
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
  }): Promise<ProductEntity>;
  update(
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
  ): Promise<ProductEntity | null>;
  delete(id: string): Promise<boolean>;
}
