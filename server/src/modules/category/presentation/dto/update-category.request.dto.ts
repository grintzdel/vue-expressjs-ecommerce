export class UpdateCategoryRequestDto {
  name?: string;
  slug?: string;
  description?: string;

  constructor(body: Record<string, unknown>) {
    if (body.name !== undefined) this.name = body.name as string;
    if (body.slug !== undefined) this.slug = body.slug as string;
    if (body.description !== undefined) this.description = body.description as string;
  }
}
