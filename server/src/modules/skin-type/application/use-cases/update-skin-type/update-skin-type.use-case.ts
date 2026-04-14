import { ISkinTypeRepository } from "../../../domain/repository/skin-type.repository.interface";
import { SkinTypeEntity } from "../../../domain/entity/skin-type.entity";
import { SkinTypeNotFoundError, SkinTypeAlreadyExistsError } from "../../../domain/errors/skin-type.error";

interface UpdateSkinTypeInput {
  id: string;
  name?: string;
  slug?: string;
}

export class UpdateSkinTypeUseCase {
  constructor(private readonly skinTypeRepository: ISkinTypeRepository) {}

  async execute(input: UpdateSkinTypeInput): Promise<SkinTypeEntity> {
    const existing = await this.skinTypeRepository.findById(input.id);
    if (!existing) {
      throw new SkinTypeNotFoundError();
    }

    if (input.slug && input.slug !== existing.slug) {
      const slugConflict = await this.skinTypeRepository.findBySlug(input.slug);
      if (slugConflict) {
        throw new SkinTypeAlreadyExistsError();
      }
    }

    const updated = await this.skinTypeRepository.update(input.id, {
      name: input.name,
      slug: input.slug,
    });

    if (!updated) {
      throw new SkinTypeNotFoundError();
    }

    return updated;
  }
}
