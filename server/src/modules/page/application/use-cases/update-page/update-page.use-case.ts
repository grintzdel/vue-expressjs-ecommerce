import { IPageRepository } from "../../../domain/repository/page.repository.interface";
import { PageEntity } from "../../../domain/entity/page.entity";
import { PageNotFoundError } from "../../../domain/errors/page.error";

interface UpdatePageInput {
  title?: string;
  slug?: string;
  content?: string;
  seoMeta?: { title: string; description: string };
  isPublished?: boolean;
}

export class UpdatePageUseCase {
  constructor(private readonly pageRepository: IPageRepository) {}

  async execute(id: string, input: UpdatePageInput): Promise<PageEntity> {
    const updated = await this.pageRepository.update(id, input);
    if (!updated) {
      throw new PageNotFoundError();
    }
    return updated;
  }
}
