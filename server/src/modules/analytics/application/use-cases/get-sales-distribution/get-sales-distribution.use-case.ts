import { OrderModel } from "../../../../order/infrastructure/schema/order.schema";

export interface SalesDistributionItem {
  category: string;
  amount: number;
  percentage: number;
}

export class GetSalesDistributionUseCase {
  async execute(): Promise<SalesDistributionItem[]> {
    const results = await OrderModel.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          let: { pid: "$items.productId" },
          pipeline: [{ $match: { $expr: { $eq: [{ $toString: "$_id" }, "$$pid"] } } }],
          as: "product",
        },
      },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "categories",
          let: { cid: "$product.categoryId" },
          pipeline: [{ $match: { $expr: { $eq: [{ $toString: "$_id" }, "$$cid"] } } }],
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: { $ifNull: ["$category.name", "Autre"] },
          amount: { $sum: { $multiply: ["$items.unitPrice", "$items.quantity"] } },
        },
      },
      { $sort: { amount: -1 } },
    ]);

    const totalAmount = results.reduce((sum: number, r: { amount: number }) => sum + r.amount, 0);

    return results.map((r: { _id: string; amount: number }) => ({
      category: r._id,
      amount: r.amount,
      percentage: totalAmount > 0 ? Math.round((r.amount / totalAmount) * 1000) / 10 : 0,
    }));
  }
}
