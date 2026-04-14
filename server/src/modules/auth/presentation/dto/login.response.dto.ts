export class LoginResponseDto {
  token: string;
  user: { id: string; email: string; role: string };

  constructor(data: { token: string; user: { id: string; email: string; role: string } }) {
    this.token = data.token;
    this.user = data.user;
  }
}
