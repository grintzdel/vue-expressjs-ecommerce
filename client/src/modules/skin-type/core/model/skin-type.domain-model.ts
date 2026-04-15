export namespace SkinTypeDomainModel {
  export type SkinTypeOverviewDto = {
    id: string
    name: string
    slug: string
  }

  export type CreateSkinTypeDto = {
    name: string
    slug: string
  }

  export type UpdateSkinTypeDto = Partial<CreateSkinTypeDto>
}
