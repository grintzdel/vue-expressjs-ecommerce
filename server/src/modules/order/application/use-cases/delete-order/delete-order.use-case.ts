import { IOrderRepository } from "../../../domain/repository/order.repository.interface";
import { OrderNotFoundError } from "../../../domain/errors/order.error";

export class DeleteOrderUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(id: string): Promise<void> {
    const deleted = await this.orderRepository.delete(id);
    if (!deleted) {
      throw new OrderNotFoundError();
    }
  }
}
