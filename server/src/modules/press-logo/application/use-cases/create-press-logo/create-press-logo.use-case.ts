import { IPressLogoRepository } from "../../../domain/repository/press-logo.repository.interface";
import { PressLogoEntity } from "../../../domain/entity/press-logo.entity";

interface CreatePressLogoInput {
  name: string;
  logoUrl: string;
  link: string;
  position: number;
}

export class CreatePressLogoUseCase {
  constructor(private readonly pressLogoRepository: IPressLogoRepository) {}

  async execute(input: CreatePressLogoInput): Promise<PressLogoEntity> {
    return this.pressLogoRepository.create({
      name: input.name,
      logoUrl: input.logoUrl,
      link: input.link,
      position: input.position,
    });
  }
}
