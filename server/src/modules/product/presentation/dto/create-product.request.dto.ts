import { ProductImage } from "../../domain/entity/product.entity";

export class CreateProductRequestDto {
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

  constructor(body: Record<string, unknown>) {
    this.name = body.name as string;
    this.slug = body.slug as string;
    this.description = (body.description as string) ?? "";
    this.price = body.price as number;
    this.currency = (body.currency as string) ?? "EUR";
    this.images = (body.images as ProductImage[]) ?? [];
    this.categoryId = body.categoryId as string;
    this.tagIds = (body.tagIds as string[]) ?? [];
    this.skinTypeIds = (body.skinTypeIds as string[]) ?? [];
    this.rating = (body.rating as number) ?? 0;
    this.stockQuantity = body.stockQuantity as number;
    this.isFeatured = (body.isFeatured as boolean) ?? false;
    this.ingredients = (body.ingredients as string) ?? "";
    this.howToUse = (body.howToUse as string) ?? "";
    this.shippingInfo = (body.shippingInfo as string) ?? "";
  }
}
