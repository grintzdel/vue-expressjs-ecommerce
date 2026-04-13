export interface UserEntityProps {
  id: string;
  email: string;
  password: string;
  role: "admin" | "customer";
  createdAt: Date;
}

export class UserEntity {
  private _id: string;
  private _email: string;
  private _password: string;
  private _role: "admin" | "customer";
  private _createdAt: Date;

  constructor(props: UserEntityProps) {
    this._id = props.id;
    this._email = props.email;
    this._password = props.password;
    this._role = props.role;
    this._createdAt = props.createdAt;
  }

  get id(): string {
    return this._id;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get password(): string {
    return this._password;
  }

  set password(value: string) {
    this._password = value;
  }

  get role(): "admin" | "customer" {
    return this._role;
  }

  set role(value: "admin" | "customer") {
    this._role = value;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}
