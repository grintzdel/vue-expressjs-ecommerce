import { NewsletterService } from "./newsletter.service";
import { SubscribeUseCase } from "../use-cases/subscribe/subscribe.use-case";
import { UnsubscribeUseCase } from "../use-cases/unsubscribe/unsubscribe.use-case";
import { GetAllSubscriptionsUseCase } from "../use-cases/get-all-subscriptions/get-all-subscriptions.use-case";
import { NewsletterSubscriptionEntity } from "../../domain/entity/newsletter-subscription.entity";

describe("NewsletterService", () => {
  let service: NewsletterService;
  let mockSubscribe: jest.Mocked<SubscribeUseCase>;
  let mockUnsubscribe: jest.Mocked<UnsubscribeUseCase>;
  let mockGetAll: jest.Mocked<GetAllSubscriptionsUseCase>;

  const mockSubscription = new NewsletterSubscriptionEntity({
    id: "1",
    email: "test@example.com",
    subscribedAt: new Date(),
    isActive: true,
    discountCode: "WELCOME10-ABC123",
    createdAt: new Date(),
  });

  beforeEach(() => {
    mockSubscribe = { execute: jest.fn() } as any;
    mockUnsubscribe = { execute: jest.fn() } as any;
    mockGetAll = { execute: jest.fn() } as any;

    service = new NewsletterService(mockSubscribe, mockUnsubscribe, mockGetAll);
  });

  it("should delegate subscribe to SubscribeUseCase", async () => {
    mockSubscribe.execute.mockResolvedValue(mockSubscription);

    const result = await service.subscribe("test@example.com");

    expect(result).toEqual(mockSubscription);
    expect(mockSubscribe.execute).toHaveBeenCalledWith("test@example.com");
  });

  it("should delegate unsubscribe to UnsubscribeUseCase", async () => {
    const inactiveSubscription = new NewsletterSubscriptionEntity({
      ...mockSubscription,
      id: "1",
      email: "test@example.com",
      subscribedAt: mockSubscription.subscribedAt,
      isActive: false,
      discountCode: mockSubscription.discountCode,
      createdAt: mockSubscription.createdAt,
    });
    mockUnsubscribe.execute.mockResolvedValue(inactiveSubscription);

    const result = await service.unsubscribe("test@example.com");

    expect(result.isActive).toBe(false);
    expect(mockUnsubscribe.execute).toHaveBeenCalledWith("test@example.com");
  });

  it("should delegate getAllSubscriptions to GetAllSubscriptionsUseCase", async () => {
    mockGetAll.execute.mockResolvedValue([mockSubscription]);

    const result = await service.getAllSubscriptions();

    expect(result).toHaveLength(1);
    expect(mockGetAll.execute).toHaveBeenCalled();
  });
});
