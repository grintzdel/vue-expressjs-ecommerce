import { OrderModel } from "../../../../order/infrastructure/schema/order.schema";

export interface MonthlyRevenueItem {
  month: string;
  amount: number;
}

export class GetMonthlyRevenueUseCase {
  async execute(): Promise<MonthlyRevenueItem[]> {
    const now = new Date();
    const year = now.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59);

    const results = await OrderModel.aggregate([
      { $match: { status: { $ne: "cancelled" }, createdAt: { $gte: startOfYear, $lte: endOfYear } } },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          amount: { $sum: "$totalAmount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const months: MonthlyRevenueItem[] = [];
    for (let m = 0; m < 12; m++) {
      const d = new Date(year, m, 1);
      const month = m + 1;
      const found = results.find((r: { _id: { year: number; month: number }; amount: number }) => r._id.year === year && r._id.month === month);
      const label = d.toLocaleDateString("fr-FR", { month: "short" }).replace(".", "");
      months.push({ month: label, amount: found?.amount ?? 0 });
    }

    return months;
  }
}
