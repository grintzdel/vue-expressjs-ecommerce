import { IProductRepository } from "../../../domain/repository/product.repository.interface";
import { ProductEntity, ProductImage } from "../../../domain/entity/product.entity";
import { ProductAlreadyExistsError } from "../../../domain/errors/product.error";

interface CreateProductInput {
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  images: ProductImage[];
  categoryId: string;
  tagIds: string[];
  skinTypeIds: string[];
  rating: number;
  stockQuantity: number;
  isFeatured: boolean;
  ingredients: string;
  howToUse: string;
  shippingInfo: string;
}

export class CreateProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(input: CreateProductInput): Promise<ProductEntity> {
    const existing = await this.productRepository.findBySlug(input.slug);
    if (existing) {
      throw new ProductAlreadyExistsError();
    }

    return this.productRepository.create(input);
  }
}
