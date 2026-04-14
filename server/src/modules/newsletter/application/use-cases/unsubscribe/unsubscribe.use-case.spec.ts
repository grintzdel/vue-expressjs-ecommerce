import { UnsubscribeUseCase } from "./unsubscribe.use-case";
import { INewsletterSubscriptionRepository } from "../../../domain/repository/newsletter-subscription.repository.interface";
import { SubscriptionNotFoundError } from "../../../domain/errors/newsletter.error";
import { NewsletterSubscriptionEntity } from "../../../domain/entity/newsletter-subscription.entity";

describe("UnsubscribeUseCase", () => {
  let useCase: UnsubscribeUseCase;
  let mockRepo: jest.Mocked<INewsletterSubscriptionRepository>;

  const activeSubscription = new NewsletterSubscriptionEntity({
    id: "1",
    email: "test@example.com",
    subscribedAt: new Date(),
    isActive: true,
    discountCode: "WELCOME10-ABC123",
    createdAt: new Date(),
  });

  const deactivatedSubscription = new NewsletterSubscriptionEntity({
    id: "1",
    email: "test@example.com",
    subscribedAt: new Date(),
    isActive: false,
    discountCode: "WELCOME10-ABC123",
    createdAt: new Date(),
  });

  beforeEach(() => {
    mockRepo = {
      findAll: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      updateByEmail: jest.fn(),
    };
    useCase = new UnsubscribeUseCase(mockRepo);
  });

  it("should unsubscribe an active subscription", async () => {
    mockRepo.findByEmail.mockResolvedValue(activeSubscription);
    mockRepo.updateByEmail.mockResolvedValue(deactivatedSubscription);

    const result = await useCase.execute("test@example.com");

    expect(result.isActive).toBe(false);
    expect(mockRepo.updateByEmail).toHaveBeenCalledWith("test@example.com", { isActive: false });
  });

  it("should throw SubscriptionNotFoundError when email does not exist", async () => {
    mockRepo.findByEmail.mockResolvedValue(null);

    await expect(useCase.execute("unknown@example.com")).rejects.toThrow(SubscriptionNotFoundError);

    expect(mockRepo.updateByEmail).not.toHaveBeenCalled();
  });
});
