import { CreateTagUseCase } from "../use-cases/create-tag/create-tag.use-case";
import { GetAllTagsUseCase } from "../use-cases/get-all-tags/get-all-tags.use-case";
import { GetTagBySlugUseCase } from "../use-cases/get-tag-by-slug/get-tag-by-slug.use-case";
import { UpdateTagUseCase } from "../use-cases/update-tag/update-tag.use-case";
import { DeleteTagUseCase } from "../use-cases/delete-tag/delete-tag.use-case";

export class TagService {
  constructor(
    private readonly createTagUseCase: CreateTagUseCase,
    private readonly getAllTagsUseCase: GetAllTagsUseCase,
    private readonly getTagBySlugUseCase: GetTagBySlugUseCase,
    private readonly updateTagUseCase: UpdateTagUseCase,
    private readonly deleteTagUseCase: DeleteTagUseCase
  ) {}

  async createTag(input: { name: string; slug: string }) {
    return this.createTagUseCase.execute(input);
  }

  async getAllTags() {
    return this.getAllTagsUseCase.execute();
  }

  async getTagBySlug(slug: string) {
    return this.getTagBySlugUseCase.execute(slug);
  }

  async updateTag(id: string, input: { name?: string; slug?: string }) {
    return this.updateTagUseCase.execute(id, input);
  }

  async deleteTag(id: string) {
    return this.deleteTagUseCase.execute(id);
  }
}
