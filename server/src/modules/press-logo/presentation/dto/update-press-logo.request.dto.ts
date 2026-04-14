export class UpdatePressLogoRequestDto {
  name?: string;
  logoUrl?: string;
  link?: string;
  position?: number;

  constructor(body: Record<string, unknown>) {
    if (body.name !== undefined) this.name = body.name as string;
    if (body.logoUrl !== undefined) this.logoUrl = body.logoUrl as string;
    if (body.link !== undefined) this.link = body.link as string;
    if (body.position !== undefined) this.position = body.position as number;
  }
}
