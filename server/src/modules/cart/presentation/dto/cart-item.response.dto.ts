import { CartItemEntity } from "../../domain/entity/cart-item.entity";

export class CartItemResponseDto {
  id: string;
  sessionId: string;
  productId: string;
  quantity: number;
  createdAt: Date;

  constructor(entity: CartItemEntity) {
    this.id = entity.id;
    this.sessionId = entity.sessionId;
    this.productId = entity.productId;
    this.quantity = entity.quantity;
    this.createdAt = entity.createdAt;
  }
}
