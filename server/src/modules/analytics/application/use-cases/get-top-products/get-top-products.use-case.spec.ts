import { GetTopProductsUseCase } from "./get-top-products.use-case";

jest.mock("../../../../order/infrastructure/schema/order.schema", () => ({
  OrderModel: { aggregate: jest.fn() },
}));
jest.mock("../../../../product/infrastructure/schema/product.schema", () => ({
  ProductModel: { find: jest.fn().mockReturnValue({ lean: jest.fn() }) },
}));
jest.mock("../../../../category/infrastructure/schema/category.schema", () => ({
  CategoryModel: { find: jest.fn().mockReturnValue({ lean: jest.fn() }) },
}));

import { OrderModel } from "../../../../order/infrastructure/schema/order.schema";
import { ProductModel } from "../../../../product/infrastructure/schema/product.schema";
import { CategoryModel } from "../../../../category/infrastructure/schema/category.schema";

describe("GetTopProductsUseCase", () => {
  let useCase: GetTopProductsUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetTopProductsUseCase();
  });

  it("should return top 5 products with rank and category", async () => {
    (OrderModel.aggregate as jest.Mock).mockResolvedValue([
      { _id: "p1", name: "Sérum Éclat", sales: 10, revenue: 299 },
      { _id: "p2", name: "Crème Nuit", sales: 8, revenue: 240 },
    ]);
    (ProductModel.find as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue([
        { _id: "p1", categoryId: "c1" },
        { _id: "p2", categoryId: "c1" },
      ]),
    });
    (CategoryModel.find as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue([{ _id: "c1", name: "Face" }]),
    });

    const result = await useCase.execute();

    expect(result).toHaveLength(2);
    expect(result[0].rank).toBe(1);
    expect(result[0].name).toBe("Sérum Éclat");
    expect(result[0].category).toBe("Face");
    expect(result[1].rank).toBe(2);
  });

  it("should return empty array when no sales", async () => {
    (OrderModel.aggregate as jest.Mock).mockResolvedValue([]);
    (ProductModel.find as jest.Mock).mockReturnValue({ lean: jest.fn().mockResolvedValue([]) });
    (CategoryModel.find as jest.Mock).mockReturnValue({ lean: jest.fn().mockResolvedValue([]) });

    const result = await useCase.execute();

    expect(result).toHaveLength(0);
  });
});
