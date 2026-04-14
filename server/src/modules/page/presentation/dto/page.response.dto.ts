import { PageEntity } from "../../domain/entity/page.entity";

export class PageResponseDto {
  id: string;
  title: string;
  slug: string;
  content: string;
  seoMeta: { title: string; description: string };
  isPublished: boolean;
  createdAt: Date;

  constructor(entity: PageEntity) {
    this.id = entity.id;
    this.title = entity.title;
    this.slug = entity.slug;
    this.content = entity.content;
    this.seoMeta = entity.seoMeta;
    this.isPublished = entity.isPublished;
    this.createdAt = entity.createdAt;
  }
}
