import { SkinDiagnosisController } from "./skin-diagnosis.controller";
import { SkinDiagnosisService } from "../../application/services/skin-diagnosis.service";
import { SkinDiagnosisEntity } from "../../domain/entity/skin-diagnosis.entity";
import { DiagnosisNotFoundError } from "../../domain/errors/skin-diagnosis.error";
import { Request, Response, NextFunction } from "express";

describe("SkinDiagnosisController", () => {
  let controller: SkinDiagnosisController;
  let mockService: jest.Mocked<SkinDiagnosisService>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  const mockDiagnosis = new SkinDiagnosisEntity({
    id: "diag-1",
    sessionToken: "token-abc",
    answers: [{ questionId: "q1", answer: "oily" }],
    result: "Oily",
    recommendedProductIds: ["prod-1"],
    createdAt: new Date(),
  });

  beforeEach(() => {
    mockService = {
      createDiagnosis: jest.fn(),
      getDiagnosisByToken: jest.fn(),
    } as any;

    controller = new SkinDiagnosisController(mockService);
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  describe("create", () => {
    it("should return 201 on successful creation", async () => {
      const mockReq = {
        body: {
          answers: [{ questionId: "q1", answer: "oily" }],
          result: "Oily",
          recommendedProductIds: ["prod-1"],
        },
      } as Request;
      mockService.createDiagnosis.mockResolvedValue(mockDiagnosis);

      await controller.create(mockReq, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({ sessionToken: "token-abc" }),
      });
    });

    it("should call next on error", async () => {
      const mockReq = { body: {} } as Request;
      const error = new Error("fail");
      mockService.createDiagnosis.mockRejectedValue(error);

      await controller.create(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("getBySessionToken", () => {
    it("should return 200 with diagnosis by session token", async () => {
      const mockReq = { params: { sessionToken: "token-abc" } } as unknown as Request;
      mockService.getDiagnosisByToken.mockResolvedValue(mockDiagnosis);

      await controller.getBySessionToken(mockReq, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({ sessionToken: "token-abc" }),
      });
    });

    it("should call next with DiagnosisNotFoundError when not found", async () => {
      const mockReq = { params: { sessionToken: "unknown" } } as unknown as Request;
      const error = new DiagnosisNotFoundError();
      mockService.getDiagnosisByToken.mockRejectedValue(error);

      await controller.getBySessionToken(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
