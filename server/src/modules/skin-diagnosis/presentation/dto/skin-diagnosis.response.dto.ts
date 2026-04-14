import { SkinDiagnosisEntity } from "../../domain/entity/skin-diagnosis.entity";

export class SkinDiagnosisResponseDto {
  id: string;
  sessionToken: string;
  answers: { questionId: string; answer: string }[];
  result: string | null;
  recommendedProductIds: string[];
  createdAt: Date;

  constructor(entity: SkinDiagnosisEntity) {
    this.id = entity.id;
    this.sessionToken = entity.sessionToken;
    this.answers = entity.answers;
    this.result = entity.result;
    this.recommendedProductIds = entity.recommendedProductIds;
    this.createdAt = entity.createdAt;
  }
}
