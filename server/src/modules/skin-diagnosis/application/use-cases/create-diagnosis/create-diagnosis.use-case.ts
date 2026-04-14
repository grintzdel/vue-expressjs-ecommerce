import { randomUUID } from "crypto";
import { ISkinDiagnosisRepository } from "../../../domain/repository/skin-diagnosis.repository.interface";
import { SkinDiagnosisEntity } from "../../../domain/entity/skin-diagnosis.entity";

interface CreateDiagnosisInput {
  answers: { questionId: string; answer: string }[];
  result: string | null;
  recommendedProductIds: string[];
}

export class CreateDiagnosisUseCase {
  constructor(private readonly skinDiagnosisRepository: ISkinDiagnosisRepository) {}

  async execute(input: CreateDiagnosisInput): Promise<SkinDiagnosisEntity> {
    const sessionToken = randomUUID();

    return this.skinDiagnosisRepository.create({
      sessionToken,
      answers: input.answers,
      result: input.result,
      recommendedProductIds: input.recommendedProductIds,
    });
  }
}
