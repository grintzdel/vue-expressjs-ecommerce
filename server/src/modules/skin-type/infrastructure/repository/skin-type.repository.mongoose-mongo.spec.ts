import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { SkinTypeRepositoryMongooseMongo } from "./skin-type.repository.mongoose-mongo";

let mongoServer: MongoMemoryServer;
let repository: SkinTypeRepositoryMongooseMongo;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  repository = new SkinTypeRepositoryMongooseMongo();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await mongoose.connection.db!.dropDatabase();
});

describe("SkinTypeRepositoryMongooseMongo", () => {
  it("should create a skin type and return entity", async () => {
    const skinType = await repository.create({ name: "Oily", slug: "oily" });

    expect(skinType.id).toBeDefined();
    expect(skinType.name).toBe("Oily");
    expect(skinType.slug).toBe("oily");
    expect(skinType.createdAt).toBeInstanceOf(Date);
  });

  it("should find skin type by slug", async () => {
    await repository.create({ name: "Oily", slug: "oily" });

    const found = await repository.findBySlug("oily");
    expect(found).not.toBeNull();
    expect(found!.slug).toBe("oily");
  });

  it("should return null for unknown slug", async () => {
    const found = await repository.findBySlug("unknown-slug");
    expect(found).toBeNull();
  });

  it("should find skin type by id", async () => {
    const created = await repository.create({ name: "Oily", slug: "oily" });

    const found = await repository.findById(created.id);
    expect(found).not.toBeNull();
    expect(found!.name).toBe("Oily");
  });

  it("should return null for unknown id", async () => {
    const found = await repository.findById(new mongoose.Types.ObjectId().toString());
    expect(found).toBeNull();
  });

  it("should find skin types by ids", async () => {
    const a = await repository.create({ name: "Oily", slug: "oily" });
    const b = await repository.create({ name: "Dry", slug: "dry" });
    await repository.create({ name: "Normal", slug: "normal" });

    const found = await repository.findByIds([a.id, b.id]);
    expect(found).toHaveLength(2);
  });

  it("should find all skin types", async () => {
    await repository.create({ name: "Oily", slug: "oily" });
    await repository.create({ name: "Dry", slug: "dry" });

    const all = await repository.findAll();
    expect(all).toHaveLength(2);
  });

  it("should update a skin type", async () => {
    const created = await repository.create({ name: "Oily", slug: "oily" });

    const updated = await repository.update(created.id, { name: "Very Oily" });
    expect(updated).not.toBeNull();
    expect(updated!.name).toBe("Very Oily");
  });

  it("should return null when updating non-existent id", async () => {
    const updated = await repository.update(new mongoose.Types.ObjectId().toString(), { name: "X" });
    expect(updated).toBeNull();
  });

  it("should delete a skin type and return true", async () => {
    const created = await repository.create({ name: "Oily", slug: "oily" });

    const result = await repository.delete(created.id);
    expect(result).toBe(true);

    const found = await repository.findById(created.id);
    expect(found).toBeNull();
  });

  it("should return false when deleting non-existent id", async () => {
    const result = await repository.delete(new mongoose.Types.ObjectId().toString());
    expect(result).toBe(false);
  });
});
