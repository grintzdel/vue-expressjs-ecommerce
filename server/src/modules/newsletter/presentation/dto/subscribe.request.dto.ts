export class SubscribeRequestDto {
  email: string;

  constructor(body: Record<string, unknown>) {
    this.email = body.email as string;
  }
}
