import type { HttpClient } from '@/modules/shared/http/http-client'
import type { ICategoryPort } from '../ports/category.port'
import type { CategoryDomainModel } from '../model/category.domain-model'

export class CategoryHttpAdapter implements ICategoryPort {
  constructor(private readonly httpClient: HttpClient) {}

  async getAll(): Promise<CategoryDomainModel.CategoryOverviewDto[]> {
    const result = await this.httpClient.get<CategoryDomainModel.CategoryOverviewDto[]>('/categories')
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }

  async create(data: CategoryDomainModel.CreateCategoryDto): Promise<CategoryDomainModel.CategoryOverviewDto> {
    const result = await this.httpClient.post<CategoryDomainModel.CategoryOverviewDto>('/categories', data)
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }

  async update(id: string, data: CategoryDomainModel.UpdateCategoryDto): Promise<CategoryDomainModel.CategoryOverviewDto> {
    const result = await this.httpClient.patch<CategoryDomainModel.CategoryOverviewDto>(`/categories/${id}`, data)
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }

  async delete(id: string): Promise<void> {
    const result = await this.httpClient.delete(`/categories/${id}`)
    if (result.error) throw new Error(result.error.message)
  }
}
