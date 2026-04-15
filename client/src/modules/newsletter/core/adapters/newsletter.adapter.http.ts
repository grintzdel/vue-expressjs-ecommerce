import type { HttpClient } from '@/modules/shared/http/http-client'
import type { INewsletterPort } from '../ports/newsletter.port'
import type { NewsletterDomainModel } from '../model/newsletter.domain-model'

export class NewsletterHttpAdapter implements INewsletterPort {
  constructor(private readonly httpClient: HttpClient) {}

  async getAll(): Promise<NewsletterDomainModel.SubscriptionOverviewDto[]> {
    const result = await this.httpClient.get<NewsletterDomainModel.SubscriptionOverviewDto[]>('/newsletter')
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }

  async subscribe(email: string): Promise<void> {
    const result = await this.httpClient.post('/newsletter/subscribe', { email })
    if (result.error) throw new Error(result.error.message)
  }

  async unsubscribe(email: string): Promise<void> {
    const result = await this.httpClient.post('/newsletter/unsubscribe', { email })
    if (result.error) throw new Error(result.error.message)
  }

  async delete(id: string): Promise<void> {
    const result = await this.httpClient.delete(`/newsletter/${id}`)
    if (result.error) throw new Error(result.error.message)
  }
}
