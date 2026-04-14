import { ISkinTypeRepository } from "../../../domain/repository/skin-type.repository.interface";
import { SkinTypeEntity } from "../../../domain/entity/skin-type.entity";
import { SkinTypeNotFoundError } from "../../../domain/errors/skin-type.error";

export class GetSkinTypeBySlugUseCase {
  constructor(private readonly skinTypeRepository: ISkinTypeRepository) {}

  async execute(slug: string): Promise<SkinTypeEntity> {
    const skinType = await this.skinTypeRepository.findBySlug(slug);
    if (!skinType) {
      throw new SkinTypeNotFoundError();
    }
    return skinType;
  }
}
