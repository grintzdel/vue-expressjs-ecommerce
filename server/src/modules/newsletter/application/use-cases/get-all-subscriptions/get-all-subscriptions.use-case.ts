import { INewsletterSubscriptionRepository } from "../../../domain/repository/newsletter-subscription.repository.interface";
import { NewsletterSubscriptionEntity } from "../../../domain/entity/newsletter-subscription.entity";

export class GetAllSubscriptionsUseCase {
  constructor(private readonly newsletterRepository: INewsletterSubscriptionRepository) {}

  async execute(): Promise<NewsletterSubscriptionEntity[]> {
    return this.newsletterRepository.findAll();
  }
}
