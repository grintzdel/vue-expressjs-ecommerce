export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderEntityProps {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  status: string;
  shippingAddress: string;
  createdAt: Date;
}

export class OrderEntity {
  private _id: string;
  private _userId: string;
  private _items: OrderItem[];
  private _totalAmount: number;
  private _currency: string;
  private _status: string;
  private _shippingAddress: string;
  private _createdAt: Date;

  constructor(props: OrderEntityProps) {
    this._id = props.id;
    this._userId = props.userId;
    this._items = props.items;
    this._totalAmount = props.totalAmount;
    this._currency = props.currency;
    this._status = props.status;
    this._shippingAddress = props.shippingAddress;
    this._createdAt = props.createdAt;
  }

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get items(): OrderItem[] {
    return this._items;
  }

  get totalAmount(): number {
    return this._totalAmount;
  }

  get currency(): string {
    return this._currency;
  }

  get status(): string {
    return this._status;
  }

  set status(value: string) {
    this._status = value;
  }

  get shippingAddress(): string {
    return this._shippingAddress;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}
