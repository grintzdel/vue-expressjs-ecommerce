export class CreatePageRequestDto {
  title: string;
  slug: string;
  content: string;
  seoMeta: { title: string; description: string };
  isPublished: boolean;

  constructor(body: Record<string, unknown>) {
    this.title = body.title as string;
    this.slug = body.slug as string;
    this.content = (body.content as string) ?? "";
    this.seoMeta = (body.seoMeta as { title: string; description: string }) ?? { title: "", description: "" };
    this.isPublished = (body.isPublished as boolean) ?? false;
  }
}
