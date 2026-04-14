import { CreateProductUseCase } from "../use-cases/create-product/create-product.use-case";
import { GetAllProductsUseCase } from "../use-cases/get-all-products/get-all-products.use-case";
import { GetProductBySlugUseCase } from "../use-cases/get-product-by-slug/get-product-by-slug.use-case";
import { GetProductsByCategoryUseCase } from "../use-cases/get-products-by-category/get-products-by-category.use-case";
import { GetFeaturedProductsUseCase } from "../use-cases/get-featured-products/get-featured-products.use-case";
import { UpdateProductUseCase } from "../use-cases/update-product/update-product.use-case";
import { DeleteProductUseCase } from "../use-cases/delete-product/delete-product.use-case";
import { ProductImage } from "../../domain/entity/product.entity";

export class ProductService {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly getAllProductsUseCase: GetAllProductsUseCase,
    private readonly getProductBySlugUseCase: GetProductBySlugUseCase,
    private readonly getProductsByCategoryUseCase: GetProductsByCategoryUseCase,
    private readonly getFeaturedProductsUseCase: GetFeaturedProductsUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase
  ) {}

  async createProduct(input: {
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
  }) {
    return this.createProductUseCase.execute(input);
  }

  async getAllProducts() {
    return this.getAllProductsUseCase.execute();
  }

  async getProductBySlug(slug: string) {
    return this.getProductBySlugUseCase.execute(slug);
  }

  async getProductsByCategory(categoryId: string) {
    return this.getProductsByCategoryUseCase.execute(categoryId);
  }

  async getFeaturedProducts() {
    return this.getFeaturedProductsUseCase.execute();
  }

  async updateProduct(
    id: string,
    input: Partial<{
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
    }>
  ) {
    return this.updateProductUseCase.execute(id, input);
  }

  async deleteProduct(id: string) {
    return this.deleteProductUseCase.execute(id);
  }
}
