export class CreateDiagnosisRequestDto {
  answers: { questionId: string; answer: string }[];
  result: string | null;
  recommendedProductIds: string[];

  constructor(body: Record<string, unknown>) {
    this.answers = (body.answers as { questionId: string; answer: string }[]) ?? [];
    this.result = (body.result as string) ?? null;
    this.recommendedProductIds = (body.recommendedProductIds as string[]) ?? [];
  }
}
