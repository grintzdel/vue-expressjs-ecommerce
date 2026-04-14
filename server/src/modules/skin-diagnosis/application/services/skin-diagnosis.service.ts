import { CreateDiagnosisUseCase } from "../use-cases/create-diagnosis/create-diagnosis.use-case";
import { GetDiagnosisByTokenUseCase } from "../use-cases/get-diagnosis-by-token/get-diagnosis-by-token.use-case";

export class SkinDiagnosisService {
  constructor(
    private readonly createDiagnosisUseCase: CreateDiagnosisUseCase,
    private readonly getDiagnosisByTokenUseCase: GetDiagnosisByTokenUseCase
  ) {}

  async createDiagnosis(input: {
    answers: { questionId: string; answer: string }[];
    result: string | null;
    recommendedProductIds: string[];
  }) {
    return this.createDiagnosisUseCase.execute(input);
  }

  async getDiagnosisByToken(sessionToken: string) {
    return this.getDiagnosisByTokenUseCase.execute(sessionToken);
  }
}
