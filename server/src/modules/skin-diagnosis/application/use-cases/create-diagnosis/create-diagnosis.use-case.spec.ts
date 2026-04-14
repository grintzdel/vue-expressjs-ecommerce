import { CreateDiagnosisUseCase } from "./create-diagnosis.use-case";
import { ISkinDiagnosisRepository } from "../../../domain/repository/skin-diagnosis.repository.interface";
import { SkinDiagnosisEntity } from "../../../domain/entity/skin-diagnosis.entity";

describe("CreateDiagnosisUseCase", () => {
  let useCase: CreateDiagnosisUseCase;
  let mockRepo: jest.Mocked<ISkinDiagnosisRepository>;

  const mockDiagnosis = new SkinDiagnosisEntity({
    id: "diag-1",
    sessionToken: "generated-uuid",
    answers: [{ questionId: "q1", answer: "oily" }],
    result: "Oily",
    recommendedProductIds: ["prod-1"],
    createdAt: new Date(),
  });

  beforeEach(() => {
    mockRepo = {
      findBySessionToken: jest.fn(),
      create: jest.fn(),
    };
    useCase = new CreateDiagnosisUseCase(mockRepo);
  });

  it("should create a diagnosis with a generated session token", async () => {
    mockRepo.create.mockResolvedValue(mockDiagnosis);

    const result = await useCase.execute({
      answers: [{ questionId: "q1", answer: "oily" }],
      result: "Oily",
      recommendedProductIds: ["prod-1"],
    });

    expect(result).toEqual(mockDiagnosis);
    expect(mockRepo.create).toHaveBeenCalledTimes(1);
    const callArg = mockRepo.create.mock.calls[0][0];
    expect(callArg.sessionToken).toBeDefined();
    expect(typeof callArg.sessionToken).toBe("string");
    expect(callArg.answers).toEqual([{ questionId: "q1", answer: "oily" }]);
    expect(callArg.result).toBe("Oily");
    expect(callArg.recommendedProductIds).toEqual(["prod-1"]);
  });

  it("should create a diagnosis with null result", async () => {
    const diagnosisWithNullResult = new SkinDiagnosisEntity({
      id: "diag-2",
      sessionToken: "generated-uuid-2",
      answers: [],
      result: null,
      recommendedProductIds: [],
      createdAt: new Date(),
    });
    mockRepo.create.mockResolvedValue(diagnosisWithNullResult);

    const result = await useCase.execute({
      answers: [],
      result: null,
      recommendedProductIds: [],
    });

    expect(result.result).toBeNull();
  });

  it("should generate a unique session token each time", async () => {
    mockRepo.create.mockResolvedValue(mockDiagnosis);

    await useCase.execute({ answers: [], result: null, recommendedProductIds: [] });
    await useCase.execute({ answers: [], result: null, recommendedProductIds: [] });

    const token1 = mockRepo.create.mock.calls[0][0].sessionToken;
    const token2 = mockRepo.create.mock.calls[1][0].sessionToken;
    expect(token1).not.toBe(token2);
  });
});
