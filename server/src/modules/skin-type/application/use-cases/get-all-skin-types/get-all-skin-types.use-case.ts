import { ISkinTypeRepository } from "../../../domain/repository/skin-type.repository.interface";
import { SkinTypeEntity } from "../../../domain/entity/skin-type.entity";

export class GetAllSkinTypesUseCase {
  constructor(private readonly skinTypeRepository: ISkinTypeRepository) {}

  async execute(): Promise<SkinTypeEntity[]> {
    return this.skinTypeRepository.findAll();
  }
}
