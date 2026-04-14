import { INewsletterSubscriptionRepository } from "../../domain/repository/newsletter-subscription.repository.interface";
import { NewsletterSubscriptionEntity } from "../../domain/entity/newsletter-subscription.entity";
import { NewsletterSubscriptionModel } from "../schema/newsletter-subscription.schema";

export class NewsletterSubscriptionRepositoryMongooseMongo implements INewsletterSubscriptionRepository {
  private toEntity(doc: any): NewsletterSubscriptionEntity {
    return new NewsletterSubscriptionEntity({
      id: doc._id.toString(),
      email: doc.email,
      subscribedAt: doc.subscribedAt,
      isActive: doc.isActive,
      discountCode: doc.discountCode,
      createdAt: doc.createdAt,
    });
  }

  async findAll(): Promise<NewsletterSubscriptionEntity[]> {
    const docs = await NewsletterSubscriptionModel.find();
    return docs.map((doc) => this.toEntity(doc));
  }

  async findByEmail(email: string): Promise<NewsletterSubscriptionEntity | null> {
    const doc = await NewsletterSubscriptionModel.findOne({ email });
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async create(data: { email: string; subscribedAt: Date; isActive: boolean; discountCode: string | null }): Promise<NewsletterSubscriptionEntity> {
    const doc = await NewsletterSubscriptionModel.create(data);
    return this.toEntity(doc);
  }

  async updateByEmail(email: string, data: Partial<{ isActive: boolean }>): Promise<NewsletterSubscriptionEntity | null> {
    const doc = await NewsletterSubscriptionModel.findOneAndUpdate({ email }, data, { new: true });
    if (!doc) return null;
    return this.toEntity(doc);
  }
}
