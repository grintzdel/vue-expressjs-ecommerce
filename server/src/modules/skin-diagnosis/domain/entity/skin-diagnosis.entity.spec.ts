import { SkinDiagnosisEntity } from "./skin-diagnosis.entity";

describe("SkinDiagnosisEntity", () => {
  const props = {
    id: "diag-1",
    sessionToken: "token-abc-123",
    answers: [{ questionId: "q1", answer: "oily" }],
    result: "Oily",
    recommendedProductIds: ["prod-1", "prod-2"],
    createdAt: new Date("2024-01-01"),
  };

  it("should create a skin diagnosis entity with correct props", () => {
    const entity = new SkinDiagnosisEntity(props);

    expect(entity.id).toBe("diag-1");
    expect(entity.sessionToken).toBe("token-abc-123");
    expect(entity.answers).toEqual([{ questionId: "q1", answer: "oily" }]);
    expect(entity.result).toBe("Oily");
    expect(entity.recommendedProductIds).toEqual(["prod-1", "prod-2"]);
    expect(entity.createdAt).toEqual(new Date("2024-01-01"));
  });

  it("should allow null result", () => {
    const entity = new SkinDiagnosisEntity({ ...props, result: null });
    expect(entity.result).toBeNull();
  });

  it("should update answers via setter", () => {
    const entity = new SkinDiagnosisEntity(props);
    entity.answers = [{ questionId: "q2", answer: "dry" }];
    expect(entity.answers).toEqual([{ questionId: "q2", answer: "dry" }]);
  });

  it("should update result via setter", () => {
    const entity = new SkinDiagnosisEntity(props);
    entity.result = "Dry";
    expect(entity.result).toBe("Dry");
  });

  it("should update recommendedProductIds via setter", () => {
    const entity = new SkinDiagnosisEntity(props);
    entity.recommendedProductIds = ["prod-3"];
    expect(entity.recommendedProductIds).toEqual(["prod-3"]);
  });

  it("should not allow setting id directly (read-only)", () => {
    const entity = new SkinDiagnosisEntity(props);
    expect(entity.id).toBe("diag-1");
  });

  it("should not allow setting sessionToken directly (read-only)", () => {
    const entity = new SkinDiagnosisEntity(props);
    expect(entity.sessionToken).toBe("token-abc-123");
  });
});
