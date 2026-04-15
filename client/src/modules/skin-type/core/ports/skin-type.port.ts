import type { SkinTypeDomainModel } from '../model/skin-type.domain-model'

export interface ISkinTypePort {
  getAll(): Promise<SkinTypeDomainModel.SkinTypeOverviewDto[]>
  create(data: SkinTypeDomainModel.CreateSkinTypeDto): Promise<SkinTypeDomainModel.SkinTypeOverviewDto>
  update(id: string, data: SkinTypeDomainModel.UpdateSkinTypeDto): Promise<SkinTypeDomainModel.SkinTypeOverviewDto>
  delete(id: string): Promise<void>
}
