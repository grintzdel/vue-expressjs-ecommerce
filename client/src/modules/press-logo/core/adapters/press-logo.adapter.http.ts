import type { HttpClient } from '@/modules/shared/http/http-client'
import type { IPressLogoPort } from '../ports/press-logo.port'
import type { PressLogoDomainModel } from '../model/press-logo.domain-model'

export class PressLogoHttpAdapter implements IPressLogoPort {
  constructor(private readonly httpClient: HttpClient) {}

  async getAll(): Promise<PressLogoDomainModel.PressLogoOverviewDto[]> {
    const result = await this.httpClient.get<PressLogoDomainModel.PressLogoOverviewDto[]>('/press-logos')
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }

  async create(data: PressLogoDomainModel.CreatePressLogoDto): Promise<PressLogoDomainModel.PressLogoOverviewDto> {
    const result = await this.httpClient.post<PressLogoDomainModel.PressLogoOverviewDto>('/press-logos', data)
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }

  async update(id: string, data: PressLogoDomainModel.UpdatePressLogoDto): Promise<PressLogoDomainModel.PressLogoOverviewDto> {
    const result = await this.httpClient.patch<PressLogoDomainModel.PressLogoOverviewDto>(`/press-logos/${id}`, data)
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }

  async delete(id: string): Promise<void> {
    const result = await this.httpClient.delete(`/press-logos/${id}`)
    if (result.error) throw new Error(result.error.message)
  }
}
