import type { TagDomainModel } from '../model/tag.domain-model'

export interface ITagPort {
  getAll(): Promise<TagDomainModel.TagOverviewDto[]>
  create(data: TagDomainModel.CreateTagDto): Promise<TagDomainModel.TagOverviewDto>
  update(id: string, data: TagDomainModel.UpdateTagDto): Promise<TagDomainModel.TagOverviewDto>
  delete(id: string): Promise<void>
}
