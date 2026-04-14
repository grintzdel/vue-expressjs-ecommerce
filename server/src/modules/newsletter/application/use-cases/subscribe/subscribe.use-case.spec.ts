import { SubscribeUseCase } from "./subscribe.use-case";
import { INewsletterSubscriptionRepository } from "../../../domain/repository/newsletter-subscription.repository.interface";
import { AlreadySubscribedError } from "../../../domain/errors/newsletter.error";
import { NewsletterSubscriptionEntity } from "../../../domain/entity/newsletter-subscription.entity";

describe("SubscribeUseCase", () => {
  let useCase: SubscribeUseCase;
  let mockRepo: jest.Mocked<INewsletterSubscriptionRepository>;

  const activeSubscription = new NewsletterSubscriptionEntity({
    id: "1",
    email: "test@example.com",
    subscribedAt: new Date(),
    isActive: true,
    discountCode: "WELCOME10-ABC123",
    createdAt: new Date(),
  });

  const inactiveSubscription = new NewsletterSubscriptionEntity({
    id: "2",
    email: "inactive@example.com",
    subscribedAt: new Date(),
    isActive: false,
    discountCode: "WELCOME10-XYZ789",
    createdAt: new Date(),
  });

  beforeEach(() => {
    mockRepo = {
      findAll: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      updateByEmail: jest.fn(),
    };
    useCase = new SubscribeUseCase(mockRepo);
  });

  it("should create a new subscription when email does not exist", async () => {
    mockRepo.findByEmail.mockResolvedValue(null);
    mockRepo.create.mockResolvedValue(activeSubscription);

    const result = await useCase.execute("test@example.com");

    expect(result).toEqual(activeSubscription);
    expect(mockRepo.findByEmail).toHaveBeenCalledWith("test@example.com");
    expect(mockRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "test@example.com",
        isActive: true,
        discountCode: expect.stringMatching(/^WELCOME10-[A-Z0-9]{6}$/),
      })
    );
  });

  it("should throw AlreadySubscribedError when active subscription exists", async () => {
    mockRepo.findByEmail.mockResolvedValue(activeSubscription);

    await expect(useCase.execute("test@example.com")).rejects.toThrow(AlreadySubscribedError);

    expect(mockRepo.create).not.toHaveBeenCalled();
    expect(mockRepo.updateByEmail).not.toHaveBeenCalled();
  });

  it("should reactivate an inactive subscription", async () => {
    const reactivated = new NewsletterSubscriptionEntity({
      ...inactiveSubscription,
      id: "2",
      email: "inactive@example.com",
      subscribedAt: inactiveSubscription.subscribedAt,
      isActive: true,
      discountCode: inactiveSubscription.discountCode,
      createdAt: inactiveSubscription.createdAt,
    });
    mockRepo.findByEmail.mockResolvedValue(inactiveSubscription);
    mockRepo.updateByEmail.mockResolvedValue(reactivated);

    const result = await useCase.execute("inactive@example.com");

    expect(result.isActive).toBe(true);
    expect(mockRepo.updateByEmail).toHaveBeenCalledWith("inactive@example.com", { isActive: true });
    expect(mockRepo.create).not.toHaveBeenCalled();
  });
});
