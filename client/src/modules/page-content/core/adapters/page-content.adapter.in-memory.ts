import type { IPageContentPort } from '../ports/page-content.port'
import type { PageContentDomainModel } from '../model/page-content.domain-model'

const mockPages: PageContentDomainModel.PageContentOverviewDto[] = [
  {
    id: '1',
    title: 'À propos de nous',
    slug: 'a-propos',
    content: '<p>Nous sommes une marque engagée dans des cosmétiques naturels et durables.</p>',
    seoMeta: { title: 'À propos - Notre histoire', description: 'Découvrez notre histoire et nos valeurs.' },
    isPublished: true,
  },
  {
    id: '2',
    title: 'Politique de livraison',
    slug: 'livraison',
    content: '<p>Livraison offerte dès 50€ d\'achat. Délai de 3 à 5 jours ouvrés.</p>',
    seoMeta: { title: 'Livraison - Informations', description: 'Tout savoir sur nos conditions de livraison.' },
    isPublished: true,
  },
]

export class PageContentInMemoryAdapter implements IPageContentPort {
  private pages: PageContentDomainModel.PageContentOverviewDto[] = [...mockPages]

  async getAll(): Promise<PageContentDomainModel.PageContentOverviewDto[]> {
    return [...this.pages]
  }

  async create(data: PageContentDomainModel.CreatePageContentDto): Promise<PageContentDomainModel.PageContentOverviewDto> {
    const newPage: PageContentDomainModel.PageContentOverviewDto = {
      id: String(Date.now()),
      ...data,
    }
    this.pages.push(newPage)
    return newPage
  }

  async update(id: string, data: PageContentDomainModel.UpdatePageContentDto): Promise<PageContentDomainModel.PageContentOverviewDto> {
    const index = this.pages.findIndex((p) => p.id === id)
    if (index === -1) throw new Error(`Page with id ${id} not found`)
    this.pages[index] = { ...this.pages[index], ...data }
    return this.pages[index]
  }

  async delete(id: string): Promise<void> {
    this.pages = this.pages.filter((p) => p.id !== id)
  }
}
