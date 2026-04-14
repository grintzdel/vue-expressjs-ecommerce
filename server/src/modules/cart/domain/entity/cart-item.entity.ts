export interface CartItemEntityProps {
  id: string;
  sessionId: string;
  productId: string;
  quantity: number;
  createdAt: Date;
}

export class CartItemEntity {
  private _id: string;
  private _sessionId: string;
  private _productId: string;
  private _quantity: number;
  private _createdAt: Date;

  constructor(props: CartItemEntityProps) {
    this._id = props.id;
    this._sessionId = props.sessionId;
    this._productId = props.productId;
    this._quantity = props.quantity;
    this._createdAt = props.createdAt;
  }

  get id(): string {
    return this._id;
  }

  get sessionId(): string {
    return this._sessionId;
  }

  get productId(): string {
    return this._productId;
  }

  get quantity(): number {
    return this._quantity;
  }

  set quantity(value: number) {
    this._quantity = value;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}
