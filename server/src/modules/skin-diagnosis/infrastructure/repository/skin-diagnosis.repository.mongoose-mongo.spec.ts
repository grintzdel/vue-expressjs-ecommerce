import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { SkinDiagnosisRepositoryMongooseMongo } from "./skin-diagnosis.repository.mongoose-mongo";

let mongoServer: MongoMemoryServer;
let repository: SkinDiagnosisRepositoryMongooseMongo;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  repository = new SkinDiagnosisRepositoryMongooseMongo();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await mongoose.connection.db!.dropDatabase();
});

describe("SkinDiagnosisRepositoryMongooseMongo", () => {
  const sampleData = {
    sessionToken: "test-token-123",
    answers: [{ questionId: "q1", answer: "oily" }],
    result: "Oily",
    recommendedProductIds: ["prod-1"],
  };

  it("should create a diagnosis and return entity", async () => {
    const diagnosis = await repository.create(sampleData);

    expect(diagnosis.id).toBeDefined();
    expect(diagnosis.sessionToken).toBe("test-token-123");
    expect(diagnosis.answers).toEqual(expect.arrayContaining([expect.objectContaining({ questionId: "q1", answer: "oily" })]));
    expect(diagnosis.result).toBe("Oily");
    expect(diagnosis.recommendedProductIds).toEqual(expect.arrayContaining(["prod-1"]));
    expect(diagnosis.createdAt).toBeInstanceOf(Date);
  });

  it("should create a diagnosis with null result", async () => {
    const diagnosis = await repository.create({ ...sampleData, result: null, sessionToken: "token-null" });

    expect(diagnosis.result).toBeNull();
  });

  it("should find diagnosis by session token", async () => {
    await repository.create(sampleData);

    const found = await repository.findBySessionToken("test-token-123");
    expect(found).not.toBeNull();
    expect(found!.sessionToken).toBe("test-token-123");
  });

  it("should return null for unknown session token", async () => {
    const found = await repository.findBySessionToken("unknown-token");
    expect(found).toBeNull();
  });
});
