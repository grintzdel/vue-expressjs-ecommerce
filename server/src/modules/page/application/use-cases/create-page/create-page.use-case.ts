import { IPageRepository } from "../../../domain/repository/page.repository.interface";
import { PageEntity } from "../../../domain/entity/page.entity";
import { PageAlreadyExistsError } from "../../../domain/errors/page.error";

interface CreatePageInput {
  title: string;
  slug: string;
  content: string;
  seoMeta: { title: string; description: string };
  isPublished: boolean;
}

export class CreatePageUseCase {
  constructor(private readonly pageRepository: IPageRepository) {}

  async execute(input: CreatePageInput): Promise<PageEntity> {
    const existing = await this.pageRepository.findBySlug(input.slug);
    if (existing) {
      throw new PageAlreadyExistsError();
    }

    return this.pageRepository.create({
      title: input.title,
      slug: input.slug,
      content: input.content,
      seoMeta: input.seoMeta,
      isPublished: input.isPublished,
    });
  }
}
