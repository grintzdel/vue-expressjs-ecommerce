export class UpdateOrderStatusRequestDto {
  status: string;

  constructor(body: Record<string, unknown>) {
    this.status = body.status as string;
  }
}
