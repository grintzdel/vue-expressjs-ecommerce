import { ICartItemRepository } from "../../../domain/repository/cart-item.repository.interface";
import { CartItemNotFoundError } from "../../../domain/errors/cart.error";

export class RemoveCartItemUseCase {
  constructor(private readonly cartItemRepository: ICartItemRepository) {}

  async execute(id: string): Promise<void> {
    const deleted = await this.cartItemRepository.delete(id);
    if (!deleted) {
      throw new CartItemNotFoundError();
    }
  }
}
