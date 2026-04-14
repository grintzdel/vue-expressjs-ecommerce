import { ISkinDiagnosisRepository } from "../../../domain/repository/skin-diagnosis.repository.interface";
import { SkinDiagnosisEntity } from "../../../domain/entity/skin-diagnosis.entity";
import { DiagnosisNotFoundError } from "../../../domain/errors/skin-diagnosis.error";

export class GetDiagnosisByTokenUseCase {
  constructor(private readonly skinDiagnosisRepository: ISkinDiagnosisRepository) {}

  async execute(sessionToken: string): Promise<SkinDiagnosisEntity> {
    const diagnosis = await this.skinDiagnosisRepository.findBySessionToken(sessionToken);
    if (!diagnosis) {
      throw new DiagnosisNotFoundError();
    }
    return diagnosis;
  }
}
