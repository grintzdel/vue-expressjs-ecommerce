export class UpdateSkinTypeRequestDto {
  name?: string;
  slug?: string;

  constructor(body: Record<string, unknown>) {
    if (body.name !== undefined) this.name = body.name as string;
    if (body.slug !== undefined) this.slug = body.slug as string;
  }
}
