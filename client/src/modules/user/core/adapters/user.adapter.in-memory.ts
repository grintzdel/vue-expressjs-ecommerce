import type { IUserPort } from '../ports/user.port'
import type { UserDomainModel } from '../model/user.domain-model'

const mockUsers: UserDomainModel.UserOverviewDto[] = [
  { id: '1', email: 'admin@example.com', role: 'admin', createdAt: '2025-06-01T08:00:00Z' },
  { id: '2', email: 'user@example.com', role: 'user', createdAt: '2025-09-15T10:30:00Z' },
]

export class UserInMemoryAdapter implements IUserPort {
  private users: UserDomainModel.UserOverviewDto[] = [...mockUsers]

  async getAll(): Promise<UserDomainModel.UserOverviewDto[]> {
    return [...this.users]
  }

  async delete(id: string): Promise<void> {
    this.users = this.users.filter((u) => u.id !== id)
  }
}
