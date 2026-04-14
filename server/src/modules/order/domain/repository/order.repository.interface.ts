import { OrderEntity, OrderItem } from "../entity/order.entity";

export interface IOrderRepository {
  findAll(): Promise<OrderEntity[]>;
  findById(id: string): Promise<OrderEntity | null>;
  findByUserId(userId: string): Promise<OrderEntity[]>;
  create(data: {
    userId: string;
    items: OrderItem[];
    totalAmount: number;
    currency: string;
    status: string;
    shippingAddress: string;
  }): Promise<OrderEntity>;
  update(id: string, data: Partial<{ status: string }>): Promise<OrderEntity | null>;
  delete(id: string): Promise<boolean>;
}
