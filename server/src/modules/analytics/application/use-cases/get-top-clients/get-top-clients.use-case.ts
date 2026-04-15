import { OrderModel } from "../../../../order/infrastructure/schema/order.schema";
import { UserModel } from "../../../../auth/infrastructure/schema/user.schema";

export interface TopClientItem {
  rank: number;
  email: string;
  ordersCount: number;
  totalSpent: number;
}

export class GetTopClientsUseCase {
  async execute(): Promise<TopClientItem[]> {
    const results = await OrderModel.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      {
        $group: {
          _id: "$userId",
          ordersCount: { $sum: 1 },
          totalSpent: { $sum: "$totalAmount" },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 },
    ]);

    const userIds = results.map((r: { _id: string }) => r._id);
    const users = await UserModel.find({ _id: { $in: userIds } }).lean();
    const userMap = new Map(users.map((u) => [u._id.toString(), u.email]));

    return results.map((r: { _id: string; ordersCount: number; totalSpent: number }, i: number) => ({
      rank: i + 1,
      email: userMap.get(r._id) ?? "Inconnu",
      ordersCount: r.ordersCount,
      totalSpent: r.totalSpent,
    }));
  }
}
