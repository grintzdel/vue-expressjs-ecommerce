import type { HttpClient } from '@/modules/shared/http/http-client'
import type { IProductPort } from '../ports/product.port'
import type { ProductDomainModel } from '../model/product.domain-model'

export class ProductHttpAdapter implements IProductPort {
  constructor(private readonly httpClient: HttpClient) {}

  async getAll(): Promise<ProductDomainModel.ProductOverviewDto[]> {
    const result = await this.httpClient.get<ProductDomainModel.ProductOverviewDto[]>('/products')
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }

  async getBySlug(slug: string): Promise<ProductDomainModel.ProductOverviewDto> {
    const result = await this.httpClient.get<ProductDomainModel.ProductOverviewDto>(`/products/${slug}`)
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }

  async getFeatured(): Promise<ProductDomainModel.ProductOverviewDto[]> {
    const result = await this.httpClient.get<ProductDomainModel.ProductOverviewDto[]>('/products/featured')
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }

  async create(data: ProductDomainModel.CreateProductDto): Promise<ProductDomainModel.ProductOverviewDto> {
    const result = await this.httpClient.post<ProductDomainModel.ProductOverviewDto>('/products', data)
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }

  async update(id: string, data: ProductDomainModel.UpdateProductDto): Promise<ProductDomainModel.ProductOverviewDto> {
    const result = await this.httpClient.patch<ProductDomainModel.ProductOverviewDto>(`/products/${id}`, data)
    if (result.error) throw new Error(result.error.message)
    return result.data.data
  }

  async delete(id: string): Promise<void> {
    const result = await this.httpClient.delete(`/products/${id}`)
    if (result.error) throw new Error(result.error.message)
  }
}
