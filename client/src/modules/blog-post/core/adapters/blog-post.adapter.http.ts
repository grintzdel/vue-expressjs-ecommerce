import type { HttpClient } from '@/modules/shared/http/http-client'
import type { IBlogPostPort } from '../ports/blog-post.port'
import type { BlogPostDomainModel } from '../model/blog-post.domain-model'

export class BlogPostHttpAdapter implements IBlogPostPort {
  constructor(private readonly httpClient: HttpClient) {}

  async getAll(): Promise<BlogPostDomainModel.BlogPostOverviewDto[]> {
    const result = await this.httpClient.get<BlogPostDomainModel.BlogPostOverviewDto[]>('/blog-posts')
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }

  async create(data: BlogPostDomainModel.CreateBlogPostDto): Promise<BlogPostDomainModel.BlogPostOverviewDto> {
    const result = await this.httpClient.post<BlogPostDomainModel.BlogPostOverviewDto>('/blog-posts', data)
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }

  async update(id: string, data: BlogPostDomainModel.UpdateBlogPostDto): Promise<BlogPostDomainModel.BlogPostOverviewDto> {
    const result = await this.httpClient.patch<BlogPostDomainModel.BlogPostOverviewDto>(`/blog-posts/${id}`, data)
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }

  async delete(id: string): Promise<void> {
    const result = await this.httpClient.delete(`/blog-posts/${id}`)
    if (result.error) throw new Error(result.error.message)
  }
}
