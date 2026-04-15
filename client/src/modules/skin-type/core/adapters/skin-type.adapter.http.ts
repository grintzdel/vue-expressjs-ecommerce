import type { HttpClient } from '@/modules/shared/http/http-client'
import type { ISkinTypePort } from '../ports/skin-type.port'
import type { SkinTypeDomainModel } from '../model/skin-type.domain-model'

export class SkinTypeHttpAdapter implements ISkinTypePort {
  constructor(private readonly httpClient: HttpClient) {}

  async getAll(): Promise<SkinTypeDomainModel.SkinTypeOverviewDto[]> {
    const result = await this.httpClient.get<SkinTypeDomainModel.SkinTypeOverviewDto[]>('/skin-types')
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }

  async create(data: SkinTypeDomainModel.CreateSkinTypeDto): Promise<SkinTypeDomainModel.SkinTypeOverviewDto> {
    const result = await this.httpClient.post<SkinTypeDomainModel.SkinTypeOverviewDto>('/skin-types', data)
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }

  async update(id: string, data: SkinTypeDomainModel.UpdateSkinTypeDto): Promise<SkinTypeDomainModel.SkinTypeOverviewDto> {
    const result = await this.httpClient.patch<SkinTypeDomainModel.SkinTypeOverviewDto>(`/skin-types/${id}`, data)
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }

  async delete(id: string): Promise<void> {
    const result = await this.httpClient.delete(`/skin-types/${id}`)
    if (result.error) throw new Error(result.error.message)
  }
}
