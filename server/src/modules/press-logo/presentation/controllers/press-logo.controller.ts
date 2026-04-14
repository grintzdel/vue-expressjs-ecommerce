import { Request, Response, NextFunction } from "express";
import { PressLogoService } from "../../application/services/press-logo.service";
import { CreatePressLogoRequestDto } from "../dto/create-press-logo.request.dto";
import { UpdatePressLogoRequestDto } from "../dto/update-press-logo.request.dto";
import { PressLogoResponseDto } from "../dto/press-logo.response.dto";

export class PressLogoController {
  constructor(private readonly pressLogoService: PressLogoService) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = new CreatePressLogoRequestDto(req.body);
      const pressLogo = await this.pressLogoService.createPressLogo(dto);
      const response = new PressLogoResponseDto(pressLogo);
      res.status(201).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pressLogos = await this.pressLogoService.getAllPressLogos();
      const response = pressLogos.map((p) => new PressLogoResponseDto(p));
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params["id"] as string;
      const dto = new UpdatePressLogoRequestDto(req.body);
      const pressLogo = await this.pressLogoService.updatePressLogo(id, dto);
      const response = new PressLogoResponseDto(pressLogo);
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params["id"] as string;
      await this.pressLogoService.deletePressLogo(id);
      res.status(200).json({ success: true, data: null });
    } catch (error) {
      next(error);
    }
  }
}
