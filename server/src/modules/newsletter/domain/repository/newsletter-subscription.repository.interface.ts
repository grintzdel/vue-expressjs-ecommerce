import { NewsletterSubscriptionEntity } from "../entity/newsletter-subscription.entity";

export interface INewsletterSubscriptionRepository {
  findAll(): Promise<NewsletterSubscriptionEntity[]>;
  findByEmail(email: string): Promise<NewsletterSubscriptionEntity | null>;
  create(data: { email: string; subscribedAt: Date; isActive: boolean; discountCode: string | null }): Promise<NewsletterSubscriptionEntity>;
  updateByEmail(email: string, data: Partial<{ isActive: boolean }>): Promise<NewsletterSubscriptionEntity | null>;
}
