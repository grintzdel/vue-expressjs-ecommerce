import { Request, Response, NextFunction } from "express";
import { ProductService } from "../../application/services/product.service";
import { CreateProductRequestDto } from "../dto/create-product.request.dto";
import { UpdateProductRequestDto } from "../dto/update-product.request.dto";
import { ProductResponseDto } from "../dto/product.response.dto";

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = new CreateProductRequestDto(req.body);
      const product = await this.productService.createProduct(dto);
      const response = new ProductResponseDto(product);
      res.status(201).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const products = await this.productService.getAllProducts();
      const response = products.map((p) => new ProductResponseDto(p));
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params["slug"] as string;
      const product = await this.productService.getProductBySlug(slug);
      const response = new ProductResponseDto(product);
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async getByCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categoryId = req.params["categoryId"] as string;
      const products = await this.productService.getProductsByCategory(categoryId);
      const response = products.map((p) => new ProductResponseDto(p));
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async getFeatured(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const products = await this.productService.getFeaturedProducts();
      const response = products.map((p) => new ProductResponseDto(p));
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params["id"] as string;
      const dto = new UpdateProductRequestDto(req.body);
      const product = await this.productService.updateProduct(id, dto);
      const response = new ProductResponseDto(product);
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params["id"] as string;
      await this.productService.deleteProduct(id);
      res.status(200).json({ success: true, data: null });
    } catch (error) {
      next(error);
    }
  }
}
