import type { INewsletterPort } from '../ports/newsletter.port'
import type { NewsletterDomainModel } from '../model/newsletter.domain-model'

const mockSubscriptions: NewsletterDomainModel.SubscriptionOverviewDto[] = [
  {
    id: '1',
    email: 'alice@example.com',
    subscribedAt: '2026-01-20T08:00:00Z',
    isActive: true,
    discountCode: 'WELCOME10',
  },
  {
    id: '2',
    email: 'bob@example.com',
    subscribedAt: '2026-02-14T16:00:00Z',
    isActive: true,
    discountCode: 'WELCOME10',
  },
]

export class NewsletterInMemoryAdapter implements INewsletterPort {
  private subscriptions: NewsletterDomainModel.SubscriptionOverviewDto[] = [...mockSubscriptions]

  async getAll(): Promise<NewsletterDomainModel.SubscriptionOverviewDto[]> {
    return [...this.subscriptions]
  }

  async subscribe(email: string): Promise<void> {
    const existing = this.subscriptions.find((s) => s.email === email)
    if (existing) {
      existing.isActive = true
      return
    }
    this.subscriptions.push({
      id: String(Date.now()),
      email,
      subscribedAt: new Date().toISOString(),
      isActive: true,
      discountCode: 'WELCOME10',
    })
  }

  async unsubscribe(email: string): Promise<void> {
    const subscription = this.subscriptions.find((s) => s.email === email)
    if (subscription) subscription.isActive = false
  }

  async delete(id: string): Promise<void> {
    this.subscriptions = this.subscriptions.filter((s) => s.id !== id)
  }
}
