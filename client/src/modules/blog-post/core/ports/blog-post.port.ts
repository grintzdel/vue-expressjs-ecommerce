import type { BlogPostDomainModel } from '../model/blog-post.domain-model'

export interface IBlogPostPort {
  getAll(): Promise<BlogPostDomainModel.BlogPostOverviewDto[]>
  create(data: BlogPostDomainModel.CreateBlogPostDto): Promise<BlogPostDomainModel.BlogPostOverviewDto>
  update(id: string, data: BlogPostDomainModel.UpdateBlogPostDto): Promise<BlogPostDomainModel.BlogPostOverviewDto>
  delete(id: string): Promise<void>
}
