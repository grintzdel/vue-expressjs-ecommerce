export class LoginRequestDto {
  email: string;
  password: string;

  constructor(body: Record<string, unknown>) {
    this.email = body.email as string;
    this.password = body.password as string;
  }
}
