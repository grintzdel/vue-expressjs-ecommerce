import { IOrderRepository } from "../../domain/repository/order.repository.interface";
import { OrderEntity, OrderItem } from "../../domain/entity/order.entity";
import { OrderModel } from "../schema/order.schema";

export class OrderRepositoryMongooseMongo implements IOrderRepository {
  private toEntity(doc: any): OrderEntity {
    return new OrderEntity({
      id: doc._id.toString(),
      userId: doc.userId,
      items: doc.items.map((item: any) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      totalAmount: doc.totalAmount,
      currency: doc.currency,
      status: doc.status,
      shippingAddress: doc.shippingAddress,
      createdAt: doc.createdAt,
    });
  }

  async findAll(): Promise<OrderEntity[]> {
    const docs = await OrderModel.find();
    return docs.map((doc) => this.toEntity(doc));
  }

  async findById(id: string): Promise<OrderEntity | null> {
    const doc = await OrderModel.findById(id);
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async findByUserId(userId: string): Promise<OrderEntity[]> {
    const docs = await OrderModel.find({ userId });
    return docs.map((doc) => this.toEntity(doc));
  }

  async create(data: {
    userId: string;
    items: OrderItem[];
    totalAmount: number;
    currency: string;
    status: string;
    shippingAddress: string;
  }): Promise<OrderEntity> {
    const doc = await OrderModel.create(data);
    return this.toEntity(doc);
  }

  async update(id: string, data: Partial<{ status: string }>): Promise<OrderEntity | null> {
    const doc = await OrderModel.findByIdAndUpdate(id, data, { new: true });
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async delete(id: string): Promise<boolean> {
    const result = await OrderModel.findByIdAndDelete(id);
    return result !== null;
  }
}
