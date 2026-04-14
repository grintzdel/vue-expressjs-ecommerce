export class UpdatePageRequestDto {
  title?: string;
  slug?: string;
  content?: string;
  seoMeta?: { title: string; description: string };
  isPublished?: boolean;

  constructor(body: Record<string, unknown>) {
    if (body.title !== undefined) this.title = body.title as string;
    if (body.slug !== undefined) this.slug = body.slug as string;
    if (body.content !== undefined) this.content = body.content as string;
    if (body.seoMeta !== undefined) this.seoMeta = body.seoMeta as { title: string; description: string };
    if (body.isPublished !== undefined) this.isPublished = body.isPublished as boolean;
  }
}
