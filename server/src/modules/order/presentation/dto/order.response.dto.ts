import { OrderEntity, OrderItem } from "../../domain/entity/order.entity";

export class OrderResponseDto {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  status: string;
  shippingAddress: string;
  createdAt: Date;

  constructor(entity: OrderEntity) {
    this.id = entity.id;
    this.userId = entity.userId;
    this.items = entity.items;
    this.totalAmount = entity.totalAmount;
    this.currency = entity.currency;
    this.status = entity.status;
    this.shippingAddress = entity.shippingAddress;
    this.createdAt = entity.createdAt;
  }
}
