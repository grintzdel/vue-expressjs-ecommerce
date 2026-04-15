import type { PageContentDomainModel } from '../model/page-content.domain-model'

export interface IPageContentPort {
  getAll(): Promise<PageContentDomainModel.PageContentOverviewDto[]>
  create(data: PageContentDomainModel.CreatePageContentDto): Promise<PageContentDomainModel.PageContentOverviewDto>
  update(id: string, data: PageContentDomainModel.UpdatePageContentDto): Promise<PageContentDomainModel.PageContentOverviewDto>
  delete(id: string): Promise<void>
}
