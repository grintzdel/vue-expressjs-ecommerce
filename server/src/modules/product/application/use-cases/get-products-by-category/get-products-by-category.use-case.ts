import { IProductRepository } from "../../../domain/repository/product.repository.interface";
import { ProductEntity } from "../../../domain/entity/product.entity";

export class GetProductsByCategoryUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(categoryId: string): Promise<ProductEntity[]> {
    return this.productRepository.findByCategory(categoryId);
  }
}
