import { GetRecentOrdersUseCase } from "./get-recent-orders.use-case";

const mockOrderFind = jest.fn();
const mockUserFind = jest.fn();

jest.mock("../../../../order/infrastructure/schema/order.schema", () => ({
  OrderModel: { find: (...args: unknown[]) => mockOrderFind(...args) },
}));
jest.mock("../../../../auth/infrastructure/schema/user.schema", () => ({
  UserModel: { find: (...args: unknown[]) => mockUserFind(...args) },
}));

describe("GetRecentOrdersUseCase", () => {
  let useCase: GetRecentOrdersUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetRecentOrdersUseCase();
  });

  it("should return formatted recent orders", async () => {
    const mockLean = jest.fn().mockResolvedValue([
      {
        _id: "order1",
        userId: "user1",
        items: [{ productName: "Sérum", quantity: 1, unitPrice: 29.9 }],
        totalAmount: 29.9,
        currency: "EUR",
        status: "delivered",
        createdAt: new Date("2026-04-10"),
      },
    ]);
    mockOrderFind.mockReturnValue({ sort: jest.fn().mockReturnValue({ limit: jest.fn().mockReturnValue({ lean: mockLean }) }) });
    mockUserFind.mockReturnValue({ lean: jest.fn().mockResolvedValue([{ _id: "user1", email: "marie@test.com" }]) });

    const result = await useCase.execute();

    expect(result).toHaveLength(1);
    expect(result[0].clientName).toBe("marie@test.com");
    expect(result[0].products).toBe("Sérum");
    expect(result[0].status).toBe("delivered");
  });

  it("should return empty array when no orders", async () => {
    mockOrderFind.mockReturnValue({ sort: jest.fn().mockReturnValue({ limit: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue([]) }) }) });
    mockUserFind.mockReturnValue({ lean: jest.fn().mockResolvedValue([]) });

    const result = await useCase.execute();

    expect(result).toHaveLength(0);
  });
});
