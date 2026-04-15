import type { HttpClient } from '@/modules/shared/http/http-client'
import type { IPageContentPort } from '../ports/page-content.port'
import type { PageContentDomainModel } from '../model/page-content.domain-model'

export class PageContentHttpAdapter implements IPageContentPort {
  constructor(private readonly httpClient: HttpClient) {}

  async getAll(): Promise<PageContentDomainModel.PageContentOverviewDto[]> {
    const result = await this.httpClient.get<PageContentDomainModel.PageContentOverviewDto[]>('/pages')
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }

  async create(data: PageContentDomainModel.CreatePageContentDto): Promise<PageContentDomainModel.PageContentOverviewDto> {
    const result = await this.httpClient.post<PageContentDomainModel.PageContentOverviewDto>('/pages', data)
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }

  async update(id: string, data: PageContentDomainModel.UpdatePageContentDto): Promise<PageContentDomainModel.PageContentOverviewDto> {
    const result = await this.httpClient.patch<PageContentDomainModel.PageContentOverviewDto>(`/pages/${id}`, data)
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }

  async delete(id: string): Promise<void> {
    const result = await this.httpClient.delete(`/pages/${id}`)
    if (result.error) throw new Error(result.error.message)
  }
}
