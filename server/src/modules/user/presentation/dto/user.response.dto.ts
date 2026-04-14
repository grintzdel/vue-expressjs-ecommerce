export class UserResponseDto {
  id: string;
  email: string;
  role: string;
  createdAt: Date;

  constructor(data: { id: string; email: string; role: string; createdAt: Date }) {
    this.id = data.id;
    this.email = data.email;
    this.role = data.role;
    this.createdAt = data.createdAt;
  }
}
