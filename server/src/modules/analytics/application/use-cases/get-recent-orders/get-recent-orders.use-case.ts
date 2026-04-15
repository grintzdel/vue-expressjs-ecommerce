import { OrderModel } from "../../../../order/infrastructure/schema/order.schema";
import { UserModel } from "../../../../auth/infrastructure/schema/user.schema";

export interface RecentOrderItem {
  id: string;
  orderNumber: string;
  clientName: string;
  products: string;
  total: number;
  currency: string;
  status: string;
  date: string;
}

export class GetRecentOrdersUseCase {
  async execute(): Promise<RecentOrderItem[]> {
    const orders = await OrderModel.find().sort({ createdAt: -1 }).limit(5).lean();
    const userIds = [...new Set(orders.map((o) => o.userId))];
    const users = await UserModel.find({ _id: { $in: userIds } }).lean();
    const userMap = new Map(users.map((u) => [u._id.toString(), u.email]));

    return orders.map((o, i) => ({
      id: o._id.toString(),
      orderNumber: `#VLV-${String(1000 + i).padStart(4, "0")}`,
      clientName: userMap.get(o.userId) ?? "Inconnu",
      products: o.items.map((item) => item.productName).join(", "),
      total: o.totalAmount,
      currency: o.currency,
      status: o.status,
      date: new Date(o.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
    }));
  }
}
