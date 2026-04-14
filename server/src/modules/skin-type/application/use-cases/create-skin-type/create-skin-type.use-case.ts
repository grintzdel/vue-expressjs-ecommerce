import { ISkinTypeRepository } from "../../../domain/repository/skin-type.repository.interface";
import { SkinTypeEntity } from "../../../domain/entity/skin-type.entity";
import { SkinTypeAlreadyExistsError } from "../../../domain/errors/skin-type.error";

interface CreateSkinTypeInput {
  name: string;
  slug: string;
}

export class CreateSkinTypeUseCase {
  constructor(private readonly skinTypeRepository: ISkinTypeRepository) {}

  async execute(input: CreateSkinTypeInput): Promise<SkinTypeEntity> {
    const existing = await this.skinTypeRepository.findBySlug(input.slug);
    if (existing) {
      throw new SkinTypeAlreadyExistsError();
    }

    return this.skinTypeRepository.create({ name: input.name, slug: input.slug });
  }
}
