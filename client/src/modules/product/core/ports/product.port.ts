import type { ProductDomainModel } from '../model/product.domain-model'

export interface IProductPort {
  getAll(): Promise<ProductDomainModel.ProductOverviewDto[]>
  getBySlug(slug: string): Promise<ProductDomainModel.ProductOverviewDto>
  getFeatured(): Promise<ProductDomainModel.ProductOverviewDto[]>
  create(data: ProductDomainModel.CreateProductDto): Promise<ProductDomainModel.ProductOverviewDto>
  update(id: string, data: ProductDomainModel.UpdateProductDto): Promise<ProductDomainModel.ProductOverviewDto>
  delete(id: string): Promise<void>
}
