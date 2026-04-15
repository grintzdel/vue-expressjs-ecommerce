import type { IAuthPort } from '../ports/auth.port'
import type { AuthDomainModel } from '../model/auth.domain-model'

export class AuthInMemoryAdapter implements IAuthPort {
  async login(_data: AuthDomainModel.LoginDto): Promise<AuthDomainModel.AuthResponseDto> {
    return { token: 'mock-jwt-token' }
  }

  async register(_data: AuthDomainModel.RegisterDto): Promise<AuthDomainModel.AuthResponseDto> {
    return { token: 'mock-jwt-token' }
  }
}
