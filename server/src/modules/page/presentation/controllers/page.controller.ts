import { Request, Response, NextFunction } from "express";
import { PageService } from "../../application/services/page.service";
import { CreatePageRequestDto } from "../dto/create-page.request.dto";
import { UpdatePageRequestDto } from "../dto/update-page.request.dto";
import { PageResponseDto } from "../dto/page.response.dto";

export class PageController {
  constructor(private readonly pageService: PageService) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = new CreatePageRequestDto(req.body);
      const page = await this.pageService.createPage(dto);
      const response = new PageResponseDto(page);
      res.status(201).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pages = await this.pageService.getAllPages();
      const response = pages.map((p) => new PageResponseDto(p));
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params["slug"] as string;
      const page = await this.pageService.getPageBySlug(slug);
      const response = new PageResponseDto(page);
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params["id"] as string;
      const dto = new UpdatePageRequestDto(req.body);
      const page = await this.pageService.updatePage(id, dto);
      const response = new PageResponseDto(page);
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params["id"] as string;
      await this.pageService.deletePage(id);
      res.status(200).json({ success: true, data: null });
    } catch (error) {
      next(error);
    }
  }
}
