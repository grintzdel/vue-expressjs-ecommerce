import mongoose, { Schema, Document } from "mongoose";

export interface OrderItemSubdocument {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderDocument extends Document {
  userId: string;
  items: OrderItemSubdocument[];
  totalAmount: number;
  currency: string;
  status: string;
  shippingAddress: string;
  createdAt: Date;
}

const orderItemSchema = new Schema<OrderItemSubdocument>(
  {
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new Schema<OrderDocument>(
  {
    userId: { type: String, required: true },
    items: { type: [orderItemSchema], required: true },
    totalAmount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, required: true, default: "pending" },
    shippingAddress: { type: String, required: true },
  },
  { timestamps: true }
);

export const OrderModel = mongoose.model<OrderDocument>("Order", orderSchema);
