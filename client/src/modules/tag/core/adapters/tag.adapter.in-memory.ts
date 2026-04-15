import type { ITagPort } from '../ports/tag.port'
import type { TagDomainModel } from '../model/tag.domain-model'

const mockTags: TagDomainModel.TagOverviewDto[] = [
  { id: '1', name: 'Bio', slug: 'bio' },
  { id: '2', name: 'Vegan', slug: 'vegan' },
  { id: '3', name: 'Hydratant', slug: 'hydratant' },
]

export class TagInMemoryAdapter implements ITagPort {
  private tags: TagDomainModel.TagOverviewDto[] = [...mockTags]

  async getAll(): Promise<TagDomainModel.TagOverviewDto[]> {
    return [...this.tags]
  }

  async create(data: TagDomainModel.CreateTagDto): Promise<TagDomainModel.TagOverviewDto> {
    const newTag: TagDomainModel.TagOverviewDto = {
      id: String(Date.now()),
      ...data,
    }
    this.tags.push(newTag)
    return newTag
  }

  async update(id: string, data: TagDomainModel.UpdateTagDto): Promise<TagDomainModel.TagOverviewDto> {
    const index = this.tags.findIndex((t) => t.id === id)
    if (index === -1) throw new Error(`Tag with id ${id} not found`)
    this.tags[index] = { ...this.tags[index], ...data }
    return this.tags[index]
  }

  async delete(id: string): Promise<void> {
    this.tags = this.tags.filter((t) => t.id !== id)
  }
}
