import type { ICategoryPort } from '../ports/category.port'
import type { CategoryDomainModel } from '../model/category.domain-model'

const mockCategories: CategoryDomainModel.CategoryOverviewDto[] = [
  { id: '1', name: 'Soins visage', slug: 'soins-visage', description: 'Produits pour le visage' },
  { id: '2', name: 'Soins corps', slug: 'soins-corps', description: 'Produits pour le corps' },
]

export class CategoryInMemoryAdapter implements ICategoryPort {
  private categories: CategoryDomainModel.CategoryOverviewDto[] = [...mockCategories]

  async getAll(): Promise<CategoryDomainModel.CategoryOverviewDto[]> {
    return [...this.categories]
  }

  async create(data: CategoryDomainModel.CreateCategoryDto): Promise<CategoryDomainModel.CategoryOverviewDto> {
    const newCategory: CategoryDomainModel.CategoryOverviewDto = {
      id: String(Date.now()),
      ...data,
    }
    this.categories.push(newCategory)
    return newCategory
  }

  async update(id: string, data: CategoryDomainModel.UpdateCategoryDto): Promise<CategoryDomainModel.CategoryOverviewDto> {
    const index = this.categories.findIndex((c) => c.id === id)
    if (index === -1) throw new Error(`Category with id ${id} not found`)
    this.categories[index] = { ...this.categories[index], ...data }
    return this.categories[index]
  }

  async delete(id: string): Promise<void> {
    this.categories = this.categories.filter((c) => c.id !== id)
  }
}
