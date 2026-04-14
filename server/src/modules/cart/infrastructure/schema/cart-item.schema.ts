import mongoose, { Schema, Document } from "mongoose";

export interface CartItemDocument extends Document {
  sessionId: string;
  productId: string;
  quantity: number;
  createdAt: Date;
}

const cartItemSchema = new Schema<CartItemDocument>(
  {
    sessionId: { type: String, required: true },
    productId: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
  },
  { timestamps: true }
);

export const CartItemModel = mongoose.model<CartItemDocument>("CartItem", cartItemSchema);
