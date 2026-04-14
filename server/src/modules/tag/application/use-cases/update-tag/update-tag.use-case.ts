import { ITagRepository } from "../../../domain/repository/tag.repository.interface";
import { TagEntity } from "../../../domain/entity/tag.entity";
import { TagNotFoundError } from "../../../domain/errors/tag.error";

interface UpdateTagInput {
  name?: string;
  slug?: string;
}

export class UpdateTagUseCase {
  constructor(private readonly tagRepository: ITagRepository) {}

  async execute(id: string, input: UpdateTagInput): Promise<TagEntity> {
    const tag = await this.tagRepository.findById(id);
    if (!tag) {
      throw new TagNotFoundError();
    }

    const updated = await this.tagRepository.update(id, input);
    if (!updated) {
      throw new TagNotFoundError();
    }

    return updated;
  }
}
