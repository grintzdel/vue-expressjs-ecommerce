import { ITagRepository } from "../../../domain/repository/tag.repository.interface";
import { TagEntity } from "../../../domain/entity/tag.entity";
import { TagAlreadyExistsError } from "../../../domain/errors/tag.error";

interface CreateTagInput {
  name: string;
  slug: string;
}

export class CreateTagUseCase {
  constructor(private readonly tagRepository: ITagRepository) {}

  async execute(input: CreateTagInput): Promise<TagEntity> {
    const existing = await this.tagRepository.findBySlug(input.slug);
    if (existing) {
      throw new TagAlreadyExistsError();
    }

    return this.tagRepository.create({ name: input.name, slug: input.slug });
  }
}
