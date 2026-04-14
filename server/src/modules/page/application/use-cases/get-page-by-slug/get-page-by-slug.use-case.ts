import { IPageRepository } from "../../../domain/repository/page.repository.interface";
import { PageEntity } from "../../../domain/entity/page.entity";
import { PageNotFoundError } from "../../../domain/errors/page.error";

export class GetPageBySlugUseCase {
  constructor(private readonly pageRepository: IPageRepository) {}

  async execute(slug: string): Promise<PageEntity> {
    const page = await this.pageRepository.findBySlug(slug);
    if (!page) {
      throw new PageNotFoundError();
    }
    return page;
  }
}
