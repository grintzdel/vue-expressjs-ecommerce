import { IProductRepository } from "../../../domain/repository/product.repository.interface";
import { ProductNotFoundError } from "../../../domain/errors/product.error";

export class DeleteProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(id: string): Promise<void> {
    const deleted = await this.productRepository.delete(id);
    if (!deleted) {
      throw new ProductNotFoundError();
    }
  }
}
