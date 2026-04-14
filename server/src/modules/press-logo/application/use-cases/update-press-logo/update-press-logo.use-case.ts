import { IPressLogoRepository } from "../../../domain/repository/press-logo.repository.interface";
import { PressLogoEntity } from "../../../domain/entity/press-logo.entity";
import { PressLogoNotFoundError } from "../../../domain/errors/press-logo.error";

interface UpdatePressLogoInput {
  name?: string;
  logoUrl?: string;
  link?: string;
  position?: number;
}

export class UpdatePressLogoUseCase {
  constructor(private readonly pressLogoRepository: IPressLogoRepository) {}

  async execute(id: string, input: UpdatePressLogoInput): Promise<PressLogoEntity> {
    const updated = await this.pressLogoRepository.update(id, input);
    if (!updated) {
      throw new PressLogoNotFoundError();
    }
    return updated;
  }
}
