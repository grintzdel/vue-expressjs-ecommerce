import mongoose, { Schema, Document } from "mongoose";
import { ProductImage } from "../../domain/entity/product.entity";

export interface ProductDocument extends Document {
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
}

const productImageSchema = new Schema(
  {
    url: { type: String, required: true },
    altText: { type: String, required: true },
    position: { type: Number, required: true },
  },
  { _id: false }
);

const productSchema = new Schema<ProductDocument>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: "EUR" },
    images: [productImageSchema],
    categoryId: { type: String, required: true },
    tagIds: [{ type: String }],
    skinTypeIds: [{ type: String }],
    rating: { type: Number, default: 0 },
    stockQuantity: { type: Number, required: true },
    isFeatured: { type: Boolean, default: false },
    ingredients: { type: String, default: "" },
    howToUse: { type: String, default: "" },
    shippingInfo: { type: String, default: "" },
  },
  { timestamps: true }
);

export const ProductModel = mongoose.model<ProductDocument>("Product", productSchema);
