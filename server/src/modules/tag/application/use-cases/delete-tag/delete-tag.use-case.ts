import { ITagRepository } from "../../../domain/repository/tag.repository.interface";
import { TagNotFoundError } from "../../../domain/errors/tag.error";

export class DeleteTagUseCase {
  constructor(private readonly tagRepository: ITagRepository) {}

  async execute(id: string): Promise<void> {
    const tag = await this.tagRepository.findById(id);
    if (!tag) {
      throw new TagNotFoundError();
    }

    await this.tagRepository.delete(id);
  }
}
