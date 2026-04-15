import type { IPressLogoPort } from '../ports/press-logo.port'
import type { PressLogoDomainModel } from '../model/press-logo.domain-model'

const mockPressLogos: PressLogoDomainModel.PressLogoOverviewDto[] = [
  {
    id: '1',
    name: 'Vogue',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Vogue_logo.svg/200px-Vogue_logo.svg.png',
    link: 'https://www.vogue.fr',
    position: 1,
  },
  {
    id: '2',
    name: 'Elle',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/ELLE_logo.svg/200px-ELLE_logo.svg.png',
    link: 'https://www.elle.fr',
    position: 2,
  },
]

export class PressLogoInMemoryAdapter implements IPressLogoPort {
  private logos: PressLogoDomainModel.PressLogoOverviewDto[] = [...mockPressLogos]

  async getAll(): Promise<PressLogoDomainModel.PressLogoOverviewDto[]> {
    return [...this.logos]
  }

  async create(data: PressLogoDomainModel.CreatePressLogoDto): Promise<PressLogoDomainModel.PressLogoOverviewDto> {
    const newLogo: PressLogoDomainModel.PressLogoOverviewDto = {
      id: String(Date.now()),
      ...data,
    }
    this.logos.push(newLogo)
    return newLogo
  }

  async update(id: string, data: PressLogoDomainModel.UpdatePressLogoDto): Promise<PressLogoDomainModel.PressLogoOverviewDto> {
    const index = this.logos.findIndex((l) => l.id === id)
    if (index === -1) throw new Error(`PressLogo with id ${id} not found`)
    this.logos[index] = { ...this.logos[index], ...data }
    return this.logos[index]
  }

  async delete(id: string): Promise<void> {
    this.logos = this.logos.filter((l) => l.id !== id)
  }
}
