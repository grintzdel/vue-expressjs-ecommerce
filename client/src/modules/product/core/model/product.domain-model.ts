export namespace ProductDomainModel {
  export type ProductImage = {
    url: string
    altText: string
    position: number
  }

  export type ProductOverviewDto = {
    id: string
    name: string
    slug: string
    description?: string
    price: number
    currency: string
    images?: ProductImage[]
    categoryId?: string
    tagIds?: string[]
    skinTypeIds?: string[]
    stockQuantity: number
    isFeatured: boolean
    ingredients?: string
    howToUse?: string
    shippingInfo?: string
    rating?: number
    reviewCount?: number
  }

  export type CreateProductDto = Omit<ProductOverviewDto, 'id'>

  export type UpdateProductDto = Partial<CreateProductDto>
}
