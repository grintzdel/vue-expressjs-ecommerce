import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { TagRepositoryMongooseMongo } from "./tag.repository.mongoose-mongo";

let mongoServer: MongoMemoryServer;
let repository: TagRepositoryMongooseMongo;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  repository = new TagRepositoryMongooseMongo();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await mongoose.connection.db!.dropDatabase();
});

describe("TagRepositoryMongooseMongo", () => {
  it("should create a tag and return entity", async () => {
    const tag = await repository.create({ name: "Hydrate", slug: "hydrate" });

    expect(tag.id).toBeDefined();
    expect(tag.name).toBe("Hydrate");
    expect(tag.slug).toBe("hydrate");
    expect(tag.createdAt).toBeInstanceOf(Date);
  });

  it("should find all tags", async () => {
    await repository.create({ name: "Hydrate", slug: "hydrate" });
    await repository.create({ name: "Protect", slug: "protect" });

    const all = await repository.findAll();
    expect(all).toHaveLength(2);
  });

  it("should find tag by slug", async () => {
    await repository.create({ name: "Hydrate", slug: "hydrate" });

    const found = await repository.findBySlug("hydrate");
    expect(found).not.toBeNull();
    expect(found!.name).toBe("Hydrate");
  });

  it("should return null for unknown slug", async () => {
    const found = await repository.findBySlug("unknown");
    expect(found).toBeNull();
  });

  it("should find tag by id", async () => {
    const created = await repository.create({ name: "Hydrate", slug: "hydrate" });

    const found = await repository.findById(created.id);
    expect(found).not.toBeNull();
    expect(found!.slug).toBe("hydrate");
  });

  it("should return null for unknown id", async () => {
    const found = await repository.findById(new mongoose.Types.ObjectId().toString());
    expect(found).toBeNull();
  });

  it("should find tags by ids", async () => {
    const t1 = await repository.create({ name: "Hydrate", slug: "hydrate" });
    const t2 = await repository.create({ name: "Protect", slug: "protect" });
    await repository.create({ name: "Soothes", slug: "soothes" });

    const found = await repository.findByIds([t1.id, t2.id]);
    expect(found).toHaveLength(2);
  });

  it("should update a tag", async () => {
    const created = await repository.create({ name: "Hydrate", slug: "hydrate" });

    const updated = await repository.update(created.id, { name: "Revitalizes" });
    expect(updated).not.toBeNull();
    expect(updated!.name).toBe("Revitalizes");
  });

  it("should return null when updating non-existent tag", async () => {
    const updated = await repository.update(new mongoose.Types.ObjectId().toString(), { name: "X" });
    expect(updated).toBeNull();
  });

  it("should delete a tag and return true", async () => {
    const created = await repository.create({ name: "Hydrate", slug: "hydrate" });

    const result = await repository.delete(created.id);
    expect(result).toBe(true);

    const found = await repository.findById(created.id);
    expect(found).toBeNull();
  });

  it("should return false when deleting non-existent tag", async () => {
    const result = await repository.delete(new mongoose.Types.ObjectId().toString());
    expect(result).toBe(false);
  });
});
