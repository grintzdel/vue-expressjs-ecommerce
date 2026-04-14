import { ICartItemRepository } from "../../domain/repository/cart-item.repository.interface";
import { CartItemEntity } from "../../domain/entity/cart-item.entity";
import { CartItemModel } from "../schema/cart-item.schema";

export class CartItemRepositoryMongooseMongo implements ICartItemRepository {
  private toEntity(doc: any): CartItemEntity {
    return new CartItemEntity({
      id: doc._id.toString(),
      sessionId: doc.sessionId,
      productId: doc.productId,
      quantity: doc.quantity,
      createdAt: doc.createdAt,
    });
  }

  async findBySessionId(sessionId: string): Promise<CartItemEntity[]> {
    const docs = await CartItemModel.find({ sessionId });
    return docs.map((doc) => this.toEntity(doc));
  }

  async findById(id: string): Promise<CartItemEntity | null> {
    const doc = await CartItemModel.findById(id);
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async findBySessionAndProduct(sessionId: string, productId: string): Promise<CartItemEntity | null> {
    const doc = await CartItemModel.findOne({ sessionId, productId });
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async create(data: { sessionId: string; productId: string; quantity: number }): Promise<CartItemEntity> {
    const doc = await CartItemModel.create(data);
    return this.toEntity(doc);
  }

  async update(id: string, data: Partial<{ quantity: number }>): Promise<CartItemEntity | null> {
    const doc = await CartItemModel.findByIdAndUpdate(id, data, { new: true });
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async delete(id: string): Promise<boolean> {
    const result = await CartItemModel.findByIdAndDelete(id);
    return result !== null;
  }
}
