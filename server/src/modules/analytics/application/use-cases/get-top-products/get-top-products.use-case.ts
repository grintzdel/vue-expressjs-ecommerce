import { OrderModel } from "../../../../order/infrastructure/schema/order.schema";
import { ProductModel } from "../../../../product/infrastructure/schema/product.schema";
import { CategoryModel } from "../../../../category/infrastructure/schema/category.schema";

export interface TopProductItem {
  rank: number;
  name: string;
  category: string;
  sales: number;
  revenue: number;
}

export class GetTopProductsUseCase {
  async execute(): Promise<TopProductItem[]> {
    const results = await OrderModel.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          name: { $first: "$items.productName" },
          sales: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.unitPrice", "$items.quantity"] } },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
    ]);

    const productIds = results.map((r: { _id: string }) => r._id);
    const products = await ProductModel.find({ _id: { $in: productIds } }).lean();
    const categoryIds = [...new Set(products.map((p) => p.categoryId))];
    const categories = await CategoryModel.find({ _id: { $in: categoryIds } }).lean();
    const catMap = new Map(categories.map((c) => [c._id.toString(), c.name]));
    const prodCatMap = new Map(products.map((p) => [p._id.toString(), catMap.get(p.categoryId) ?? ""]));

    return results.map((r: { _id: string; name: string; sales: number; revenue: number }, i: number) => ({
      rank: i + 1,
      name: r.name,
      category: prodCatMap.get(r._id) ?? "",
      sales: r.sales,
      revenue: r.revenue,
    }));
  }
}
