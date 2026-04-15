import { GetTopClientsUseCase } from "./get-top-clients.use-case";

jest.mock("../../../../order/infrastructure/schema/order.schema", () => ({
  OrderModel: { aggregate: jest.fn() },
}));
jest.mock("../../../../auth/infrastructure/schema/user.schema", () => ({
  UserModel: { find: jest.fn().mockReturnValue({ lean: jest.fn() }) },
}));

import { OrderModel } from "../../../../order/infrastructure/schema/order.schema";
import { UserModel } from "../../../../auth/infrastructure/schema/user.schema";

describe("GetTopClientsUseCase", () => {
  let useCase: GetTopClientsUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetTopClientsUseCase();
  });

  it("should return top clients with rank and email", async () => {
    (OrderModel.aggregate as jest.Mock).mockResolvedValue([
      { _id: "u1", ordersCount: 5, totalSpent: 500 },
      { _id: "u2", ordersCount: 3, totalSpent: 300 },
    ]);
    (UserModel.find as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue([
        { _id: "u1", email: "marie@test.com" },
        { _id: "u2", email: "lucas@test.com" },
      ]),
    });

    const result = await useCase.execute();

    expect(result).toHaveLength(2);
    expect(result[0].rank).toBe(1);
    expect(result[0].email).toBe("marie@test.com");
    expect(result[0].totalSpent).toBe(500);
    expect(result[1].rank).toBe(2);
  });

  it("should return empty array when no orders", async () => {
    (OrderModel.aggregate as jest.Mock).mockResolvedValue([]);
    (UserModel.find as jest.Mock).mockReturnValue({ lean: jest.fn().mockResolvedValue([]) });

    const result = await useCase.execute();

    expect(result).toHaveLength(0);
  });
});
