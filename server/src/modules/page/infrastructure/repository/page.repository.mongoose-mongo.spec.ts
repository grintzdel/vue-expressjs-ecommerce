import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { PageRepositoryMongooseMongo } from "./page.repository.mongoose-mongo";

let mongoServer: MongoMemoryServer;
let repository: PageRepositoryMongooseMongo;

const defaultPageData = {
  title: "About Us",
  slug: "about-us",
  content: "Welcome to our company",
  seoMeta: { title: "About | Company", description: "About page" },
  isPublished: true,
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  repository = new PageRepositoryMongooseMongo();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await mongoose.connection.db!.dropDatabase();
});

describe("PageRepositoryMongooseMongo", () => {
  it("should create a page and return entity", async () => {
    const page = await repository.create(defaultPageData);

    expect(page.id).toBeDefined();
    expect(page.title).toBe("About Us");
    expect(page.slug).toBe("about-us");
    expect(page.content).toBe("Welcome to our company");
    expect(page.seoMeta).toEqual({ title: "About | Company", description: "About page" });
    expect(page.isPublished).toBe(true);
    expect(page.createdAt).toBeInstanceOf(Date);
  });

  it("should find all pages", async () => {
    await repository.create(defaultPageData);
    await repository.create({ ...defaultPageData, title: "Contact", slug: "contact" });

    const all = await repository.findAll();
    expect(all).toHaveLength(2);
  });

  it("should find page by slug", async () => {
    await repository.create(defaultPageData);

    const found = await repository.findBySlug("about-us");
    expect(found).not.toBeNull();
    expect(found!.slug).toBe("about-us");
  });

  it("should return null for unknown slug", async () => {
    const found = await repository.findBySlug("unknown-slug");
    expect(found).toBeNull();
  });

  it("should find page by id", async () => {
    const created = await repository.create(defaultPageData);

    const found = await repository.findById(created.id);
    expect(found).not.toBeNull();
    expect(found!.id).toBe(created.id);
  });

  it("should return null for unknown id", async () => {
    const found = await repository.findById(new mongoose.Types.ObjectId().toString());
    expect(found).toBeNull();
  });

  it("should update a page", async () => {
    const created = await repository.create(defaultPageData);

    const updated = await repository.update(created.id, { title: "Updated About" });
    expect(updated).not.toBeNull();
    expect(updated!.title).toBe("Updated About");
  });

  it("should return null when updating non-existent page", async () => {
    const updated = await repository.update(new mongoose.Types.ObjectId().toString(), { title: "X" });
    expect(updated).toBeNull();
  });

  it("should delete a page and return true", async () => {
    const created = await repository.create(defaultPageData);

    const deleted = await repository.delete(created.id);
    expect(deleted).toBe(true);

    const found = await repository.findById(created.id);
    expect(found).toBeNull();
  });

  it("should return false when deleting non-existent page", async () => {
    const deleted = await repository.delete(new mongoose.Types.ObjectId().toString());
    expect(deleted).toBe(false);
  });
});
