import { INewsletterSubscriptionRepository } from "../../../domain/repository/newsletter-subscription.repository.interface";
import { NewsletterSubscriptionEntity } from "../../../domain/entity/newsletter-subscription.entity";
import { AlreadySubscribedError } from "../../../domain/errors/newsletter.error";
import { NEWSLETTER_CONSTANTS } from "../../../domain/constants/newsletter.constant";

function generateDiscountCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let random = "";
  for (let i = 0; i < NEWSLETTER_CONSTANTS.DISCOUNT_CODE_RANDOM_LENGTH; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${NEWSLETTER_CONSTANTS.DISCOUNT_CODE_PREFIX}-${random}`;
}

export class SubscribeUseCase {
  constructor(private readonly newsletterRepository: INewsletterSubscriptionRepository) {}

  async execute(email: string): Promise<NewsletterSubscriptionEntity> {
    const existing = await this.newsletterRepository.findByEmail(email);

    if (existing) {
      if (existing.isActive) {
        throw new AlreadySubscribedError();
      }
      // Reactivate inactive subscription
      const reactivated = await this.newsletterRepository.updateByEmail(email, { isActive: true });
      return reactivated!;
    }

    // Create new subscription with discount code
    return this.newsletterRepository.create({
      email,
      subscribedAt: new Date(),
      isActive: true,
      discountCode: generateDiscountCode(),
    });
  }
}
