import { ISkinTypeRepository } from "../../../domain/repository/skin-type.repository.interface";
import { SkinTypeNotFoundError } from "../../../domain/errors/skin-type.error";

export class DeleteSkinTypeUseCase {
  constructor(private readonly skinTypeRepository: ISkinTypeRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.skinTypeRepository.findById(id);
    if (!existing) {
      throw new SkinTypeNotFoundError();
    }

    await this.skinTypeRepository.delete(id);
  }
}
