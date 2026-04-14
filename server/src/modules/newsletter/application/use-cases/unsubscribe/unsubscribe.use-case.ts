import { INewsletterSubscriptionRepository } from "../../../domain/repository/newsletter-subscription.repository.interface";
import { NewsletterSubscriptionEntity } from "../../../domain/entity/newsletter-subscription.entity";
import { SubscriptionNotFoundError } from "../../../domain/errors/newsletter.error";

export class UnsubscribeUseCase {
  constructor(private readonly newsletterRepository: INewsletterSubscriptionRepository) {}

  async execute(email: string): Promise<NewsletterSubscriptionEntity> {
    const existing = await this.newsletterRepository.findByEmail(email);

    if (!existing) {
      throw new SubscriptionNotFoundError();
    }

    const updated = await this.newsletterRepository.updateByEmail(email, { isActive: false });
    return updated!;
  }
}
