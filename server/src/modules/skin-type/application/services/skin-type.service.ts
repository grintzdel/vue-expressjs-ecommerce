import { CreateSkinTypeUseCase } from "../use-cases/create-skin-type/create-skin-type.use-case";
import { GetAllSkinTypesUseCase } from "../use-cases/get-all-skin-types/get-all-skin-types.use-case";
import { GetSkinTypeBySlugUseCase } from "../use-cases/get-skin-type-by-slug/get-skin-type-by-slug.use-case";
import { UpdateSkinTypeUseCase } from "../use-cases/update-skin-type/update-skin-type.use-case";
import { DeleteSkinTypeUseCase } from "../use-cases/delete-skin-type/delete-skin-type.use-case";

export class SkinTypeService {
  constructor(
    private readonly createSkinTypeUseCase: CreateSkinTypeUseCase,
    private readonly getAllSkinTypesUseCase: GetAllSkinTypesUseCase,
    private readonly getSkinTypeBySlugUseCase: GetSkinTypeBySlugUseCase,
    private readonly updateSkinTypeUseCase: UpdateSkinTypeUseCase,
    private readonly deleteSkinTypeUseCase: DeleteSkinTypeUseCase
  ) {}

  async create(input: { name: string; slug: string }) {
    return this.createSkinTypeUseCase.execute(input);
  }

  async getAll() {
    return this.getAllSkinTypesUseCase.execute();
  }

  async getBySlug(slug: string) {
    return this.getSkinTypeBySlugUseCase.execute(slug);
  }

  async update(id: string, data: { name?: string; slug?: string }) {
    return this.updateSkinTypeUseCase.execute({ id, ...data });
  }

  async delete(id: string) {
    return this.deleteSkinTypeUseCase.execute(id);
  }
}
