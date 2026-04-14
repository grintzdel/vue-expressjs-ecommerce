import { IPageRepository } from "../../../domain/repository/page.repository.interface";
import { PageEntity } from "../../../domain/entity/page.entity";

export class GetAllPagesUseCase {
  constructor(private readonly pageRepository: IPageRepository) {}

  async execute(): Promise<PageEntity[]> {
    return this.pageRepository.findAll();
  }
}
