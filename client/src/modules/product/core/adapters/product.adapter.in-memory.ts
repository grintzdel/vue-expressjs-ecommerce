import type { IProductPort } from '../ports/product.port'
import type { ProductDomainModel } from '../model/product.domain-model'

const mockProducts: ProductDomainModel.ProductOverviewDto[] = [
  {
    id: '1',
    name: 'Crème hydratante visage',
    slug: 'creme-hydratante-visage',
    description: 'Une crème légère et nourrissante pour le visage',
    price: 29.99,
    currency: 'EUR',
    categoryId: '1',
    stockQuantity: 50,
    isFeatured: true,
    rating: 4.5,
    reviewCount: 12,
  },
  {
    id: '2',
    name: 'Huile corps bio',
    slug: 'huile-corps-bio',
    description: 'Huile végétale bio pour un corps hydraté',
    price: 24.99,
    currency: 'EUR',
    categoryId: '2',
    stockQuantity: 35,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 8,
  },
  {
    id: '3',
    name: 'Sérum anti-âge',
    slug: 'serum-anti-age',
    description: 'Sérum concentré pour lutter contre les signes du temps',
    price: 49.99,
    currency: 'EUR',
    categoryId: '1',
    stockQuantity: 20,
    isFeatured: false,
    rating: 4.2,
    reviewCount: 5,
  },
]

export class ProductInMemoryAdapter implements IProductPort {
  private products: ProductDomainModel.ProductOverviewDto[] = [...mockProducts]

  async getAll(): Promise<ProductDomainModel.ProductOverviewDto[]> {
    return [...this.products]
  }

  async getBySlug(slug: string): Promise<ProductDomainModel.ProductOverviewDto> {
    const product = this.products.find((p) => p.slug === slug)
    if (!product) throw new Error(`Product with slug ${slug} not found`)
    return product
  }

  async getFeatured(): Promise<ProductDomainModel.ProductOverviewDto[]> {
    return this.products.filter((p) => p.isFeatured)
  }

  async create(data: ProductDomainModel.CreateProductDto): Promise<ProductDomainModel.ProductOverviewDto> {
    const newProduct: ProductDomainModel.ProductOverviewDto = {
      id: String(Date.now()),
      ...data,
    }
    this.products.push(newProduct)
    return newProduct
  }

  async update(id: string, data: ProductDomainModel.UpdateProductDto): Promise<ProductDomainModel.ProductOverviewDto> {
    const index = this.products.findIndex((p) => p.id === id)
    if (index === -1) throw new Error(`Product with id ${id} not found`)
    this.products[index] = { ...this.products[index], ...data }
    return this.products[index]
  }

  async delete(id: string): Promise<void> {
    this.products = this.products.filter((p) => p.id !== id)
  }
}
