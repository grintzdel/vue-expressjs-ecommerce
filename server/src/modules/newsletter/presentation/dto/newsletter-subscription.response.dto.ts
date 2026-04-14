import { NewsletterSubscriptionEntity } from "../../domain/entity/newsletter-subscription.entity";

export class NewsletterSubscriptionResponseDto {
  id: string;
  email: string;
  subscribedAt: Date;
  isActive: boolean;
  discountCode: string | null;
  createdAt: Date;

  constructor(entity: NewsletterSubscriptionEntity) {
    this.id = entity.id;
    this.email = entity.email;
    this.subscribedAt = entity.subscribedAt;
    this.isActive = entity.isActive;
    this.discountCode = entity.discountCode;
    this.createdAt = entity.createdAt;
  }
}
