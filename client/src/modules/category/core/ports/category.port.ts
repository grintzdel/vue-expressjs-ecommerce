import type { CategoryDomainModel } from '../model/category.domain-model'

export interface ICategoryPort {
  getAll(): Promise<CategoryDomainModel.CategoryOverviewDto[]>
  create(data: CategoryDomainModel.CreateCategoryDto): Promise<CategoryDomainModel.CategoryOverviewDto>
  update(id: string, data: CategoryDomainModel.UpdateCategoryDto): Promise<CategoryDomainModel.CategoryOverviewDto>
  delete(id: string): Promise<void>
}
