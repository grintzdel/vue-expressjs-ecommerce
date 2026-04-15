import type { PressLogoDomainModel } from '../model/press-logo.domain-model'

export interface IPressLogoPort {
  getAll(): Promise<PressLogoDomainModel.PressLogoOverviewDto[]>
  create(data: PressLogoDomainModel.CreatePressLogoDto): Promise<PressLogoDomainModel.PressLogoOverviewDto>
  update(id: string, data: PressLogoDomainModel.UpdatePressLogoDto): Promise<PressLogoDomainModel.PressLogoOverviewDto>
  delete(id: string): Promise<void>
}
