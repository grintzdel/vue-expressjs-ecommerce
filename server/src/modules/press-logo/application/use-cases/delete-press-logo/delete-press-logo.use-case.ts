import { IPressLogoRepository } from "../../../domain/repository/press-logo.repository.interface";
import { PressLogoNotFoundError } from "../../../domain/errors/press-logo.error";

export class DeletePressLogoUseCase {
  constructor(private readonly pressLogoRepository: IPressLogoRepository) {}

  async execute(id: string): Promise<void> {
    const deleted = await this.pressLogoRepository.delete(id);
    if (!deleted) {
      throw new PressLogoNotFoundError();
    }
  }
}
