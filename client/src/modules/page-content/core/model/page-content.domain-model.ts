export namespace PageContentDomainModel {
  export type PageContentOverviewDto = {
    id: string
    title: string
    slug: string
    content: string
    seoMeta: {
      title: string
      description: string
    }
    isPublished: boolean
  }

  export type CreatePageContentDto = Omit<PageContentOverviewDto, 'id'>

  export type UpdatePageContentDto = Partial<CreatePageContentDto>
}
