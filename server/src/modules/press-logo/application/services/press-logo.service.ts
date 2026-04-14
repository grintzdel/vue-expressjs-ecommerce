import { CreatePressLogoUseCase } from "../use-cases/create-press-logo/create-press-logo.use-case";
import { GetAllPressLogosUseCase } from "../use-cases/get-all-press-logos/get-all-press-logos.use-case";
import { UpdatePressLogoUseCase } from "../use-cases/update-press-logo/update-press-logo.use-case";
import { DeletePressLogoUseCase } from "../use-cases/delete-press-logo/delete-press-logo.use-case";

export class PressLogoService {
  constructor(
    private readonly createPressLogoUseCase: CreatePressLogoUseCase,
    private readonly getAllPressLogosUseCase: GetAllPressLogosUseCase,
    private readonly updatePressLogoUseCase: UpdatePressLogoUseCase,
    private readonly deletePressLogoUseCase: DeletePressLogoUseCase
  ) {}

  async createPressLogo(input: { name: string; logoUrl: string; link: string; position: number }) {
    return this.createPressLogoUseCase.execute(input);
  }

  async getAllPressLogos() {
    return this.getAllPressLogosUseCase.execute();
  }

  async updatePressLogo(id: string, input: Partial<{ name: string; logoUrl: string; link: string; position: number }>) {
    return this.updatePressLogoUseCase.execute(id, input);
  }

  async deletePressLogo(id: string) {
    return this.deletePressLogoUseCase.execute(id);
  }
}
