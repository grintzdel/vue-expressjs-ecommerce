import type { IAuthPort } from '../ports/auth.port'
import type { AuthDomainModel } from '../model/auth.domain-model'

export class AuthHttpAdapter implements IAuthPort {
  private readonly baseUrl: string

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || '/api'
  }

  async login(data: AuthDomainModel.LoginDto): Promise<AuthDomainModel.AuthResponseDto> {
    const res = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || 'Login failed')
    return { token: json.data.token }
  }

  async register(data: AuthDomainModel.RegisterDto): Promise<AuthDomainModel.AuthResponseDto> {
    const res = await fetch(`${this.baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || 'Registration failed')
    return { token: json.data.token }
  }
}
