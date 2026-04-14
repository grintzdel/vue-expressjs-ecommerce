import { CreatePageUseCase } from "../use-cases/create-page/create-page.use-case";
import { GetAllPagesUseCase } from "../use-cases/get-all-pages/get-all-pages.use-case";
import { GetPageBySlugUseCase } from "../use-cases/get-page-by-slug/get-page-by-slug.use-case";
import { UpdatePageUseCase } from "../use-cases/update-page/update-page.use-case";
import { DeletePageUseCase } from "../use-cases/delete-page/delete-page.use-case";

export class PageService {
  constructor(
    private readonly createPageUseCase: CreatePageUseCase,
    private readonly getAllPagesUseCase: GetAllPagesUseCase,
    private readonly getPageBySlugUseCase: GetPageBySlugUseCase,
    private readonly updatePageUseCase: UpdatePageUseCase,
    private readonly deletePageUseCase: DeletePageUseCase
  ) {}

  async createPage(input: { title: string; slug: string; content: string; seoMeta: { title: string; description: string }; isPublished: boolean }) {
    return this.createPageUseCase.execute(input);
  }

  async getAllPages() {
    return this.getAllPagesUseCase.execute();
  }

  async getPageBySlug(slug: string) {
    return this.getPageBySlugUseCase.execute(slug);
  }

  async updatePage(id: string, input: Partial<{ title: string; slug: string; content: string; seoMeta: { title: string; description: string }; isPublished: boolean }>) {
    return this.updatePageUseCase.execute(id, input);
  }

  async deletePage(id: string) {
    return this.deletePageUseCase.execute(id);
  }
}
