export class AddToCartRequestDto {
  sessionId: string;
  productId: string;
  quantity: number;

  constructor(body: Record<string, unknown>) {
    this.sessionId = body.sessionId as string;
    this.productId = body.productId as string;
    this.quantity = (body.quantity as number) ?? 1;
  }
}
