import { Request, Response, NextFunction } from "express";
import { CategoryService } from "../../application/services/category.service";
import { CreateCategoryRequestDto } from "../dto/create-category.request.dto";
import { UpdateCategoryRequestDto } from "../dto/update-category.request.dto";
import { CategoryResponseDto } from "../dto/category.response.dto";

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = new CreateCategoryRequestDto(req.body);
      const category = await this.categoryService.createCategory(dto);
      const response = new CategoryResponseDto(category);
      res.status(201).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await this.categoryService.getAllCategories();
      const response = categories.map((c) => new CategoryResponseDto(c));
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params["slug"] as string;
      const category = await this.categoryService.getCategoryBySlug(slug);
      const response = new CategoryResponseDto(category);
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params["id"] as string;
      const dto = new UpdateCategoryRequestDto(req.body);
      const category = await this.categoryService.updateCategory(id, dto);
      const response = new CategoryResponseDto(category);
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params["id"] as string;
      await this.categoryService.deleteCategory(id);
      res.status(200).json({ success: true, data: null });
    } catch (error) {
      next(error);
    }
  }
}
