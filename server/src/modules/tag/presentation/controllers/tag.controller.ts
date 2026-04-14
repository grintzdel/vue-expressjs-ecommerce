import { Request, Response, NextFunction } from "express";
import { TagService } from "../../application/services/tag.service";
import { CreateTagRequestDto } from "../dto/create-tag.request.dto";
import { UpdateTagRequestDto } from "../dto/update-tag.request.dto";
import { TagResponseDto } from "../dto/tag.response.dto";

export class TagController {
  constructor(private readonly tagService: TagService) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = new CreateTagRequestDto(req.body);
      const tag = await this.tagService.createTag(dto);
      const response = new TagResponseDto(tag);
      res.status(201).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tags = await this.tagService.getAllTags();
      const response = tags.map((tag) => new TagResponseDto(tag));
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tag = await this.tagService.getTagBySlug(req.params.slug as string);
      const response = new TagResponseDto(tag);
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = new UpdateTagRequestDto(req.body);
      const tag = await this.tagService.updateTag(req.params.id as string, dto);
      const response = new TagResponseDto(tag);
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.tagService.deleteTag(req.params.id as string);
      res.status(200).json({ success: true, data: null });
    } catch (error) {
      next(error);
    }
  }
}
