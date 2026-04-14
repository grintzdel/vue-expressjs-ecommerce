export class CreateSkinTypeRequestDto {
  name: string;
  slug: string;

  constructor(body: Record<string, unknown>) {
    this.name = body.name as string;
    this.slug = body.slug as string;
  }
}
