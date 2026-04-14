export interface PressLogoEntityProps {
  id: string;
  name: string;
  logoUrl: string;
  link: string;
  position: number;
  createdAt: Date;
}

export class PressLogoEntity {
  private _id: string;
  private _name: string;
  private _logoUrl: string;
  private _link: string;
  private _position: number;
  private _createdAt: Date;

  constructor(props: PressLogoEntityProps) {
    this._id = props.id;
    this._name = props.name;
    this._logoUrl = props.logoUrl;
    this._link = props.link;
    this._position = props.position;
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

  get logoUrl(): string {
    return this._logoUrl;
  }

  set logoUrl(value: string) {
    this._logoUrl = value;
  }

  get link(): string {
    return this._link;
  }

  set link(value: string) {
    this._link = value;
  }

  get position(): number {
    return this._position;
  }

  set position(value: number) {
    this._position = value;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}
