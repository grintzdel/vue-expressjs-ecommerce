import { ICartItemRepository } from "../../../domain/repository/cart-item.repository.interface";
import { CartItemEntity } from "../../../domain/entity/cart-item.entity";

interface AddToCartInput {
  sessionId: string;
  productId: string;
  quantity: number;
}

export class AddToCartUseCase {
  constructor(private readonly cartItemRepository: ICartItemRepository) {}

  async execute(input: AddToCartInput): Promise<CartItemEntity> {
    const existing = await this.cartItemRepository.findBySessionAndProduct(
      input.sessionId,
      input.productId
    );

    if (existing) {
      const newQuantity = existing.quantity + input.quantity;
      const updated = await this.cartItemRepository.update(existing.id, { quantity: newQuantity });
      return updated!;
    }

    return this.cartItemRepository.create({
      sessionId: input.sessionId,
      productId: input.productId,
      quantity: input.quantity,
    });
  }
}
