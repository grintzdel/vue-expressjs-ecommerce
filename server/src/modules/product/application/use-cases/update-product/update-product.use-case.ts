import { IProductRepository } from "../../../domain/repository/product.repository.interface";
import { ProductEntity, ProductImage } from "../../../domain/entity/product.entity";
import { ProductNotFoundError } from "../../../domain/errors/product.error";

interface UpdateProductInput {
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  currency?: string;
  images?: ProductImage[];
  categoryId?: string;
  tagIds?: string[];
  skinTypeIds?: string[];
  rating?: number;
  stockQuantity?: number;
  isFeatured?: boolean;
  ingredients?: string;
  howToUse?: string;
  shippingInfo?: string;
}

export class UpdateProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(id: string, input: UpdateProductInput): Promise<ProductEntity> {
    const updated = await this.productRepository.update(id, input);
    if (!updated) {
      throw new ProductNotFoundError();
    }
    return updated;
  }
}
