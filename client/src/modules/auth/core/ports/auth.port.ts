import type { AuthDomainModel } from '../model/auth.domain-model'

export interface IAuthPort {
  login(data: AuthDomainModel.LoginDto): Promise<AuthDomainModel.AuthResponseDto>
  register(data: AuthDomainModel.RegisterDto): Promise<AuthDomainModel.AuthResponseDto>
}
