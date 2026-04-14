export interface TestimonialEntityProps {
  id: string;
  authorName: string;
  content: string;
  rating: number;
  featuredProductIds: string[];
  isFeatured: boolean;
  createdAt: Date;
}

export class TestimonialEntity {
  private _id: string;
  private _authorName: string;
  private _content: string;
  private _rating: number;
  private _featuredProductIds: string[];
  private _isFeatured: boolean;
  private _createdAt: Date;

  constructor(props: TestimonialEntityProps) {
    this._id = props.id;
    this._authorName = props.authorName;
    this._content = props.content;
    this._rating = props.rating;
    this._featuredProductIds = props.featuredProductIds;
    this._isFeatured = props.isFeatured;
    this._createdAt = props.createdAt;
  }

  get id(): string {
    return this._id;
  }

  get authorName(): string {
    return this._authorName;
  }

  set authorName(value: string) {
    this._authorName = value;
  }

  get content(): string {
    return this._content;
  }

  set content(value: string) {
    this._content = value;
  }

  get rating(): number {
    return this._rating;
  }

  set rating(value: number) {
    this._rating = value;
  }

  get featuredProductIds(): string[] {
    return this._featuredProductIds;
  }

  set featuredProductIds(value: string[]) {
    this._featuredProductIds = value;
  }

  get isFeatured(): boolean {
    return this._isFeatured;
  }

  set isFeatured(value: boolean) {
    this._isFeatured = value;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}
