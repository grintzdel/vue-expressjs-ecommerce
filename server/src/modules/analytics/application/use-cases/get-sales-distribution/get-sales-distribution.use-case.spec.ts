import { GetSalesDistributionUseCase } from "./get-sales-distribution.use-case";

jest.mock("../../../../order/infrastructure/schema/order.schema", () => ({
  OrderModel: { aggregate: jest.fn() },
}));

import { OrderModel } from "../../../../order/infrastructure/schema/order.schema";

describe("GetSalesDistributionUseCase", () => {
  let useCase: GetSalesDistributionUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetSalesDistributionUseCase();
  });

  it("should return categories with percentages", async () => {
    (OrderModel.aggregate as jest.Mock).mockResolvedValue([
      { _id: "Face", amount: 600 },
      { _id: "Body", amount: 400 },
    ]);

    const result = await useCase.execute();

    expect(result).toHaveLength(2);
    expect(result[0].category).toBe("Face");
    expect(result[0].percentage).toBe(60);
    expect(result[1].category).toBe("Body");
    expect(result[1].percentage).toBe(40);
  });

  it("should return empty array when no sales", async () => {
    (OrderModel.aggregate as jest.Mock).mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toHaveLength(0);
  });
});
