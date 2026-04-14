import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { CategoryRepositoryMongooseMongo } from "./category.repository.mongoose-mongo";

let mongoServer: MongoMemoryServer;
let repository: CategoryRepositoryMongooseMongo;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  repository = new CategoryRepositoryMongooseMongo();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await mongoose.connection.db!.dropDatabase();
});

describe("CategoryRepositoryMongooseMongo", () => {
  it("should create a category and return entity", async () => {
    const category = await repository.create({
      name: "Skincare",
      slug: "skincare",
      description: "All skincare products",
    });

    expect(category.id).toBeDefined();
    expect(category.name).toBe("Skincare");
    expect(category.slug).toBe("skincare");
    expect(category.description).toBe("All skincare products");
    expect(category.createdAt).toBeInstanceOf(Date);
  });

  it("should find all categories", async () => {
    await repository.create({ name: "Skincare", slug: "skincare", description: "Desc A" });
    await repository.create({ name: "Makeup", slug: "makeup", description: "Desc B" });

    const all = await repository.findAll();
    expect(all).toHaveLength(2);
  });

  it("should find category by slug", async () => {
    await repository.create({ name: "Skincare", slug: "skincare", description: "Desc" });

    const found = await repository.findBySlug("skincare");
    expect(found).not.toBeNull();
    expect(found!.slug).toBe("skincare");
  });

  it("should return null for unknown slug", async () => {
    const found = await repository.findBySlug("unknown-slug");
    expect(found).toBeNull();
  });

  it("should find category by id", async () => {
    const created = await repository.create({ name: "Skincare", slug: "skincare", description: "Desc" });

    const found = await repository.findById(created.id);
    expect(found).not.toBeNull();
    expect(found!.id).toBe(created.id);
  });

  it("should return null for unknown id", async () => {
    const found = await repository.findById(new mongoose.Types.ObjectId().toString());
    expect(found).toBeNull();
  });

  it("should update a category", async () => {
    const created = await repository.create({ name: "Skincare", slug: "skincare", description: "Desc" });

    const updated = await repository.update(created.id, { name: "Updated Skincare" });
    expect(updated).not.toBeNull();
    expect(updated!.name).toBe("Updated Skincare");
  });

  it("should return null when updating non-existent category", async () => {
    const updated = await repository.update(new mongoose.Types.ObjectId().toString(), { name: "X" });
    expect(updated).toBeNull();
  });

  it("should delete a category and return true", async () => {
    const created = await repository.create({ name: "Skincare", slug: "skincare", description: "Desc" });

    const deleted = await repository.delete(created.id);
    expect(deleted).toBe(true);

    const found = await repository.findById(created.id);
    expect(found).toBeNull();
  });

  it("should return false when deleting non-existent category", async () => {
    const deleted = await repository.delete(new mongoose.Types.ObjectId().toString());
    expect(deleted).toBe(false);
  });
});
