import { ProductEntity, ProductImage } from "../../domain/entity/product.entity";

export class ProductResponseDto {
  id: string;
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
  createdAt: Date;

  constructor(entity: ProductEntity) {
    this.id = entity.id;
    this.name = entity.name;
    this.slug = entity.slug;
    this.description = entity.description;
    this.price = entity.price;
    this.currency = entity.currency;
    this.images = entity.images;
    this.categoryId = entity.categoryId;
    this.tagIds = entity.tagIds;
    this.skinTypeIds = entity.skinTypeIds;
    this.rating = entity.rating;
    this.stockQuantity = entity.stockQuantity;
    this.isFeatured = entity.isFeatured;
    this.ingredients = entity.ingredients;
    this.howToUse = entity.howToUse;
    this.shippingInfo = entity.shippingInfo;
    this.createdAt = entity.createdAt;
  }
}
