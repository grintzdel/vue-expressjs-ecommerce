import { ICartItemRepository } from "../../../domain/repository/cart-item.repository.interface";
import { CartItemEntity } from "../../../domain/entity/cart-item.entity";
import { CartItemNotFoundError } from "../../../domain/errors/cart.error";

export class UpdateCartItemUseCase {
  constructor(private readonly cartItemRepository: ICartItemRepository) {}

  async execute(id: string, quantity: number): Promise<CartItemEntity> {
    const updated = await this.cartItemRepository.update(id, { quantity });
    if (!updated) {
      throw new CartItemNotFoundError();
    }
    return updated;
  }
}
