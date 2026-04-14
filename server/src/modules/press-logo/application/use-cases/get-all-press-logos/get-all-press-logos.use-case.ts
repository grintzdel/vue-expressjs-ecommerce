import { IPressLogoRepository } from "../../../domain/repository/press-logo.repository.interface";
import { PressLogoEntity } from "../../../domain/entity/press-logo.entity";

export class GetAllPressLogosUseCase {
  constructor(private readonly pressLogoRepository: IPressLogoRepository) {}

  async execute(): Promise<PressLogoEntity[]> {
    return this.pressLogoRepository.findAll();
  }
}
