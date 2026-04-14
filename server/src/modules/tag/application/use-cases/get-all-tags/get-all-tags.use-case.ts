import { ITagRepository } from "../../../domain/repository/tag.repository.interface";
import { TagEntity } from "../../../domain/entity/tag.entity";

export class GetAllTagsUseCase {
  constructor(private readonly tagRepository: ITagRepository) {}

  async execute(): Promise<TagEntity[]> {
    return this.tagRepository.findAll();
  }
}
