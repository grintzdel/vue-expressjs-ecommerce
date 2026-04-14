import { IOrderRepository } from "../../../domain/repository/order.repository.interface";
import { OrderEntity } from "../../../domain/entity/order.entity";
import { OrderNotFoundError } from "../../../domain/errors/order.error";

export class UpdateOrderStatusUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(id: string, status: string): Promise<OrderEntity> {
    const updated = await this.orderRepository.update(id, { status });
    if (!updated) {
      throw new OrderNotFoundError();
    }
    return updated;
  }
}
