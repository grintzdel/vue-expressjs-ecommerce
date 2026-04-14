export interface NewsletterSubscriptionEntityProps {
  id: string;
  email: string;
  subscribedAt: Date;
  isActive: boolean;
  discountCode: string | null;
  createdAt: Date;
}

export class NewsletterSubscriptionEntity {
  private _id: string;
  private _email: string;
  private _subscribedAt: Date;
  private _isActive: boolean;
  private _discountCode: string | null;
  private _createdAt: Date;

  constructor(props: NewsletterSubscriptionEntityProps) {
    this._id = props.id;
    this._email = props.email;
    this._subscribedAt = props.subscribedAt;
    this._isActive = props.isActive;
    this._discountCode = props.discountCode;
    this._createdAt = props.createdAt;
  }

  get id(): string {
    return this._id;
  }

  get email(): string {
    return this._email;
  }

  get subscribedAt(): Date {
    return this._subscribedAt;
  }

  set subscribedAt(value: Date) {
    this._subscribedAt = value;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  set isActive(value: boolean) {
    this._isActive = value;
  }

  get discountCode(): string | null {
    return this._discountCode;
  }

  set discountCode(value: string | null) {
    this._discountCode = value;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}
