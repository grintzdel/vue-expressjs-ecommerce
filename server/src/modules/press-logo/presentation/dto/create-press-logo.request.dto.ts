export class CreatePressLogoRequestDto {
  name: string;
  logoUrl: string;
  link: string;
  position: number;

  constructor(body: Record<string, unknown>) {
    this.name = body.name as string;
    this.logoUrl = body.logoUrl as string;
    this.link = body.link as string;
    this.position = (body.position as number) ?? 0;
  }
}
