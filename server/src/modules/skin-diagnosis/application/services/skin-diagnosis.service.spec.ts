import { SkinDiagnosisService } from "./skin-diagnosis.service";
import { CreateDiagnosisUseCase } from "../use-cases/create-diagnosis/create-diagnosis.use-case";
import { GetDiagnosisByTokenUseCase } from "../use-cases/get-diagnosis-by-token/get-diagnosis-by-token.use-case";
import { SkinDiagnosisEntity } from "../../domain/entity/skin-diagnosis.entity";

describe("SkinDiagnosisService", () => {
  let service: SkinDiagnosisService;
  let mockCreate: jest.Mocked<CreateDiagnosisUseCase>;
  let mockGetByToken: jest.Mocked<GetDiagnosisByTokenUseCase>;

  const mockDiagnosis = new SkinDiagnosisEntity({
    id: "diag-1",
    sessionToken: "token-xyz",
    answers: [{ questionId: "q1", answer: "normal" }],
    result: "Normal",
    recommendedProductIds: [],
    createdAt: new Date(),
  });

  beforeEach(() => {
    mockCreate = { execute: jest.fn() } as any;
    mockGetByToken = { execute: jest.fn() } as any;

    service = new SkinDiagnosisService(mockCreate, mockGetByToken);
  });

  it("should delegate createDiagnosis to CreateDiagnosisUseCase", async () => {
    mockCreate.execute.mockResolvedValue(mockDiagnosis);

    const input = {
      answers: [{ questionId: "q1", answer: "normal" }],
      result: "Normal",
      recommendedProductIds: [],
    };

    const result = await service.createDiagnosis(input);

    expect(result).toEqual(mockDiagnosis);
    expect(mockCreate.execute).toHaveBeenCalledWith(input);
  });

  it("should delegate getDiagnosisByToken to GetDiagnosisByTokenUseCase", async () => {
    mockGetByToken.execute.mockResolvedValue(mockDiagnosis);

    const result = await service.getDiagnosisByToken("token-xyz");

    expect(result).toEqual(mockDiagnosis);
    expect(mockGetByToken.execute).toHaveBeenCalledWith("token-xyz");
  });
});
