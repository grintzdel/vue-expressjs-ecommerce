import { GetDiagnosisByTokenUseCase } from "./get-diagnosis-by-token.use-case";
import { ISkinDiagnosisRepository } from "../../../domain/repository/skin-diagnosis.repository.interface";
import { DiagnosisNotFoundError } from "../../../domain/errors/skin-diagnosis.error";
import { SkinDiagnosisEntity } from "../../../domain/entity/skin-diagnosis.entity";

describe("GetDiagnosisByTokenUseCase", () => {
  let useCase: GetDiagnosisByTokenUseCase;
  let mockRepo: jest.Mocked<ISkinDiagnosisRepository>;

  const mockDiagnosis = new SkinDiagnosisEntity({
    id: "diag-1",
    sessionToken: "existing-token",
    answers: [{ questionId: "q1", answer: "dry" }],
    result: "Dry",
    recommendedProductIds: ["prod-2"],
    createdAt: new Date(),
  });

  beforeEach(() => {
    mockRepo = {
      findBySessionToken: jest.fn(),
      create: jest.fn(),
    };
    useCase = new GetDiagnosisByTokenUseCase(mockRepo);
  });

  it("should return the diagnosis when found by session token", async () => {
    mockRepo.findBySessionToken.mockResolvedValue(mockDiagnosis);

    const result = await useCase.execute("existing-token");

    expect(result).toEqual(mockDiagnosis);
    expect(mockRepo.findBySessionToken).toHaveBeenCalledWith("existing-token");
  });

  it("should throw DiagnosisNotFoundError when token does not exist", async () => {
    mockRepo.findBySessionToken.mockResolvedValue(null);

    await expect(useCase.execute("unknown-token")).rejects.toThrow(DiagnosisNotFoundError);
    expect(mockRepo.findBySessionToken).toHaveBeenCalledWith("unknown-token");
  });
});
