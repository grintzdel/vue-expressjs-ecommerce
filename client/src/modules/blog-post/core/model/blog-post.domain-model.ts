export namespace BlogPostDomainModel {
  export type BlogPostOverviewDto = {
    id: string
    title: string
    slug: string
    content: string
    excerpt: string
    featuredImage: string
    author: string
    publishedAt: string | null
    tags: string[]
  }

  export type CreateBlogPostDto = Omit<BlogPostOverviewDto, 'id'>

  export type UpdateBlogPostDto = Partial<CreateBlogPostDto>
}
