export namespace TagDomainModel {
  export type TagOverviewDto = {
    id: string
    name: string
    slug: string
  }

  export type CreateTagDto = {
    name: string
    slug: string
  }

  export type UpdateTagDto = Partial<CreateTagDto>
}
