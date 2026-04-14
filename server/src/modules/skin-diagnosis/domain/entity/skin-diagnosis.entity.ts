export interface SkinDiagnosisEntityProps {
  id: string;
  sessionToken: string;
  answers: { questionId: string; answer: string }[];
  result: string | null;
  recommendedProductIds: string[];
  createdAt: Date;
}

export class SkinDiagnosisEntity {
  private _id: string;
  private _sessionToken: string;
  private _answers: { questionId: string; answer: string }[];
  private _result: string | null;
  private _recommendedProductIds: string[];
  private _createdAt: Date;

  constructor(props: SkinDiagnosisEntityProps) {
    this._id = props.id;
    this._sessionToken = props.sessionToken;
    this._answers = props.answers;
    this._result = props.result;
    this._recommendedProductIds = props.recommendedProductIds;
    this._createdAt = props.createdAt;
  }

  get id(): string {
    return this._id;
  }

  get sessionToken(): string {
    return this._sessionToken;
  }

  get answers(): { questionId: string; answer: string }[] {
    return this._answers;
  }

  set answers(value: { questionId: string; answer: string }[]) {
    this._answers = value;
  }

  get result(): string | null {
    return this._result;
  }

  set result(value: string | null) {
    this._result = value;
  }

  get recommendedProductIds(): string[] {
    return this._recommendedProductIds;
  }

  set recommendedProductIds(value: string[]) {
    this._recommendedProductIds = value;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}
