import type { NewsletterDomainModel } from '../model/newsletter.domain-model'

export interface INewsletterPort {
  getAll(): Promise<NewsletterDomainModel.SubscriptionOverviewDto[]>
  subscribe(email: string): Promise<void>
  unsubscribe(email: string): Promise<void>
  delete(id: string): Promise<void>
}
