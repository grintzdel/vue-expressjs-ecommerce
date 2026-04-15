import { GetKpisUseCase } from "./get-kpis.use-case";

jest.mock("../../../../order/infrastructure/schema/order.schema", () => ({
  OrderModel: {
    countDocuments: jest.fn(),
    aggregate: jest.fn(),
  },
}));
jest.mock("../../../../auth/infrastructure/schema/user.schema", () => ({
  UserModel: { countDocuments: jest.fn() },
}));
jest.mock("../../../../newsletter/infrastructure/schema/newsletter-subscription.schema", () => ({
  NewsletterSubscriptionModel: { countDocuments: jest.fn() },
}));

import { OrderModel } from "../../../../order/infrastructure/schema/order.schema";
import { UserModel } from "../../../../auth/infrastructure/schema/user.schema";
import { NewsletterSubscriptionModel } from "../../../../newsletter/infrastructure/schema/newsletter-subscription.schema";

describe("GetKpisUseCase", () => {
  let useCase: GetKpisUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetKpisUseCase();
  });

  it("should return kpis with totals and change percentages", async () => {
    (NewsletterSubscriptionModel.countDocuments as jest.Mock)
      .mockResolvedValueOnce(100)
      .mockResolvedValueOnce(20)
      .mockResolvedValueOnce(10);
    (OrderModel.countDocuments as jest.Mock)
      .mockResolvedValueOnce(50)
      .mockResolvedValueOnce(15)
      .mockResolvedValueOnce(12);
    (OrderModel.aggregate as jest.Mock)
      .mockResolvedValueOnce([{ total: 5000 }])
      .mockResolvedValueOnce([{ total: 3000 }]);
    (UserModel.countDocuments as jest.Mock)
      .mockResolvedValueOnce(200)
      .mockResolvedValueOnce(30)
      .mockResolvedValueOnce(25);

    const result = await useCase.execute();

    expect(result.newsletter.total).toBe(100);
    expect(result.orders.total).toBe(50);
    expect(result.revenue.total).toBe(5000);
    expect(result.clients.total).toBe(200);
    expect(typeof result.newsletter.changePercent).toBe("number");
    expect(typeof result.orders.changePercent).toBe("number");
  });

  it("should handle zero previous month gracefully", async () => {
    (NewsletterSubscriptionModel.countDocuments as jest.Mock)
      .mockResolvedValueOnce(10)
      .mockResolvedValueOnce(5)
      .mockResolvedValueOnce(0);
    (OrderModel.countDocuments as jest.Mock)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0);
    (OrderModel.aggregate as jest.Mock)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);
    (UserModel.countDocuments as jest.Mock)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0);

    const result = await useCase.execute();

    expect(result.newsletter.changePercent).toBe(100);
    expect(result.revenue.total).toBe(0);
  });
});
