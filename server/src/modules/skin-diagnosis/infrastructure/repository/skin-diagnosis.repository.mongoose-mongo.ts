import { ISkinDiagnosisRepository } from "../../domain/repository/skin-diagnosis.repository.interface";
import { SkinDiagnosisEntity } from "../../domain/entity/skin-diagnosis.entity";
import { SkinDiagnosisModel } from "../schema/skin-diagnosis.schema";

export class SkinDiagnosisRepositoryMongooseMongo implements ISkinDiagnosisRepository {
  private toEntity(doc: any): SkinDiagnosisEntity {
    return new SkinDiagnosisEntity({
      id: doc._id.toString(),
      sessionToken: doc.sessionToken,
      answers: doc.answers,
      result: doc.result ?? null,
      recommendedProductIds: doc.recommendedProductIds,
      createdAt: doc.createdAt,
    });
  }

  async findBySessionToken(token: string): Promise<SkinDiagnosisEntity | null> {
    const doc = await SkinDiagnosisModel.findOne({ sessionToken: token });
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async create(data: {
    sessionToken: string;
    answers: { questionId: string; answer: string }[];
    result: string | null;
    recommendedProductIds: string[];
  }): Promise<SkinDiagnosisEntity> {
    const doc = await SkinDiagnosisModel.create(data);
    return this.toEntity(doc);
  }
}
