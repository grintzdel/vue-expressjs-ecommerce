import { SkinDiagnosisEntity } from "../entity/skin-diagnosis.entity";

export interface ISkinDiagnosisRepository {
  findBySessionToken(token: string): Promise<SkinDiagnosisEntity | null>;
  create(data: {
    sessionToken: string;
    answers: { questionId: string; answer: string }[];
    result: string | null;
    recommendedProductIds: string[];
  }): Promise<SkinDiagnosisEntity>;
}
