import { Request, Response, NextFunction } from "express";
import { SkinTypeService } from "../../application/services/skin-type.service";
import { CreateSkinTypeRequestDto } from "../dto/create-skin-type.request.dto";
import { UpdateSkinTypeRequestDto } from "../dto/update-skin-type.request.dto";
import { SkinTypeResponseDto } from "../dto/skin-type.response.dto";

export class SkinTypeController {
  constructor(private readonly skinTypeService: SkinTypeService) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = new CreateSkinTypeRequestDto(req.body);
      const result = await this.skinTypeService.create(dto);
      const response = new SkinTypeResponseDto(result);
      res.status(201).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const results = await this.skinTypeService.getAll();
      const response = results.map((r) => new SkinTypeResponseDto(r));
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params["slug"] as string;
      const result = await this.skinTypeService.getBySlug(slug);
      const response = new SkinTypeResponseDto(result);
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params["id"] as string;
      const dto = new UpdateSkinTypeRequestDto(req.body);
      const result = await this.skinTypeService.update(id, dto);
      const response = new SkinTypeResponseDto(result);
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params["id"] as string;
      await this.skinTypeService.delete(id);
      res.status(200).json({ success: true, data: null });
    } catch (error) {
      next(error);
    }
  }
}
