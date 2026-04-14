import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { BlogPostRepositoryMongooseMongo } from "./blog-post.repository.mongoose-mongo";

let mongoServer: MongoMemoryServer;
let repository: BlogPostRepositoryMongooseMongo;

const baseData = {
  title: "My First Post",
  slug: "my-first-post",
  content: "This is the content",
  excerpt: "Short excerpt",
  featuredImage: "https://example.com/image.jpg",
  author: "Jane Doe",
  publishedAt: null as Date | null,
  tags: ["skincare"],
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  repository = new BlogPostRepositoryMongooseMongo();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await mongoose.connection.db!.dropDatabase();
});

describe("BlogPostRepositoryMongooseMongo", () => {
  it("should create a blog post and return entity", async () => {
    const blogPost = await repository.create(baseData);

    expect(blogPost.id).toBeDefined();
    expect(blogPost.title).toBe("My First Post");
    expect(blogPost.slug).toBe("my-first-post");
    expect(blogPost.content).toBe("This is the content");
    expect(blogPost.excerpt).toBe("Short excerpt");
    expect(blogPost.featuredImage).toBe("https://example.com/image.jpg");
    expect(blogPost.author).toBe("Jane Doe");
    expect(blogPost.publishedAt).toBeNull();
    expect(blogPost.tags).toEqual(["skincare"]);
    expect(blogPost.createdAt).toBeInstanceOf(Date);
  });

  it("should find all blog posts", async () => {
    await repository.create(baseData);
    await repository.create({ ...baseData, title: "Second Post", slug: "second-post" });

    const all = await repository.findAll();
    expect(all).toHaveLength(2);
  });

  it("should find blog post by slug", async () => {
    await repository.create(baseData);

    const found = await repository.findBySlug("my-first-post");
    expect(found).not.toBeNull();
    expect(found!.slug).toBe("my-first-post");
  });

  it("should return null for unknown slug", async () => {
    const found = await repository.findBySlug("unknown-slug");
    expect(found).toBeNull();
  });

  it("should find blog post by id", async () => {
    const created = await repository.create(baseData);

    const found = await repository.findById(created.id);
    expect(found).not.toBeNull();
    expect(found!.id).toBe(created.id);
  });

  it("should return null for unknown id", async () => {
    const found = await repository.findById(new mongoose.Types.ObjectId().toString());
    expect(found).toBeNull();
  });

  it("should update a blog post", async () => {
    const created = await repository.create(baseData);

    const updated = await repository.update(created.id, { title: "Updated Title" });
    expect(updated).not.toBeNull();
    expect(updated!.title).toBe("Updated Title");
  });

  it("should return null when updating non-existent blog post", async () => {
    const updated = await repository.update(new mongoose.Types.ObjectId().toString(), { title: "X" });
    expect(updated).toBeNull();
  });

  it("should delete a blog post and return true", async () => {
    const created = await repository.create(baseData);

    const deleted = await repository.delete(created.id);
    expect(deleted).toBe(true);

    const found = await repository.findById(created.id);
    expect(found).toBeNull();
  });

  it("should return false when deleting non-existent blog post", async () => {
    const deleted = await repository.delete(new mongoose.Types.ObjectId().toString());
    expect(deleted).toBe(false);
  });
});
