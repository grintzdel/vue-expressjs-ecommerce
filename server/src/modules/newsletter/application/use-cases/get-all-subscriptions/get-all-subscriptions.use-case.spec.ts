import { GetAllSubscriptionsUseCase } from "./get-all-subscriptions.use-case";
import { INewsletterSubscriptionRepository } from "../../../domain/repository/newsletter-subscription.repository.interface";
import { NewsletterSubscriptionEntity } from "../../../domain/entity/newsletter-subscription.entity";

describe("GetAllSubscriptionsUseCase", () => {
  let useCase: GetAllSubscriptionsUseCase;
  let mockRepo: jest.Mocked<INewsletterSubscriptionRepository>;

  const mockSubscriptions = [
    new NewsletterSubscriptionEntity({
      id: "1",
      email: "a@example.com",
      subscribedAt: new Date(),
      isActive: true,
      discountCode: "WELCOME10-ABC123",
      createdAt: new Date(),
    }),
    new NewsletterSubscriptionEntity({
      id: "2",
      email: "b@example.com",
      subscribedAt: new Date(),
      isActive: false,
      discountCode: null,
      createdAt: new Date(),
    }),
  ];

  beforeEach(() => {
    mockRepo = {
      findAll: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      updateByEmail: jest.fn(),
    };
    useCase = new GetAllSubscriptionsUseCase(mockRepo);
  });

  it("should return all subscriptions", async () => {
    mockRepo.findAll.mockResolvedValue(mockSubscriptions);

    const result = await useCase.execute();

    expect(result).toHaveLength(2);
    expect(result).toEqual(mockSubscriptions);
    expect(mockRepo.findAll).toHaveBeenCalled();
  });

  it("should return empty array when no subscriptions exist", async () => {
    mockRepo.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toHaveLength(0);
  });
});
