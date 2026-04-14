import { IOrderRepository } from "../../../domain/repository/order.repository.interface";
import { OrderEntity, OrderItem } from "../../../domain/entity/order.entity";
import { ORDER_STATUS } from "../../../domain/constants/order.constant";

interface CreateOrderInput {
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  shippingAddress: string;
}

export class CreateOrderUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(input: CreateOrderInput): Promise<OrderEntity> {
    return this.orderRepository.create({
      userId: input.userId,
      items: input.items,
      totalAmount: input.totalAmount,
      currency: input.currency,
      status: ORDER_STATUS.PENDING,
      shippingAddress: input.shippingAddress,
    });
  }
}
