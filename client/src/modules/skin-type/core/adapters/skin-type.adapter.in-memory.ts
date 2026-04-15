import type { ISkinTypePort } from '../ports/skin-type.port'
import type { SkinTypeDomainModel } from '../model/skin-type.domain-model'

const mockSkinTypes: SkinTypeDomainModel.SkinTypeOverviewDto[] = [
  { id: '1', name: 'Peau sèche', slug: 'peau-seche' },
  { id: '2', name: 'Peau grasse', slug: 'peau-grasse' },
  { id: '3', name: 'Peau mixte', slug: 'peau-mixte' },
]

export class SkinTypeInMemoryAdapter implements ISkinTypePort {
  private skinTypes: SkinTypeDomainModel.SkinTypeOverviewDto[] = [...mockSkinTypes]

  async getAll(): Promise<SkinTypeDomainModel.SkinTypeOverviewDto[]> {
    return [...this.skinTypes]
  }

  async create(data: SkinTypeDomainModel.CreateSkinTypeDto): Promise<SkinTypeDomainModel.SkinTypeOverviewDto> {
    const newSkinType: SkinTypeDomainModel.SkinTypeOverviewDto = {
      id: String(Date.now()),
      ...data,
    }
    this.skinTypes.push(newSkinType)
    return newSkinType
  }

  async update(id: string, data: SkinTypeDomainModel.UpdateSkinTypeDto): Promise<SkinTypeDomainModel.SkinTypeOverviewDto> {
    const index = this.skinTypes.findIndex((s) => s.id === id)
    if (index === -1) throw new Error(`SkinType with id ${id} not found`)
    this.skinTypes[index] = { ...this.skinTypes[index], ...data }
    return this.skinTypes[index]
  }

  async delete(id: string): Promise<void> {
    this.skinTypes = this.skinTypes.filter((s) => s.id !== id)
  }
}
