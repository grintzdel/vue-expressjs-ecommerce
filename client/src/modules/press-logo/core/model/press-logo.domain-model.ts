export namespace PressLogoDomainModel {
  export type PressLogoOverviewDto = {
    id: string
    name: string
    logoUrl: string
    link: string
    position: number
  }

  export type CreatePressLogoDto = {
    name: string
    logoUrl: string
    link: string
    position: number
  }

  export type UpdatePressLogoDto = Partial<CreatePressLogoDto>
}
