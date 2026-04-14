export interface BlogPostEntityProps {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  author: string;
  publishedAt: Date | null;
  tags: string[];
  createdAt: Date;
}

export class BlogPostEntity {
  private _id: string;
  private _title: string;
  private _slug: string;
  private _content: string;
  private _excerpt: string;
  private _featuredImage: string;
  private _author: string;
  private _publishedAt: Date | null;
  private _tags: string[];
  private _createdAt: Date;

  constructor(props: BlogPostEntityProps) {
    this._id = props.id;
    this._title = props.title;
    this._slug = props.slug;
    this._content = props.content;
    this._excerpt = props.excerpt;
    this._featuredImage = props.featuredImage;
    this._author = props.author;
    this._publishedAt = props.publishedAt;
    this._tags = props.tags;
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

  get excerpt(): string {
    return this._excerpt;
  }

  set excerpt(value: string) {
    this._excerpt = value;
  }

  get featuredImage(): string {
    return this._featuredImage;
  }

  set featuredImage(value: string) {
    this._featuredImage = value;
  }

  get author(): string {
    return this._author;
  }

  set author(value: string) {
    this._author = value;
  }

  get publishedAt(): Date | null {
    return this._publishedAt;
  }

  set publishedAt(value: Date | null) {
    this._publishedAt = value;
  }

  get tags(): string[] {
    return this._tags;
  }

  set tags(value: string[]) {
    this._tags = value;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}
