import { OrderItem } from "../../domain/entity/order.entity";

export class CreateOrderRequestDto {
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  shippingAddress: string;

  constructor(body: Record<string, unknown>) {
    this.userId = body.userId as string;
    this.items = body.items as OrderItem[];
    this.totalAmount = body.totalAmount as number;
    this.currency = body.currency as string;
    this.shippingAddress = body.shippingAddress as string;
  }
}
