import { ITagRepository } from "../../../domain/repository/tag.repository.interface";
import { TagEntity } from "../../../domain/entity/tag.entity";
import { TagNotFoundError } from "../../../domain/errors/tag.error";

export class GetTagBySlugUseCase {
  constructor(private readonly tagRepository: ITagRepository) {}

  async execute(slug: string): Promise<TagEntity> {
    const tag = await this.tagRepository.findBySlug(slug);
    if (!tag) {
      throw new TagNotFoundError();
    }
    return tag;
  }
}
