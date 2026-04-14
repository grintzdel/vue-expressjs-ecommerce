export interface ProductImage {
  url: string;
  altText: string;
  position: number;
}

export interface ProductEntityProps {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  images: ProductImage[];
  categoryId: string;
  tagIds: string[];
  skinTypeIds: string[];
  rating: number;
  stockQuantity: number;
  isFeatured: boolean;
  ingredients: string;
  howToUse: string;
  shippingInfo: string;
  createdAt: Date;
}

export class ProductEntity {
  private _id: string;
  private _name: string;
  private _slug: string;
  private _description: string;
  private _price: number;
  private _currency: string;
  private _images: ProductImage[];
  private _categoryId: string;
  private _tagIds: string[];
  private _skinTypeIds: string[];
  private _rating: number;
  private _stockQuantity: number;
  private _isFeatured: boolean;
  private _ingredients: string;
  private _howToUse: string;
  private _shippingInfo: string;
  private _createdAt: Date;

  constructor(props: ProductEntityProps) {
    this._id = props.id;
    this._name = props.name;
    this._slug = props.slug;
    this._description = props.description;
    this._price = props.price;
    this._currency = props.currency;
    this._images = props.images;
    this._categoryId = props.categoryId;
    this._tagIds = props.tagIds;
    this._skinTypeIds = props.skinTypeIds;
    this._rating = props.rating;
    this._stockQuantity = props.stockQuantity;
    this._isFeatured = props.isFeatured;
    this._ingredients = props.ingredients;
    this._howToUse = props.howToUse;
    this._shippingInfo = props.shippingInfo;
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

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }

  get price(): number {
    return this._price;
  }

  set price(value: number) {
    this._price = value;
  }

  get currency(): string {
    return this._currency;
  }

  set currency(value: string) {
    this._currency = value;
  }

  get images(): ProductImage[] {
    return this._images;
  }

  set images(value: ProductImage[]) {
    this._images = value;
  }

  get categoryId(): string {
    return this._categoryId;
  }

  set categoryId(value: string) {
    this._categoryId = value;
  }

  get tagIds(): string[] {
    return this._tagIds;
  }

  set tagIds(value: string[]) {
    this._tagIds = value;
  }

  get skinTypeIds(): string[] {
    return this._skinTypeIds;
  }

  set skinTypeIds(value: string[]) {
    this._skinTypeIds = value;
  }

  get rating(): number {
    return this._rating;
  }

  set rating(value: number) {
    this._rating = value;
  }

  get stockQuantity(): number {
    return this._stockQuantity;
  }

  set stockQuantity(value: number) {
    this._stockQuantity = value;
  }

  get isFeatured(): boolean {
    return this._isFeatured;
  }

  set isFeatured(value: boolean) {
    this._isFeatured = value;
  }

  get ingredients(): string {
    return this._ingredients;
  }

  set ingredients(value: string) {
    this._ingredients = value;
  }

  get howToUse(): string {
    return this._howToUse;
  }

  set howToUse(value: string) {
    this._howToUse = value;
  }

  get shippingInfo(): string {
    return this._shippingInfo;
  }

  set shippingInfo(value: string) {
    this._shippingInfo = value;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}
