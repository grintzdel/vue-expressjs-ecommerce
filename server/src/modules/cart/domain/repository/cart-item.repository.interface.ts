import { CartItemEntity } from "../entity/cart-item.entity";

export interface ICartItemRepository {
  findBySessionId(sessionId: string): Promise<CartItemEntity[]>;
  findById(id: string): Promise<CartItemEntity | null>;
  findBySessionAndProduct(sessionId: string, productId: string): Promise<CartItemEntity | null>;
  create(data: { sessionId: string; productId: string; quantity: number }): Promise<CartItemEntity>;
  update(id: string, data: Partial<{ quantity: number }>): Promise<CartItemEntity | null>;
  delete(id: string): Promise<boolean>;
}
