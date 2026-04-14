import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { TestimonialRepositoryMongooseMongo } from "./testimonial.repository.mongoose-mongo";

let mongoServer: MongoMemoryServer;
let repository: TestimonialRepositoryMongooseMongo;

const defaultData = {
  authorName: "Jane Doe",
  content: "Excellent product!",
  rating: 5,
  featuredProductIds: ["prod-1"],
  isFeatured: false,
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  repository = new TestimonialRepositoryMongooseMongo();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await mongoose.connection.db!.dropDatabase();
});

describe("TestimonialRepositoryMongooseMongo", () => {
  it("should create a testimonial and return entity", async () => {
    const testimonial = await repository.create(defaultData);

    expect(testimonial.id).toBeDefined();
    expect(testimonial.authorName).toBe("Jane Doe");
    expect(testimonial.content).toBe("Excellent product!");
    expect(testimonial.rating).toBe(5);
    expect(testimonial.featuredProductIds).toEqual(["prod-1"]);
    expect(testimonial.isFeatured).toBe(false);
    expect(testimonial.createdAt).toBeInstanceOf(Date);
  });

  it("should find all testimonials", async () => {
    await repository.create(defaultData);
    await repository.create({ ...defaultData, authorName: "John Smith" });

    const all = await repository.findAll();
    expect(all).toHaveLength(2);
  });

  it("should find only featured testimonials", async () => {
    await repository.create({ ...defaultData, isFeatured: false });
    await repository.create({ ...defaultData, authorName: "Featured Author", isFeatured: true });

    const featured = await repository.findFeatured();
    expect(featured).toHaveLength(1);
    expect(featured[0].isFeatured).toBe(true);
    expect(featured[0].authorName).toBe("Featured Author");
  });

  it("should return empty array when no featured testimonials", async () => {
    await repository.create({ ...defaultData, isFeatured: false });

    const featured = await repository.findFeatured();
    expect(featured).toHaveLength(0);
  });

  it("should find testimonial by id", async () => {
    const created = await repository.create(defaultData);

    const found = await repository.findById(created.id);
    expect(found).not.toBeNull();
    expect(found!.id).toBe(created.id);
  });

  it("should return null for unknown id", async () => {
    const found = await repository.findById(new mongoose.Types.ObjectId().toString());
    expect(found).toBeNull();
  });

  it("should update a testimonial", async () => {
    const created = await repository.create(defaultData);

    const updated = await repository.update(created.id, { authorName: "Updated Author", rating: 4 });
    expect(updated).not.toBeNull();
    expect(updated!.authorName).toBe("Updated Author");
    expect(updated!.rating).toBe(4);
  });

  it("should return null when updating non-existent testimonial", async () => {
    const updated = await repository.update(new mongoose.Types.ObjectId().toString(), { authorName: "X" });
    expect(updated).toBeNull();
  });

  it("should delete a testimonial and return true", async () => {
    const created = await repository.create(defaultData);

    const deleted = await repository.delete(created.id);
    expect(deleted).toBe(true);

    const found = await repository.findById(created.id);
    expect(found).toBeNull();
  });

  it("should return false when deleting non-existent testimonial", async () => {
    const deleted = await repository.delete(new mongoose.Types.ObjectId().toString());
    expect(deleted).toBe(false);
  });
});
