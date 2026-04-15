import type { IBlogPostPort } from '../ports/blog-post.port'
import type { BlogPostDomainModel } from '../model/blog-post.domain-model'

const mockBlogPosts: BlogPostDomainModel.BlogPostOverviewDto[] = [
  {
    id: '1',
    title: 'Les bienfaits du karité pour la peau',
    slug: 'bienfaits-karite-peau',
    content: '<p>Le karité est un ingrédient précieux reconnu pour ses propriétés nourrissantes et hydratantes.</p>',
    excerpt: 'Découvrez pourquoi le karité est l\'allié indispensable de votre routine beauté.',
    featuredImage: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc',
    author: 'Marie Dupont',
    publishedAt: '2026-01-15T10:00:00Z',
    tags: ['bio', 'hydratant'],
  },
  {
    id: '2',
    title: 'Routine beauté naturelle en 5 étapes',
    slug: 'routine-beaute-naturelle-5-etapes',
    content: '<p>Une routine beauté naturelle simple et efficace pour prendre soin de votre peau au quotidien.</p>',
    excerpt: 'Adoptez une routine beauté naturelle et éco-responsable en seulement 5 étapes.',
    featuredImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03',
    author: 'Sophie Martin',
    publishedAt: '2026-02-10T09:00:00Z',
    tags: ['bio', 'vegan'],
  },
]

export class BlogPostInMemoryAdapter implements IBlogPostPort {
  private posts: BlogPostDomainModel.BlogPostOverviewDto[] = [...mockBlogPosts]

  async getAll(): Promise<BlogPostDomainModel.BlogPostOverviewDto[]> {
    return [...this.posts]
  }

  async create(data: BlogPostDomainModel.CreateBlogPostDto): Promise<BlogPostDomainModel.BlogPostOverviewDto> {
    const newPost: BlogPostDomainModel.BlogPostOverviewDto = {
      id: String(Date.now()),
      ...data,
    }
    this.posts.push(newPost)
    return newPost
  }

  async update(id: string, data: BlogPostDomainModel.UpdateBlogPostDto): Promise<BlogPostDomainModel.BlogPostOverviewDto> {
    const index = this.posts.findIndex((p) => p.id === id)
    if (index === -1) throw new Error(`BlogPost with id ${id} not found`)
    this.posts[index] = { ...this.posts[index], ...data }
    return this.posts[index]
  }

  async delete(id: string): Promise<void> {
    this.posts = this.posts.filter((p) => p.id !== id)
  }
}
