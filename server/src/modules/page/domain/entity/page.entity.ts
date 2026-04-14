export interface PageEntityProps {
  id: string;
  title: string;
  slug: string;
  content: string;
  seoMeta: { title: string; description: string };
  isPublished: boolean;
  createdAt: Date;
}

export class PageEntity {
  private _id: string;
  private _title: string;
  private _slug: string;
  private _content: string;
  private _seoMeta: { title: string; description: string };
  private _isPublished: boolean;
  private _createdAt: Date;

  constructor(props: PageEntityProps) {
    this._id = props.id;
    this._title = props.title;
    this._slug = props.slug;
    this._content = props.content;
    this._seoMeta = props.seoMeta;
    this._isPublished = props.isPublished;
    this._createdAt = props.createdAt;
  }

  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }

  get slug(): string {
    return this._slug;
  }

  set slug(value: string) {
    this._slug = value;
  }

  get content(): string {
    return this._content;
  }

  set content(value: string) {
    this._content = value;
  }

  get seoMeta(): { title: string; description: string } {
    return this._seoMeta;
  }

  set seoMeta(value: { title: string; description: string }) {
    this._seoMeta = value;
  }

  get isPublished(): boolean {
    return this._isPublished;
  }

  set isPublished(value: boolean) {
    this._isPublished = value;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}
