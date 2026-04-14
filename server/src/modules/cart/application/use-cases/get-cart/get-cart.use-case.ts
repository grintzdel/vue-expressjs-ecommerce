import { ICartItemRepository } from "../../../domain/repository/cart-item.repository.interface";
import { CartItemEntity } from "../../../domain/entity/cart-item.entity";

export class GetCartUseCase {
  constructor(private readonly cartItemRepository: ICartItemRepository) {}

  async execute(sessionId: string): Promise<CartItemEntity[]> {
    return this.cartItemRepository.findBySessionId(sessionId);
  }
}
