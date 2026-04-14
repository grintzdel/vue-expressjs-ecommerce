import { Request, Response, NextFunction } from "express";
import { SkinDiagnosisService } from "../../application/services/skin-diagnosis.service";
import { CreateDiagnosisRequestDto } from "../dto/create-diagnosis.request.dto";
import { SkinDiagnosisResponseDto } from "../dto/skin-diagnosis.response.dto";

export class SkinDiagnosisController {
  constructor(private readonly skinDiagnosisService: SkinDiagnosisService) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = new CreateDiagnosisRequestDto(req.body);
      const diagnosis = await this.skinDiagnosisService.createDiagnosis(dto);
      const response = new SkinDiagnosisResponseDto(diagnosis);
      res.status(201).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }

  async getBySessionToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionToken = req.params["sessionToken"] as string;
      const diagnosis = await this.skinDiagnosisService.getDiagnosisByToken(sessionToken);
      const response = new SkinDiagnosisResponseDto(diagnosis);
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }
}
