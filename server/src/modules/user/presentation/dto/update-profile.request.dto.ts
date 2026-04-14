export class UpdateProfileRequestDto {
  email?: string;

  constructor(body: Record<string, unknown>) {
    if (body.email) this.email = body.email as string;
  }
}
