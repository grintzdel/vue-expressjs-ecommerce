export class UpdateCartItemRequestDto {
  quantity: number;

  constructor(body: Record<string, unknown>) {
    this.quantity = body.quantity as number;
  }
}
