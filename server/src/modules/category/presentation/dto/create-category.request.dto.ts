export class CreateCategoryRequestDto {
  name: string;
  slug: string;
  description: string;

  constructor(body: Record<string, unknown>) {
    this.name = body.name as string;
    this.slug = body.slug as string;
    this.description = (body.description as string) ?? "";
  }
}
