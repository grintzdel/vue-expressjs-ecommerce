import { IPageRepository } from "../../../domain/repository/page.repository.interface";
import { PageNotFoundError } from "../../../domain/errors/page.error";

export class DeletePageUseCase {
  constructor(private readonly pageRepository: IPageRepository) {}

  async execute(id: string): Promise<void> {
    const deleted = await this.pageRepository.delete(id);
    if (!deleted) {
      throw new PageNotFoundError();
    }
  }
}
