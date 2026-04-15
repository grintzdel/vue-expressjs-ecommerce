import { OrderModel } from "../../../../order/infrastructure/schema/order.schema";
import { UserModel } from "../../../../auth/infrastructure/schema/user.schema";
import { NewsletterSubscriptionModel } from "../../../../newsletter/infrastructure/schema/newsletter-subscription.schema";

export interface KpisResult {
  newsletter: { total: number; changePercent: number };
  orders: { total: number; changePercent: number };
  revenue: { total: number; changePercent: number };
  clients: { total: number; changePercent: number };
}

export class GetKpisUseCase {
  async execute(): Promise<KpisResult> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      newsletterTotal, newsletterThisMonth, newsletterLastMonth,
      ordersTotal, ordersThisMonth, ordersLastMonth,
      revenueResults, revenueLastMonthResults,
      clientsTotal, clientsThisMonth, clientsLastMonth,
    ] = await Promise.all([
      NewsletterSubscriptionModel.countDocuments({ isActive: true }),
      NewsletterSubscriptionModel.countDocuments({ subscribedAt: { $gte: startOfMonth } }),
      NewsletterSubscriptionModel.countDocuments({ subscribedAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
      OrderModel.countDocuments(),
      OrderModel.countDocuments({ createdAt: { $gte: startOfMonth } }),
      OrderModel.countDocuments({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
      OrderModel.aggregate([
        { $match: { status: { $ne: "cancelled" } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      OrderModel.aggregate([
        { $match: { status: { $ne: "cancelled" }, createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      UserModel.countDocuments({ role: "customer" }),
      UserModel.countDocuments({ role: "customer", createdAt: { $gte: startOfMonth } }),
      UserModel.countDocuments({ role: "customer", createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
    ]);

    const revenueTotal = revenueResults[0]?.total ?? 0;
    const revenueLastMonth = revenueLastMonthResults[0]?.total ?? 0;

    const calcChange = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 1000) / 10;
    };

    return {
      newsletter: { total: newsletterTotal, changePercent: calcChange(newsletterThisMonth, newsletterLastMonth) },
      orders: { total: ordersTotal, changePercent: calcChange(ordersThisMonth, ordersLastMonth) },
      revenue: { total: revenueTotal, changePercent: calcChange(revenueTotal, revenueLastMonth) },
      clients: { total: clientsTotal, changePercent: calcChange(clientsThisMonth, clientsLastMonth) },
    };
  }
}
