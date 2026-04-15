import { GetMonthlyRevenueUseCase } from "./get-monthly-revenue.use-case";

jest.mock("../../../../order/infrastructure/schema/order.schema", () => ({
  OrderModel: { aggregate: jest.fn() },
}));

import { OrderModel } from "../../../../order/infrastructure/schema/order.schema";

describe("GetMonthlyRevenueUseCase", () => {
  let useCase: GetMonthlyRevenueUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetMonthlyRevenueUseCase();
  });

  it("should return 12 months starting from January", async () => {
    (OrderModel.aggregate as jest.Mock).mockResolvedValue([
      { _id: { year: new Date().getFullYear(), month: 1 }, amount: 1000 },
      { _id: { year: new Date().getFullYear(), month: 3 }, amount: 2500 },
    ]);

    const result = await useCase.execute();

    expect(result).toHaveLength(12);
    expect(result[0].amount).toBe(1000);
    expect(result[1].amount).toBe(0);
    expect(result[2].amount).toBe(2500);
  });

  it("should return all zeros when no orders", async () => {
    (OrderModel.aggregate as jest.Mock).mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toHaveLength(12);
    expect(result.every((m) => m.amount === 0)).toBe(true);
  });
});
