export interface SkinTypeEntityProps {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
}

export class SkinTypeEntity {
  private _id: string;
  private _name: string;
  private _slug: string;
  private _createdAt: Date;

  constructor(props: SkinTypeEntityProps) {
    this._id = props.id;
    this._name = props.name;
    this._slug = props.slug;
    this._createdAt = props.createdAt;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get slug(): string {
    return this._slug;
  }

  set slug(value: string) {
    this._slug = value;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}
