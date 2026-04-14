import { ProductImage } from "../../domain/entity/product.entity";

export class UpdateProductRequestDto {
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  currency?: string;
  images?: ProductImage[];
  categoryId?: string;
  tagIds?: string[];
  skinTypeIds?: string[];
  rating?: number;
  stockQuantity?: number;
  isFeatured?: boolean;
  ingredients?: string;
  howToUse?: string;
  shippingInfo?: string;

  constructor(body: Record<string, unknown>) {
    if (body.name !== undefined) this.name = body.name as string;
    if (body.slug !== undefined) this.slug = body.slug as string;
    if (body.description !== undefined) this.description = body.description as string;
    if (body.price !== undefined) this.price = body.price as number;
    if (body.currency !== undefined) this.currency = body.currency as string;
    if (body.images !== undefined) this.images = body.images as ProductImage[];
    if (body.categoryId !== undefined) this.categoryId = body.categoryId as string;
    if (body.tagIds !== undefined) this.tagIds = body.tagIds as string[];
    if (body.skinTypeIds !== undefined) this.skinTypeIds = body.skinTypeIds as string[];
    if (body.rating !== undefined) this.rating = body.rating as number;
    if (body.stockQuantity !== undefined) this.stockQuantity = body.stockQuantity as number;
    if (body.isFeatured !== undefined) this.isFeatured = body.isFeatured as boolean;
    if (body.ingredients !== undefined) this.ingredients = body.ingredients as string;
    if (body.howToUse !== undefined) this.howToUse = body.howToUse as string;
    if (body.shippingInfo !== undefined) this.shippingInfo = body.shippingInfo as string;
  }
}
